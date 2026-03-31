import { supabase } from './supabaseClient'
import type { Session, User } from '@supabase/supabase-js'

class AuthService {
  private listeners: ((session: Session | null) => void)[] = []
  // 🔒 SECURITY: Whitelist of allowed redirect URLs
  private readonly ALLOWED_REDIRECT_URLS = [
    'http://localhost:3000',
    'http://localhost:4173',
    'http://localhost:5173',
    // Production URLs - add your domain here
    'https://chidiyaaudd.vercel.app'
,
  ]

  /**
   * 🔒 SECURITY: Validate redirect URL to prevent open redirect attacks
   */
  private validateRedirectUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      // Check if URL is in whitelist or matches current origin
      const isWhitelisted = this.ALLOWED_REDIRECT_URLS.includes(url)
      const isCurrentOrigin = urlObj.origin === window.location.origin
      return isWhitelisted || isCurrentOrigin
    } catch {
      return false
    }
  }

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
    // 🔒 SECURITY: Validate redirect URL before OAuth
    const redirectUrl = window.location.origin
    if (!this.validateRedirectUrl(redirectUrl)) {
      console.error('Invalid redirect URL for OAuth:', redirectUrl)
      return { data: null, error: new Error('Invalid redirect URL') }
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })

    return { data, error }
  }

  /**
   * Add a redirect URL to the whitelist (use in development)
   */
  addAllowedRedirectUrl(url: string): void {
    if (!this.ALLOWED_REDIRECT_URLS.includes(url)) {
      this.ALLOWED_REDIRECT_URLS.push(url)
      console.log('Added allowed redirect URL:', url)
    }
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
      // 🔒 SECURITY: Validate parsed object has expected structure
      if (parsed && typeof parsed === 'object' && parsed.user) {
        // Only return user object if structure is valid
        return parsed.user as User
      }
      console.warn('Invalid session data structure')
      return null
    } catch (err) {
      console.warn('Failed to parse session data:', err)
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
