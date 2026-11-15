import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { authService } from '../services/authService'
import { isSupabaseConfigured } from '../services/supabaseClient'

interface UserContextType {
  session: Session | null
  /** True until the initial session check finishes. */
  isLoading: boolean
  /** True while redirecting to Google. */
  isSigningIn: boolean
  /** False when Supabase env vars are missing (login/multiplayer unavailable). */
  isAuthAvailable: boolean
  signInWithGoogle: () => Promise<boolean>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// 🔒 Sign out after 30 minutes without any interaction.
const SESSION_TIMEOUT_MS = 30 * 60 * 1000
// Don't restart the timer on every single mouse event.
const ACTIVITY_THROTTLE_MS = 5000

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastResetRef = useRef(0)
  const sessionRef = useRef<Session | null>(null)

  const clearInactivityTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
  }

  const startInactivityTimer = useCallback(() => {
    clearInactivityTimer()
    lastResetRef.current = Date.now()
    if (!sessionRef.current) return
    timerRef.current = setTimeout(() => {
      console.warn('Signed out after 30 minutes of inactivity')
      void authService.signOut()
    }, SESSION_TIMEOUT_MS)
  }, [])

  // Initial session + auth changes
  useEffect(() => {
    let cancelled = false
    let unsubscribe: (() => void) | undefined

    authService
      .initAuthListener((newSession) => {
        if (cancelled) return
        sessionRef.current = newSession
        setSession(newSession)
        setIsLoading(false)
        startInactivityTimer()
      })
      .then((subscription) => {
        if (cancelled) subscription?.unsubscribe()
        else unsubscribe = () => subscription?.unsubscribe()
      })
      .catch((error) => {
        console.error('Auth initialization error:', error)
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
      unsubscribe?.()
      clearInactivityTimer()
    }
  }, [startInactivityTimer])

  // Reset the inactivity timer on user activity (listeners registered once)
  useEffect(() => {
    const events = ['pointerdown', 'keydown', 'touchstart', 'wheel']
    const onActivity = () => {
      if (!sessionRef.current) return
      if (Date.now() - lastResetRef.current < ACTIVITY_THROTTLE_MS) return
      startInactivityTimer()
    }
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }))
    return () => events.forEach((e) => window.removeEventListener(e, onActivity))
  }, [startInactivityTimer])

  const signInWithGoogle = async () => {
    setIsSigningIn(true)
    const { error } = await authService.signInWithGoogle()
    if (error) {
      console.error('Sign in error:', error)
      setIsSigningIn(false)
      return false
    }
    // The browser is now redirecting to Google.
    return true
  }

  const signOut = async () => {
    const error = await authService.signOut()
    if (error) console.error('Sign out error:', error)
  }

  return (
    <UserContext.Provider
      value={{
        session,
        isLoading,
        isSigningIn,
        isAuthAvailable: isSupabaseConfigured,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
