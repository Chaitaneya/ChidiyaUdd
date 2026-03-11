import { GameEntity } from '../types'
import { FALLBACK_ENTITIES } from '../constants'

/**
 * Fisher–Yates shuffle
 * Used so host generates a deterministic deck
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  return arr
}

/**
 * Fetch new entities
 * For now we use fallback entities only.
 * AI generation can be plugged in later safely.
 */
export async function fetchNewGameEntities(): Promise<GameEntity[]> {

  const shuffled = shuffleArray(FALLBACK_ENTITIES)

  return shuffled.map((entity, index) => ({
    ...entity,
    id: `entity-${Date.now()}-${index}`
  }))

}