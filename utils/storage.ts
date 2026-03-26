/**
 * Encrypted localStorage utilities with basic XOR encryption
 * For game data like high scores that need persistence
 * 🔒 SECURITY: Prevents casual tampering, not cryptographically secure
 */

const STORAGE_KEY_PREFIX = 'chidiya_'
const SECRET_KEY = 'chidiya_udd_secret_2026'

/**
 * Simple XOR encryption for obfuscating data
 * NOT cryptographically secure - for casual tamper prevention only
 * For truly sensitive data, use proper encryption libraries
 */
function xorEncrypt(text: string, key: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return btoa(result) // Base64 encode
}

function xorDecrypt(encoded: string, key: string): string {
  try {
    const text = atob(encoded) // Base64 decode
    let result = ''
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return result
  } catch {
    console.warn('Failed to decrypt storage value')
    return ''
  }
}

/**
 * Save encrypted data to localStorage
 * 🔒 Prevents casual inspection of game data
 */
export function saveEncrypted(key: string, value: string): void {
  try {
    const fullKey = STORAGE_KEY_PREFIX + key
    const encrypted = xorEncrypt(value, SECRET_KEY)
    localStorage.setItem(fullKey, encrypted)
  } catch (err) {
    console.error('Failed to save encrypted data:', err)
  }
}

/**
 * Retrieve and decrypt data from localStorage
 * Returns empty string if not found or decryption fails
 */
export function getDecrypted(key: string): string {
  try {
    const fullKey = STORAGE_KEY_PREFIX + key
    const encrypted = localStorage.getItem(fullKey)
    if (!encrypted) return ''
    return xorDecrypt(encrypted, SECRET_KEY)
  } catch (err) {
    console.error('Failed to retrieve encrypted data:', err)
    return ''
  }
}

/**
 * Save high score with encryption
 */
export function saveHighScore(score: number): void {
  saveEncrypted('highscore', score.toString())
}

/**
 * Get high score with decryption
 */
export function getHighScore(): number {
  const value = getDecrypted('highscore')
  const score = parseInt(value, 10)
  return isNaN(score) ? 0 : score
}

/**
 * Clear all game data from localStorage
 */
export function clearGameData(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (err) {
    console.error('Failed to clear game data:', err)
  }
}
