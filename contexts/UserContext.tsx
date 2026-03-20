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

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize auth listener
    let subscription: any
    
    authService.initAuthListener((newSession) => {
      setSession(newSession)
      setIsLoading(false)
    }).then(sub => {
      subscription = sub
    }).catch(error => {
      console.error('Auth initialization error:', error)
      setIsLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
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
