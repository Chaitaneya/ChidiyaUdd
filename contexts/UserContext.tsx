import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { authService } from '../services/authService'

interface UserContextType {
  session: Session | null
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// 🔒 SECURITY: Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null)

  // 🔒 SECURITY: Reset inactivity timer on user activity
  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }

    // Only set timeout if user is logged in
    if (session) {
      const newTimer = setTimeout(() => {
        console.warn('Session timeout due to inactivity')
        authService.signOut()
        setSession(null)
      }, SESSION_TIMEOUT_MS)
      setInactivityTimer(newTimer)
    }
  }

  // 🔒 SECURITY: Track user activity to reset session timer
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']

    const handleActivity = () => {
      resetInactivityTimer()
    }

    events.forEach(event => {
      window.addEventListener(event, handleActivity)
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [session, inactivityTimer])

  useEffect(() => {
    // Initialize auth listener
    let subscription: any
    
    authService.initAuthListener((newSession) => {
      setSession(newSession)
      setIsLoading(false)
      // Reset inactivity timer when session changes
      resetInactivityTimer()
    }).then(sub => {
      subscription = sub
    }).catch(error => {
      console.error('Auth initialization error:', error)
      setIsLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
      if (inactivityTimer) {
        clearTimeout(inactivityTimer)
      }
    }
  }, [])

  const signInWithGoogle = async () => {
    setIsLoading(true)
    const { error } = await authService.signInWithGoogle()
    if (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
    // Auth state change will be handled by onAuthStateChange listener
  }

  const signOut = async () => {
    setIsLoading(true)
    const error = await authService.signOut()
    if (error) {
      console.error('Sign out error:', error)
    }
    setIsLoading(false)
  }

  return (
    <UserContext.Provider value={{ session, isLoading, signInWithGoogle, signOut }}>
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
