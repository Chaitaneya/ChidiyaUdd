import { supabase } from './supabaseClient'
import type { Session, User } from '@supabase/supabase-js'

class AuthService {
  private listeners: ((session: Session | null) => void)[] = []

  async initAuthListener(callback: (session: Session | null) => void) {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    callback(session)

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })

    return subscription
  }

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    })

    return { data, error }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return error
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }

  getUser(): User | null {
    const session = sessionStorage.getItem('sb-session')
    if (!session) return null
    try {
      const parsed = JSON.parse(session)
      return parsed.user || null
    } catch {
      return null
    }
  }

  getUserEmail(): string {
    const user = this.getUser()
    return user?.email || ''
  }

  getUserName(): string {
    const user = this.getUser()
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Player'
  }
}

export const authService = new AuthService()
