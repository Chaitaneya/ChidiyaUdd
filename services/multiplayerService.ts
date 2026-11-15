import type { RealtimeChannel } from '@supabase/supabase-js'
import { DeckMode, MultiplayerRoom, Player, RoundOutcome } from '../types'
import { FASTEST_BONUS, MAX_LIVES, SYNC_MIN_MS, SYNC_START_MS, SYNC_STEP_MS } from '../constants'
import { createDeck, minRoundMs, speechRateFor } from './entityService'
import { supabase } from './supabaseClient'

// No 0/O or 1/I so codes are easy to read out to friends.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const ROOM_CODE_LENGTH = 4
export const PLAYER_NAME_MAX = 16
export const MAX_PLAYERS = 8
export const MIN_PLAYERS_TO_START = 2

const JOIN_TIMEOUT_MS = 6000
const CONNECT_TIMEOUT_MS = 10000
// Supabase Realtime allows ~10 messages/second per client by default.
const SEND_INTERVAL_MS = 100
/** "GET READY" before the first card of a match. */
export const COUNTDOWN_MS = 3000
/** Extra time the host waits for answers to arrive over the network. */
const ANSWER_GRACE_MS = 600
/** Pause on the result (and the "why" line) before the next card. */
const RESULT_PAUSE_MS = 2200

// Letters/marks in any script (so Hindi names work), digits, spaces, underscores.
const NAME_PATTERN = /^[\p{L}\p{M}\p{N}_ ]+$/u

type Listener = (room: MultiplayerRoom) => void

export type RoundEvent =
  | { type: 'start'; matchId: number; round: number; durationMs: number; rate: number }
  | { type: 'result'; matchId: number; round: number; outcomes: Record<string, RoundOutcome> }

interface QueuedMessage {
  event: string
  /** Built at send time so a queued room update always carries the latest state. */
  payload: () => Record<string, unknown>
  /** Messages with the same key replace each other while waiting in the queue. */
  key?: string
}

// --------------------------------------------------
// Helpers shared with the UI
// --------------------------------------------------

/** Trim, collapse spaces and drop characters that aren't allowed in names. */
export function sanitizePlayerName(raw: string): string {
  return Array.from(raw.replace(/\s+/g, ' ').trimStart())
    .filter((ch) => NAME_PATTERN.test(ch))
    .join('')
    .slice(0, PLAYER_NAME_MAX)
}

/** Returns an error message, or null when the name is valid. */
export function validatePlayerName(name: string): string | null {
  const trimmed = name.trim()
  if (!trimmed) return 'PLEASE ENTER YOUR NAME'
  if (Array.from(trimmed).length > PLAYER_NAME_MAX) return `NAME MUST BE ${PLAYER_NAME_MAX} CHARACTERS OR LESS`
  if (!NAME_PATTERN.test(trimmed)) return 'USE LETTERS, NUMBERS AND SPACES ONLY'
  return null
}

/** Uppercase and keep only characters that can appear in a room code. */
export function normalizeRoomCode(raw: string): string {
  return Array.from(raw.toUpperCase())
    .filter((ch) => CODE_ALPHABET.includes(ch))
    .join('')
    .slice(0, ROOM_CODE_LENGTH)
}

/**
 * Final standings: last one standing wins, then whoever went out later,
 * then score.
 */
export function rankPlayers(players: Player[]): Player[] {
  const outAt = (p: Player) => (p.status === 'alive' ? Infinity : p.outRound ?? -1)
  return [...players].sort((a, b) => outAt(b) - outAt(a) || b.score - a.score)
}

function randomId(prefix: string): string {
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  return `${prefix}-${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`
}

function generateRoomCode(): string {
  const bytes = new Uint8Array(ROOM_CODE_LENGTH)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

function newPlayer(id: string, name: string, isHost: boolean): Player {
  return { id, name, isHost, score: 0, lives: MAX_LIVES, status: 'alive' }
}

/** Length of a synced round: speeds up every round, but long names get time to be heard. */
function roundTiming(round: number, entity: MultiplayerRoom['entities'][number]) {
  const curve = Math.max(SYNC_MIN_MS, SYNC_START_MS - round * SYNC_STEP_MS)
  const rate = speechRateFor((SYNC_START_MS - curve) / (SYNC_START_MS - SYNC_MIN_MS))
  return { durationMs: Math.max(curve, minRoundMs(entity, rate)), rate }
}

// --------------------------------------------------
// Service
// --------------------------------------------------

/**
 * Rooms over Supabase Realtime broadcast.
 *
 * The host is the referee: it owns the room (players, deck, status), runs the
 * round clock, collects FLY taps and scores every round. All players see the
 * same card at the same moment; reaction times are measured on each player's
 * own device so network lag doesn't count against them.
 */
class MultiplayerService {
  private room: MultiplayerRoom | null = null
  private currentPlayerId: string | null = null
  private channel: RealtimeChannel | null = null
  private listeners = new Set<Listener>()
  private roundListeners = new Set<(event: RoundEvent) => void>()
  private lastRoundEvent: RoundEvent | null = null

  private queue: QueuedMessage[] = []
  private flushTimer: ReturnType<typeof setTimeout> | null = null
  private lastSentAt = 0

  // Host-only round state
  private hostTimers = new Set<ReturnType<typeof setTimeout>>()
  private currentRound: { matchId: number; round: number; answers: Map<string, number>; resolved: boolean } | null = null
  private streaks = new Map<string, number>()

  private pendingJoin: {
    resolve: () => void
    reject: (err: Error) => void
    timer: ReturnType<typeof setTimeout>
  } | null = null

  get isAvailable(): boolean {
    return supabase !== null
  }

  // ---------------- Listeners ----------------

  subscribe(callback: Listener): () => void {
    this.listeners.add(callback)
    if (this.room) callback(this.snapshot(this.room))
    return () => {
      this.listeners.delete(callback)
    }
  }

  /** Round start/result events. Replays the round in progress to a late subscriber. */
  subscribeRounds(callback: (event: RoundEvent) => void): () => void {
    this.roundListeners.add(callback)
    const last = this.lastRoundEvent
    if (last && last.type === 'start' && last.matchId === this.room?.matchId) callback(last)
    return () => {
      this.roundListeners.delete(callback)
    }
  }

  private snapshot(room: MultiplayerRoom): MultiplayerRoom {
    return { ...room, players: room.players.map((p) => ({ ...p })) }
  }

  private notify() {
    if (!this.room) return
    const copy = this.snapshot(this.room)
    this.listeners.forEach((cb) => cb(copy))
  }

  private emitRound(event: RoundEvent) {
    this.lastRoundEvent = event
    this.roundListeners.forEach((cb) => cb(event))
  }

  // ---------------- Getters ----------------

  getRoom(): MultiplayerRoom | null {
    return this.room
  }

  getCurrentPlayer(): Player | undefined {
    return this.room?.players.find((p) => p.id === this.currentPlayerId)
  }

  isHost(): boolean {
    return this.getCurrentPlayer()?.isHost ?? false
  }

  // ---------------- Create / join ----------------

  async createRoom(playerName: string, deckMode: DeckMode = 'family'): Promise<string> {
    if (!supabase) throw new Error('MULTIPLAYER IS NOT AVAILABLE')
    const nameError = validatePlayerName(playerName)
    if (nameError) throw new Error(nameError)

    await this.teardown()

    const code = generateRoomCode()
    this.currentPlayerId = randomId('host')
    this.room = {
      code,
      players: [newPlayer(this.currentPlayerId, playerName.trim(), true)],
      status: 'waiting',
      deckMode,
      entities: [],
      matchId: 0,
    }

    try {
      await this.connect(code)
    } catch (err) {
      await this.teardown()
      throw err
    }

    this.notify()
    return code
  }

  async joinRoom(rawCode: string, playerName: string): Promise<void> {
    if (!supabase) throw new Error('MULTIPLAYER IS NOT AVAILABLE')
    const nameError = validatePlayerName(playerName)
    if (nameError) throw new Error(nameError)
    const code = normalizeRoomCode(rawCode)
    if (code.length !== ROOM_CODE_LENGTH) throw new Error(`CODE MUST BE ${ROOM_CODE_LENGTH} CHARACTERS`)

    await this.teardown()

    this.currentPlayerId = randomId('p')
    const me = newPlayer(this.currentPlayerId, playerName.trim(), false)

    try {
      await this.connect(code)
      // Wait for the host to add us; no answer means there's no host on this code.
      await new Promise<void>((resolve, reject) => {
        this.pendingJoin = {
          resolve,
          reject,
          timer: setTimeout(() => reject(new Error('ROOM NOT FOUND')), JOIN_TIMEOUT_MS),
        }
        this.sendNow('JOIN_REQUEST', { player: me })
      })
    } catch (err) {
      await this.teardown()
      throw err
    } finally {
      if (this.pendingJoin) clearTimeout(this.pendingJoin.timer)
      this.pendingJoin = null
    }
  }

  // ---------------- Host controls ----------------

  /** Host only, between matches. */
  setDeckMode(mode: DeckMode): void {
    if (!this.room || !this.isHost() || this.room.status === 'playing') return
    this.room.deckMode = mode
    this.broadcastRoom()
    this.notify()
  }

  /** Host only. Returns false if there aren't enough players yet. */
  startGame(): boolean {
    if (!this.room || !this.isHost() || this.room.status === 'playing') return false
    const players = this.room.players.filter((p) => p.status !== 'left')
    if (players.length < MIN_PLAYERS_TO_START) return false

    this.clearHostTimers()
    this.streaks.clear()
    this.lastRoundEvent = null
    this.room = {
      ...this.room,
      status: 'playing',
      matchId: this.room.matchId + 1,
      entities: createDeck(this.room.deckMode, 'mp'),
      players: players.map((p) => ({ ...p, score: 0, lives: MAX_LIVES, status: 'alive' as const, outRound: undefined })),
    }
    this.broadcastRoom()
    this.notify()
    this.hostLater(() => this.hostStartRound(0), COUNTDOWN_MS)
    return true
  }

  // ---------------- Playing ----------------

  /** The local player tapped FLY in `round`, `reactionMs` after the card appeared. */
  submitAnswer(round: number, reactionMs: number): void {
    const me = this.getCurrentPlayer()
    if (!this.room || !me || this.room.status !== 'playing' || me.status !== 'alive') return
    const matchId = this.room.matchId
    if (me.isHost) this.recordAnswer(me.id, matchId, round, reactionMs)
    else this.sendNow('ANSWER', { matchId, round, playerId: me.id, reactionMs: Math.round(reactionMs) })
  }

  leaveRoom(): void {
    if (this.channel && this.currentPlayerId) {
      this.sendNow('PLAYER_LEFT', { playerId: this.currentPlayerId })
    }
    void this.teardown()
  }

  // ---------------- Host round loop ----------------

  private hostLater(fn: () => void, ms: number) {
    const timer = setTimeout(() => {
      this.hostTimers.delete(timer)
      fn()
    }, ms)
    this.hostTimers.add(timer)
  }

  private clearHostTimers() {
    this.hostTimers.forEach((t) => clearTimeout(t))
    this.hostTimers.clear()
    this.currentRound = null
  }

  private alivePlayers() {
    return this.room?.players.filter((p) => p.status === 'alive') ?? []
  }

  private hostStartRound(round: number) {
    const room = this.room
    if (!room || !this.isHost() || room.status !== 'playing') return
    const entity = room.entities[round]
    if (!entity || this.alivePlayers().length <= 1) return this.hostFinish()

    const { durationMs, rate } = roundTiming(round, entity)
    this.currentRound = { matchId: room.matchId, round, answers: new Map(), resolved: false }
    const event: RoundEvent = { type: 'start', matchId: room.matchId, round, durationMs, rate }
    this.sendNow('ROUND_START', { event })
    this.emitRound(event)
    this.hostLater(() => this.hostResolveRound(), durationMs + ANSWER_GRACE_MS)
  }

  private recordAnswer(playerId: string, matchId: number, round: number, reactionMs: number) {
    const cr = this.currentRound
    if (!cr || cr.resolved || cr.matchId !== matchId || cr.round !== round) return
    const player = this.room?.players.find((p) => p.id === playerId)
    if (!player || player.status !== 'alive' || cr.answers.has(playerId)) return
    cr.answers.set(playerId, Math.max(0, Number(reactionMs) || 0))
  }

  private hostResolveRound() {
    const room = this.room
    const cr = this.currentRound
    if (!room || !cr || cr.resolved) return
    cr.resolved = true
    const entity = room.entities[cr.round]

    // Fastest correct FLY earns a bonus.
    let fastestId: string | null = null
    if (entity.canFly) {
      let best = Infinity
      for (const [id, ms] of cr.answers) {
        if (ms < best) {
          best = ms
          fastestId = id
        }
      }
    }

    const outcomes: Record<string, RoundOutcome> = {}
    for (const p of room.players) {
      if (p.status !== 'alive') continue
      const tapped = cr.answers.has(p.id)
      const correct = entity.canFly ? tapped : !tapped
      const fastest = fastestId === p.id
      let gained = 0
      if (correct) {
        const streak = (this.streaks.get(p.id) ?? 0) + 1
        this.streaks.set(p.id, streak)
        gained = 10 + Math.min(streak, 10) * 2 + (fastest ? FASTEST_BONUS : 0)
        p.score += gained
      } else {
        this.streaks.set(p.id, 0)
        p.lives = Math.max(0, p.lives - 1)
        if (p.lives === 0) {
          p.status = 'eliminated'
          p.outRound = cr.round
        }
      }
      outcomes[p.id] = { tapped, correct, gained, fastest }
    }

    const over = this.alivePlayers().length <= 1 || cr.round + 1 >= room.entities.length
    if (over) room.status = 'finished'

    const event: RoundEvent = { type: 'result', matchId: room.matchId, round: cr.round, outcomes }
    this.sendNow('ROUND_RESULT', { event, players: room.players, status: room.status })
    this.emitRound(event)
    this.notify()

    if (!over) this.hostLater(() => this.hostStartRound(cr.round + 1), RESULT_PAUSE_MS)
  }

  private hostFinish() {
    if (!this.room || this.room.status !== 'playing') return
    this.clearHostTimers()
    this.room.status = 'finished'
    this.broadcastRoom()
    this.notify()
  }

  // ---------------- Incoming messages ----------------

  private handlePlayerGone(playerId: string) {
    if (!this.room || playerId === this.currentPlayerId) return
    const player = this.room.players.find((p) => p.id === playerId)
    if (!player || player.status === 'left') return

    if (player.isHost) {
      // The host runs the match, so without them the room is over.
      if (this.room.status === 'playing') {
        player.status = 'left'
        player.outRound = -1
      } else {
        this.room.players = this.room.players.filter((p) => p.id !== playerId)
      }
      this.room.status = 'closed'
      this.notify()
      return
    }

    if (this.room.status === 'playing') {
      // Keep them on the scoreboard, but they're out of this match.
      player.status = 'left'
      player.lives = 0
      player.outRound = this.currentRound?.round ?? -1
    } else {
      this.room.players = this.room.players.filter((p) => p.id !== playerId)
    }

    if (this.isHost()) this.broadcastRoom()
    this.notify()
  }

  private handleJoinRequest(player: Player) {
    if (!this.room || !this.isHost() || !player?.id) return

    const reject = (reason: string) => this.sendNow('JOIN_REJECTED', { playerId: player.id, reason })

    if (this.room.status === 'playing') return reject('MATCH ALREADY IN PROGRESS')
    if (this.room.status === 'closed') return reject('ROOM NOT FOUND')

    const exists = this.room.players.some((p) => p.id === player.id)
    if (!exists) {
      const active = this.room.players.filter((p) => p.status !== 'left')
      if (active.length >= MAX_PLAYERS) return reject('ROOM IS FULL')
      const name = typeof player.name === 'string' ? player.name.slice(0, PLAYER_NAME_MAX) : 'PLAYER'
      this.room.players.push(newPlayer(player.id, name, false))
      this.notify()
    }
    // Always answer, even for a duplicate request, so the joiner gets the room.
    this.broadcastRoom()
  }

  private handleRoomUpdate(incoming: MultiplayerRoom) {
    if (!incoming || this.isHost()) return // the host is the source of truth

    if (this.pendingJoin) {
      if (!incoming.players.some((p) => p.id === this.currentPlayerId)) return
      this.room = incoming
      this.pendingJoin.resolve()
      this.notify()
      return
    }

    if (!this.room) return
    if (incoming.matchId !== this.room.matchId) this.lastRoundEvent = null
    this.room = incoming
    this.notify()
  }

  private handleRoundStart(event: RoundEvent) {
    if (this.isHost() || !this.room || event?.type !== 'start' || event.matchId !== this.room.matchId) return
    this.emitRound(event)
  }

  private handleRoundResult(payload: { event: RoundEvent; players: Player[]; status: MultiplayerRoom['status'] }) {
    const event = payload?.event
    if (this.isHost() || !this.room || event?.type !== 'result' || event.matchId !== this.room.matchId) return
    if (Array.isArray(payload.players)) this.room.players = payload.players
    if (payload.status) this.room.status = payload.status
    this.emitRound(event)
    this.notify()
  }

  private connect(code: string): Promise<void> {
    const client = supabase
    if (!client) return Promise.reject(new Error('MULTIPLAYER IS NOT AVAILABLE'))
    const playerId = this.currentPlayerId!

    const channel = client.channel(`room-${code}`, {
      config: {
        broadcast: { self: false },
        presence: { key: playerId },
      },
    })
    this.channel = channel

    channel
      .on('broadcast', { event: 'ROOM_UPDATE' }, ({ payload }) => this.handleRoomUpdate(payload?.room))
      .on('broadcast', { event: 'JOIN_REQUEST' }, ({ payload }) => this.handleJoinRequest(payload?.player))
      .on('broadcast', { event: 'JOIN_REJECTED' }, ({ payload }) => {
        if (payload?.playerId === this.currentPlayerId && this.pendingJoin) {
          this.pendingJoin.reject(new Error(String(payload.reason || 'COULD NOT JOIN ROOM')))
        }
      })
      .on('broadcast', { event: 'ROUND_START' }, ({ payload }) => this.handleRoundStart(payload?.event))
      .on('broadcast', { event: 'ROUND_RESULT' }, ({ payload }) => this.handleRoundResult(payload))
      .on('broadcast', { event: 'ANSWER' }, ({ payload }) => {
        if (this.isHost() && payload) this.recordAnswer(payload.playerId, payload.matchId, payload.round, payload.reactionMs)
      })
      .on('broadcast', { event: 'PLAYER_LEFT' }, ({ payload }) => this.handlePlayerGone(payload?.playerId))
      // Presence notices closed tabs and lost connections, not just "Leave" clicks.
      .on('presence', { event: 'leave' }, ({ key }) => this.handlePlayerGone(key))

    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('COULD NOT CONNECT. CHECK YOUR INTERNET')), CONNECT_TIMEOUT_MS)
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          clearTimeout(timer)
          void channel.track({ playerId })
          resolve()
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          clearTimeout(timer)
          reject(new Error('COULD NOT CONNECT. CHECK YOUR INTERNET'))
        }
      })
    })
  }

  private async teardown() {
    if (this.flushTimer) clearTimeout(this.flushTimer)
    this.flushTimer = null
    this.queue = []
    this.clearHostTimers()
    this.streaks.clear()
    this.lastRoundEvent = null

    const channel = this.channel
    this.channel = null
    this.room = null
    this.currentPlayerId = null

    if (channel && supabase) {
      try {
        await supabase.removeChannel(channel)
      } catch {
        /* already closed */
      }
    }
  }

  // ---------------- Sending ----------------

  private broadcastRoom() {
    this.enqueue({
      event: 'ROOM_UPDATE',
      key: 'room',
      payload: () => ({ room: this.room }),
    })
  }

  /** Rate-limited send: messages wait their turn instead of being dropped. */
  private enqueue(message: QueuedMessage) {
    if (message.key) this.queue = this.queue.filter((m) => m.key !== message.key)
    this.queue.push(message)
    this.scheduleFlush()
  }

  private scheduleFlush() {
    if (this.flushTimer || this.queue.length === 0) return
    const wait = Math.max(0, this.lastSentAt + SEND_INTERVAL_MS - Date.now())
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null
      const message = this.queue.shift()
      if (message) this.sendNow(message.event, message.payload())
      this.scheduleFlush()
    }, wait)
  }

  /** Time-critical messages (round start/result, answers) skip the queue. */
  private sendNow(event: string, payload: Record<string, unknown>) {
    if (!this.channel) return
    this.lastSentAt = Date.now()
    void this.channel.send({ type: 'broadcast', event, payload })
  }
}

export const multiplayer = new MultiplayerService()
