import { Card, DeckMode, GameEntity } from '../types'
import { CARDS } from '../constants'
import type { SpokenCall } from './audioService'

const DEVANAGARI = /[ऀ-ॿ]/
const UDD = 'उड़'

// Catch data mistakes while developing: every card needs Hindi and a "why",
// and no two cards may share a word or emoji with opposite answers.
if (import.meta.env.DEV) {
  const problems: string[] = []
  const seen = new Map<string, Card>()
  for (const card of CARDS) {
    if (!DEVANAGARI.test(card.hindi)) problems.push(`${card.name}: hindi is not in Devanagari`)
    if (!card.why) problems.push(`${card.name}: missing "why"`)
    for (const key of [`hindi:${card.hindi}`, `emoji:${card.emoji}`, `name:${card.name.toLowerCase()}`]) {
      const other = seen.get(key)
      if (other && other.canFly !== card.canFly) problems.push(`${card.name} vs ${other.name}: same ${key.split(':')[0]}, opposite answers`)
      if (key.startsWith('name:') && other) problems.push(`${card.name}: duplicate name`)
      seen.set(key, card)
    }
  }
  if (problems.length) console.warn(`Card data problems:\n- ${problems.join('\n- ')}`)
}

/** Fisher–Yates shuffle (returns a new array). */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** The cards in a deck mode (Masala = every card, Family = kid-safe only). */
export function cardsFor(mode: DeckMode): Card[] {
  return mode === 'masala' ? CARDS : CARDS.filter((c) => !c.masala)
}

/**
 * A freshly shuffled deck with unique ids. `avoidFirst` stops a new deck
 * starting with the card the previous one ended on.
 */
export function createDeck(mode: DeckMode, prefix = 'card', avoidFirst?: GameEntity): GameEntity[] {
  const deck = shuffleArray(cardsFor(mode))
  if (avoidFirst && deck.length > 1 && deck[0].name === avoidFirst.name) {
    ;[deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]]
  }
  const stamp = Date.now()
  return deck.map((card, index) => ({ ...card, id: `${prefix}-${stamp}-${index}` }))
}

/** The playground call: "तोता उड़!" (cards already ending in उड़ aren't doubled). */
export function getSpokenText(entity: Card): string {
  const word = entity.hindi.trim()
  return word.endsWith(UDD) ? `${word}!` : `${word} ${UDD}!`
}

/** The call in both scripts, so English-language voices can say it too ("Tota udd!"). */
export function getCall(entity: Card): SpokenCall {
  const name = entity.name.trim()
  return { hindi: getSpokenText(entity), latin: /\budd$/i.test(name) ? `${name}!` : `${name} udd!` }
}

/** Talk faster as the game speeds up (0 = start, 1 = top speed). */
export function speechRateFor(progress: number): number {
  return 1 + Math.min(Math.max(progress, 0), 1) * 0.4
}

/**
 * Shortest fair round for a card: enough time to hear the name at this
 * speech rate, plus a moment to react. Measured with the Hindi voice:
 * roughly 260ms + 64ms per character, divided by the rate.
 */
export function minRoundMs(entity: Card, rate: number): number {
  const chars = Array.from(entity.hindi).length
  return Math.round((260 + 64 * chars) / rate) + 300
}

/** How long it takes to say the full call ("… उड़!") at this rate. */
export function callDurationMs(entity: Card, rate: number): number {
  const chars = Array.from(getSpokenText(entity)).length
  return Math.round((260 + 64 * chars) / rate)
}
