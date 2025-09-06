import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { signUp, signIn, signOut, createUserProfile, getUserProfile } from '../hooks/useSupabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  userProfile: any | null
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

interface SupabaseAuthProviderProps {
  children: ReactNode
}

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      // First get user basic info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      // Then get role-specific profile
      let profileData = null
      if (userData.role === 'customer') {
        const { data, error } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()
        
        if (!error) profileData = data
      } else if (userData.role === 'operator') {
        const { data, error } = await supabase
          .from('operator_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()
        
        if (!error) profileData = data
      }

      setUserProfile({
        ...userData,
        ...profileData
      })
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const handleSignUp = async (email: string, password: string, userData: any) => {
    const result = await signUp(email, password, userData)
    
    if (result.user) {
      // Create user record in our users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: result.user.id,
          email: result.user.email!,
          name: userData.name,
          role: userData.role
        })

      if (userError) throw userError

      // Create role-specific profile
      await createUserProfile(result.user.id, userData, userData.role)
    }
    
    return result
  }

  const handleSignIn = async (email: string, password: string) => {
    return await signIn(email, password)
  }

  const handleSignOut = async () => {
    await signOut()
    setUserProfile(null)
  }

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}