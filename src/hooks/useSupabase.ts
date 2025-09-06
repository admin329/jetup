import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

// Authentication functions
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// User profile functions
export const createUserProfile = async (userId: string, profileData: any, role: string) => {
  if (role === 'customer') {
    const { data, error } = await supabase
      .from('customer_profiles')
      .insert({
        user_id: userId,
        ...profileData
      })
    
    if (error) throw error
    return data
  } else if (role === 'operator') {
    const { data, error } = await supabase
      .from('operator_profiles')
      .insert({
        user_id: userId,
        operator_id: `OID${Date.now().toString().slice(-5)}`,
        ...profileData
      })
    
    if (error) throw error
    return data
  }
}

export const getUserProfile = async (userId: string, role: string) => {
  if (role === 'customer') {
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  } else if (role === 'operator') {
    const { data, error } = await supabase
      .from('operator_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  }
}

export const updateUserProfile = async (userId: string, profileData: any, role: string) => {
  if (role === 'customer') {
    const { data, error } = await supabase
      .from('customer_profiles')
      .update(profileData)
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  } else if (role === 'operator') {
    const { data, error } = await supabase
      .from('operator_profiles')
      .update(profileData)
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}

// Booking functions
export const createBooking = async (bookingData: any) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getBookings = async (userId: string, role: string) => {
  let query = supabase.from('bookings').select('*')
  
  if (role === 'customer') {
    query = query.eq('customer_id', userId)
  } else if (role === 'operator') {
    query = query.eq('operator_id', userId)
  }
  // Admins can see all bookings (no filter)
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const updateBooking = async (bookingId: string, updates: any) => {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Payment functions
export const createPayment = async (paymentData: any) => {
  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getPayments = async (userId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Invoice functions
export const createInvoice = async (invoiceData: any) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert(invoiceData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getInvoices = async (userId: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Admin functions
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      customer_profiles(*),
      operator_profiles(*)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const approveUserProfile = async (userId: string, role: string, approvalData: any) => {
  if (role === 'customer') {
    const { data, error } = await supabase
      .from('customer_profiles')
      .update(approvalData)
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  } else if (role === 'operator') {
    const { data, error } = await supabase
      .from('operator_profiles')
      .update(approvalData)
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}