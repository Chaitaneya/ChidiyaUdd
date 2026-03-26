import { GameEntity, MultiplayerRoom, Player } from '../types'
import { fetchNewGameEntities, shuffleArray } from './geminiService'
import { FALLBACK_ENTITIES } from '../constants'
import { supabase } from './supabaseClient'
import { RealtimeChannel } from '@supabase/supabase-js'

class MultiplayerService {
  private room: MultiplayerRoom | null = null
  private currentPlayerId: string | null = null
  private channel: RealtimeChannel | null = null
  private listeners: ((room: MultiplayerRoom) => void)[] = []
  private heartbeatInterval: NodeJS.Timeout | null = null
  private stateUpdateTimeout: NodeJS.Timeout | null = null
  private isConnected = false
  private lastBroadcastTime: number = 0  // 🔒 Rate limiting tracker
  private readonly BROADCAST_RATE_LIMIT_MS = 100  // Max 1 broadcast per 100ms

  // --------------------------------------------------
  // LISTENERS - Subscription pattern for UI updates
  // --------------------------------------------------

  subscribe(callback: (room: MultiplayerRoom) => void) {
    this.listeners.push(callback)

    // Immediately call with current state if available
    if (this.room) {
      callback(this.room)
    }

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  private notifyListeners() {
    if (!this.room) return

    // Create immutable copy to prevent accidental mutations
    const copy: MultiplayerRoom = {
      ...this.room,
      players: [...this.room.players]
    }

    this.listeners.forEach(callback => callback(copy))
  }

  // --------------------------------------------------
  // GETTERS
  // --------------------------------------------------

  getRoom(): MultiplayerRoom | null {
    return this.room
  }

  getCurrentPlayer(): Player | undefined {
    return this.room?.players.find(p => p.id === this.currentPlayerId)
  }

  isHost(): boolean {
    return this.getCurrentPlayer()?.isHost ?? false
  }

  // --------------------------------------------------
  // CREATE ROOM - Host starts here
  // --------------------------------------------------

  // 🔒 SECURITY: Validate player name to prevent XSS/injection
  private validatePlayerName(name: string): boolean {
    if (!name || typeof name !== 'string') return false
    const trimmed = name.trim()
    // Check length (1-20 characters)
    if (trimmed.length === 0 || trimmed.length > 20) return false
    // Allow only alphanumeric, spaces, and underscores
    // Prevents HTML/script injection
    if (!/^[a-zA-Z0-9_\s]+$/.test(trimmed)) return false
    return true
  }

  async createRoom(playerName: string): Promise<string> {
    // 🔒 Validate player name before using
    if (!this.validatePlayerName(playerName)) {
      throw new Error('Invalid player name. Use only letters, numbers, spaces, and underscores (1-20 chars)')
    }

    // Generate unique 4-character room code
    const code = Math.random().toString(36).substring(2, 6).toUpperCase()

    // Generate unique host ID
    this.currentPlayerId = `host-${Date.now()}`

    // Initialize with fallback entities (host will refresh these)
    const entities = shuffleArray(FALLBACK_ENTITIES).map((item, i) => ({
      ...item,
      id: `init-${Date.now()}-${i}`
    }))

    // Create host player object
    const host: Player = {
      id: this.currentPlayerId,
      name: playerName,
      isHost: true,
      score: 0,
      lives: 3,
      isReady: true,
      status: 'alive'
    }

    // Initialize room state
    this.room = {
      code,
      players: [host],
      status: 'waiting',
      entities,
      roundCount: -1
    }

    // Connect to realtime channel for this room and wait for it
    try {
      await this.connectToChannel(code)
    } catch (err) {
      console.error('Failed to connect to channel:', err)
      throw err
    }

    // Fetch better game entities asynchronously
    fetchNewGameEntities().then(aiEntities => {
      if (!this.room) return
      if (this.room.status !== 'waiting') return

      // Update with AI-generated entities
      this.room.entities = aiEntities
      this.broadcastRoom()
    }).catch(err => {
      console.error('Failed to fetch AI entities:', err)
      // Continue with fallback entities
    })

    return code
  }

  // --------------------------------------------------
  // JOIN ROOM - Non-host player joins here
  // --------------------------------------------------

  async joinRoom(code: string, playerName: string): Promise<void> {
    // 🔒 Validate player name before using
    if (!this.validatePlayerName(playerName)) {
      throw new Error('Invalid player name. Use only letters, numbers, spaces, and underscores (1-20 chars)')
    }

    // Generate unique player ID
    this.currentPlayerId = `p-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Create player object
    const me: Player = {
      id: this.currentPlayerId,
      name: playerName,
      isHost: false,
      score: 0,
      lives: 3,
      isReady: true,
      status: 'alive'
    }

    // Connect to room's channel and wait for subscription
    await this.connectToChannel(code)

    // Only send join request after channel is ready
    if (this.channel && this.isConnected) {
      this.channel.send({
        type: 'broadcast',
        event: 'JOIN_REQUEST',
        payload: { player: me }
      })
    } else {
      console.warn('Channel not ready for JOIN_REQUEST')
    }
  }

  // --------------------------------------------------
  // UPDATE PLAYER STATE - Called during gameplay
  // --------------------------------------------------

  updatePlayerState(score: number, lives: number): void {
    if (!this.room || !this.currentPlayerId) return

    const player = this.room.players.find(p => p.id === this.currentPlayerId)
    if (!player) return

    // Update local state
    player.score = score
    player.lives = lives
    player.status = lives <= 0 ? 'eliminated' : 'alive'

    // Debounce state broadcasts to avoid flooding the network
    // Only send every 500ms maximum
    if (this.stateUpdateTimeout) {
      clearTimeout(this.stateUpdateTimeout)
    }

    this.stateUpdateTimeout = setTimeout(() => {
      if (!this.channel) return

      // 🔒 RATE LIMITING: Prevent realtime channel spam/DoS
      const now = Date.now()
      if (now - this.lastBroadcastTime < this.BROADCAST_RATE_LIMIT_MS) {
        // Skip this broadcast if too soon after last one
        return
      }
      this.lastBroadcastTime = now

      this.channel.send({
        type: 'broadcast',
        event: 'PLAYER_STATE',
        payload: {
          playerId: this.currentPlayerId,
          score,
          lives,
          status: player.status
        }
      })
      this.stateUpdateTimeout = null
    }, 100) // Debounce for 100ms
  }

  // --------------------------------------------------
  // START GAME - Only host can call this
  // --------------------------------------------------

  startGame(): void {
    if (!this.room) return

    const me = this.getCurrentPlayer()
    if (!me?.isHost) {
      console.warn('Only host can start game')
      return
    }

    // Transition room to playing state
    this.room.status = 'playing'

    // Broadcast updated room state to all players
    this.broadcastRoom()

    // Start heartbeat to detect disconnects
    this.startHeartbeat()
  }

  // --------------------------------------------------
  // HEARTBEAT - Detect disconnected players
  // --------------------------------------------------

  private startHeartbeat(): void {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)

    this.heartbeatInterval = setInterval(() => {
      if (!this.channel || !this.currentPlayerId) return

      // Send heartbeat to let other players know we're alive
      this.channel.send({
        type: 'broadcast',
        event: 'PLAYER_HEARTBEAT',
        payload: { playerId: this.currentPlayerId, timestamp: Date.now() }
      })
    }, 5000) // Send heartbeat every 5 seconds
  }

  // --------------------------------------------------
  // LEAVE ROOM - Cleanup and disconnect
  // --------------------------------------------------

  leaveRoom(): void {
    // Notify other players that we're leaving
    if (this.channel && this.currentPlayerId) {
      this.channel.send({
        type: 'broadcast',
        event: 'PLAYER_LEFT',
        payload: { playerId: this.currentPlayerId }
      })

      this.channel.unsubscribe()
    }

    // Clear all local state
    this.room = null
    this.currentPlayerId = null
    this.isConnected = false

    // Clear timers
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.stateUpdateTimeout) {
      clearTimeout(this.stateUpdateTimeout)
      this.stateUpdateTimeout = null
    }

    // Notify UI that we've left
    this.notifyListeners()
  }

  // --------------------------------------------------
  // CHANNEL CONNECTION - Setup realtime listeners
  // --------------------------------------------------

  private connectToChannel(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Disconnect from previous channel if any
        if (this.channel) {
          this.channel.unsubscribe()
        }

        // Create new channel for this room
        this.channel = supabase.channel(`room-${code}`, {
          config: { broadcast: { self: true } }
        })

        // Handler: Room state update from host
        this.channel.on('broadcast', { event: 'ROOM_UPDATE' }, ({ payload }) => {
          this.room = payload.room
          this.notifyListeners()
        })

        // Handler: New player requesting to join (host receives)
        this.channel.on('broadcast', { event: 'JOIN_REQUEST' }, ({ payload }) => {
          const me = this.getCurrentPlayer()

          // Only host processes join requests
          if (!me?.isHost) return
          if (!this.room) return

          const newPlayer = payload.player
          const playerExists = this.room.players.some(p => p.id === newPlayer.id)

          if (!playerExists) {
            this.room.players.push(newPlayer)
            // Broadcast updated room to all players
            this.broadcastRoom()
          }
        })

        // Handler: Player state update (score/lives)
        this.channel.on('broadcast', { event: 'PLAYER_STATE' }, ({ payload }) => {
          if (!this.room) return

          const { playerId, score, lives, status } = payload
          const player = this.room.players.find(p => p.id === playerId)

          if (!player) return

          player.score = score
          player.lives = lives
          player.status = status

          this.notifyListeners()

          // Check if game is now over (all players eliminated)
          this.checkGameOver()
        })

        // Handler: Player left the room
        this.channel.on('broadcast', { event: 'PLAYER_LEFT' }, ({ payload }) => {
          if (!this.room) return

          const player = this.room.players.find(p => p.id === payload.playerId)
          if (player) {
            player.status = 'eliminated'
            this.notifyListeners()
          }
        })

        // Handler: Heartbeat from other players (confirming connectivity)
        this.channel.on('broadcast', { event: 'PLAYER_HEARTBEAT' }, ({ payload }) => {
          // Just log the heartbeat - you can extend this to detect timeouts
          // console.log(`Heartbeat from ${payload.playerId} at ${payload.timestamp}`)
        })

        // Subscribe and wait for connection
        this.channel.subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            this.isConnected = true
            resolve()
          } else if (status === 'CHANNEL_ERROR' || err) {
            this.isConnected = false
            console.error('Channel subscription failed:', status, err)
            reject(new Error(`Channel subscription failed: ${status}`))
          }
        })
      } catch (error) {
        console.error('Error connecting to channel:', error)
        reject(error)
      }
    })
  }

  // --------------------------------------------------
  // CHECK GAME OVER - Synchronized end-game detection
  // --------------------------------------------------

  private checkGameOver(): void {
    if (!this.room) return

    // Check if all players are eliminated
    const alivePlayers = this.room.players.filter(p => p.status === 'alive' && p.lives > 0)

    if (alivePlayers.length === 0 && this.room.players.length > 0) {
      // All players are dead - game is finished
      this.room.status = 'finished'
      this.broadcastRoom()
    }
  }

  // --------------------------------------------------
  // BROADCAST ROOM - Send room state to all players
  // --------------------------------------------------

  private broadcastRoom(): void {
    if (!this.room || !this.channel) return

    // 🔒 RATE LIMITING: Prevent realtime channel spam
    const now = Date.now()
    if (now - this.lastBroadcastTime < this.BROADCAST_RATE_LIMIT_MS) {
      // Still notify listeners locally (optimistic)
      this.notifyListeners()
      return
    }
    this.lastBroadcastTime = now

    // Notify local listeners first (optimistic update)
    this.notifyListeners()

    // Broadcast to network
    this.channel.send({
      type: 'broadcast',
      event: 'ROOM_UPDATE',
      payload: { room: this.room }
    })
  }
}

// Export singleton instance
export const multiplayer = new MultiplayerService()