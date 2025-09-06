import { supabase } from '../lib/supabase'

// Booking service functions
export const bookingService = {
  // Create a new booking
  async createBooking(bookingData: any) {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        booking_number: `BID${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        customer_id: bookingData.customer_id,
        type: bookingData.type || 'flight_request',
        from_airport: bookingData.from,
        to_airport: bookingData.to,
        departure_date: bookingData.departure,
        return_date: bookingData.return || null,
        passengers: bookingData.passengers,
        trip_type: bookingData.tripType,
        special_requests: bookingData.specialRequests || null,
        status: 'Pending',
        discount_requested: bookingData.discountRequested || false,
        discount_percentage: bookingData.discountPercentage || 0,
        discount_amount: bookingData.discountAmount || 0
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get bookings for a user
  async getBookings(userId: string, role: string) {
    let query = supabase.from('bookings').select('*')
    
    if (role === 'customer') {
      query = query.eq('customer_id', userId)
    } else if (role === 'operator') {
      query = query.eq('operator_id', userId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Update booking
  async updateBooking(bookingId: string, updates: any) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Cancel booking
  async cancelBooking(bookingId: string, cancellationInfo: any) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        is_cancelled: true,
        status: 'Cancelled',
        cancellation_info: cancellationInfo,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// User service functions
export const userService = {
  // Get user with profile
  async getUserWithProfile(userId: string) {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    let profile = null
    if (user.role === 'customer') {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (!error) profile = data
    } else if (user.role === 'operator') {
      const { data, error } = await supabase
        .from('operator_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (!error) profile = data
    }

    return { ...user, ...profile }
  },

  // Update user profile
  async updateProfile(userId: string, profileData: any, role: string) {
    if (role === 'customer') {
      const { data, error } = await supabase
        .from('customer_profiles')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } else if (role === 'operator') {
      const { data, error } = await supabase
        .from('operator_profiles')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  // Admin: Get all users
  async getAllUsers() {
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
  },

  // Admin: Approve user
  async approveUser(userId: string, role: string, approvalType: string) {
    if (role === 'customer') {
      const { data, error } = await supabase
        .from('customer_profiles')
        .update({
          profile_completion_status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) throw error
      return data
    } else if (role === 'operator') {
      const updates: any = { updated_at: new Date().toISOString() }
      
      if (approvalType === 'aoc') {
        updates.is_approved_by_admin = true
      } else if (approvalType === 'membership') {
        updates.membership_type = 'approved'
      }

      const { data, error } = await supabase
        .from('operator_profiles')
        .update(updates)
        .eq('user_id', userId)

      if (error) throw error
      return data
    }
  }
}

// Payment service functions
export const paymentService = {
  // Create payment record
  async createPayment(paymentData: any) {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get payment history
  async getPaymentHistory(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: string, metadata?: any) {
    const { data, error } = await supabase
      .from('payments')
      .update({
        status,
        metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Invoice service functions
export const invoiceService = {
  // Create invoice
  async createInvoice(invoiceData: any) {
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        invoice_number: `INV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...invoiceData
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get invoices for user
  async getInvoices(userId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Admin: Get all invoices
  async getAllInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        users(name, email, role)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// Real-time subscriptions
export const subscribeToBookings = (userId: string, role: string, callback: (payload: any) => void) => {
  let channel
  
  if (role === 'customer') {
    channel = supabase
      .channel('customer-bookings')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings',
          filter: `customer_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe()
  } else if (role === 'operator') {
    channel = supabase
      .channel('operator-bookings')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings',
          filter: `operator_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe()
  } else if (role === 'admin') {
    channel = supabase
      .channel('admin-bookings')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings'
        }, 
        callback
      )
      .subscribe()
  }

  return () => {
    if (channel) {
      supabase.removeChannel(channel)
    }
  }
}