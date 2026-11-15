import type { Session, Subscription } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

class AuthService {
  /** Reports the current session now and on every change. */
  async initAuthListener(callback: (session: Session | null) => void): Promise<Subscription | null> {
    if (!supabase) {
      callback(null)
      return null
    }

    const { data: { session } } = await supabase.auth.getSession()
    callback(session)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      callback(newSession)
    })
    return subscription
  }

  /**
   * Redirects to Google. The OAuth return URL is always this site's own
   * origin; Supabase also checks it against the project's allowed redirect URLs.
   */
  async signInWithGoogle(): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Login is not configured') }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return { error }
  }

  async signOut(): Promise<Error | null> {
    if (!supabase) return null
    const { error } = await supabase.auth.signOut()
    return error
  }
}

export const authService = new AuthService()

const LOGIN_INTENT_KEY = 'chidiya_login_intent'

/** Remember where to go once Google redirects back after login. */
export function rememberLoginIntent(intent: 'multiplayer') {
  try {
    sessionStorage.setItem(LOGIN_INTENT_KEY, intent)
  } catch {
    /* storage unavailable */
  }
}

/** Read and clear the remembered post-login destination. */
export function consumeLoginIntent(): string | null {
  try {
    const intent = sessionStorage.getItem(LOGIN_INTENT_KEY)
    sessionStorage.removeItem(LOGIN_INTENT_KEY)
    return intent
  } catch {
    return null
  }
}

/** A friendly display name from the Google profile, if the user is logged in. */
export function getSessionDisplayName(session: Session | null): string {
  const meta = session?.user?.user_metadata ?? {}
  const full: string = meta.full_name || meta.name || session?.user?.email?.split('@')[0] || ''
  return full.trim()
}
