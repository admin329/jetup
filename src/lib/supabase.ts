import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'customer' | 'operator' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'customer' | 'operator' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'customer' | 'operator' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      customer_profiles: {
        Row: {
          id: string
          user_id: string
          phone: string | null
          address: any | null
          membership_type: string | null
          membership_expiry_date: string | null
          profile_completion_status: string
          has_uploaded_id: boolean
          booking_count: number
          booking_limit: number
          cancellation_count: number
          cancellation_limit: number
          discount_usage: any | null
          total_discounts_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone?: string | null
          address?: any | null
          membership_type?: string | null
          membership_expiry_date?: string | null
          profile_completion_status?: string
          has_uploaded_id?: boolean
          booking_count?: number
          booking_limit?: number
          cancellation_count?: number
          cancellation_limit?: number
          discount_usage?: any | null
          total_discounts_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone?: string | null
          address?: any | null
          membership_type?: string | null
          membership_expiry_date?: string | null
          profile_completion_status?: string
          has_uploaded_id?: boolean
          booking_count?: number
          booking_limit?: number
          cancellation_count?: number
          cancellation_limit?: number
          discount_usage?: any | null
          total_discounts_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      operator_profiles: {
        Row: {
          id: string
          user_id: string
          operator_id: string
          company_name: string | null
          phone: string | null
          has_uploaded_aoc: boolean
          is_approved_by_admin: boolean
          operator_cancellation_count: number
          membership_type: string | null
          membership_expiry_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          operator_id: string
          company_name?: string | null
          phone?: string | null
          has_uploaded_aoc?: boolean
          is_approved_by_admin?: boolean
          operator_cancellation_count?: number
          membership_type?: string | null
          membership_expiry_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          operator_id?: string
          company_name?: string | null
          phone?: string | null
          has_uploaded_aoc?: boolean
          is_approved_by_admin?: boolean
          operator_cancellation_count?: number
          membership_type?: string | null
          membership_expiry_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          booking_number: string
          customer_id: string
          operator_id: string | null
          type: 'flight_request' | 'route_booking'
          from_airport: string
          to_airport: string
          departure_date: string
          return_date: string | null
          passengers: number
          trip_type: 'oneWay' | 'roundTrip'
          special_requests: string | null
          status: string
          total_amount: number | null
          is_paid: boolean
          payment_method: string | null
          transaction_id: string | null
          discount_requested: boolean
          discount_percentage: number | null
          discount_amount: number | null
          final_price: number | null
          is_cancelled: boolean
          cancellation_info: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_number: string
          customer_id: string
          operator_id?: string | null
          type: 'flight_request' | 'route_booking'
          from_airport: string
          to_airport: string
          departure_date: string
          return_date?: string | null
          passengers: number
          trip_type: 'oneWay' | 'roundTrip'
          special_requests?: string | null
          status?: string
          total_amount?: number | null
          is_paid?: boolean
          payment_method?: string | null
          transaction_id?: string | null
          discount_requested?: boolean
          discount_percentage?: number | null
          discount_amount?: number | null
          final_price?: number | null
          is_cancelled?: boolean
          cancellation_info?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_number?: string
          customer_id?: string
          operator_id?: string | null
          type?: 'flight_request' | 'route_booking'
          from_airport?: string
          to_airport?: string
          departure_date?: string
          return_date?: string | null
          passengers?: number
          trip_type?: 'oneWay' | 'roundTrip'
          special_requests?: string | null
          status?: string
          total_amount?: number | null
          is_paid?: boolean
          payment_method?: string | null
          transaction_id?: string | null
          discount_requested?: boolean
          discount_percentage?: number | null
          discount_amount?: number | null
          final_price?: number | null
          is_cancelled?: boolean
          cancellation_info?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          booking_id: string | null
          stripe_payment_intent_id: string | null
          amount: number
          currency: string
          status: string
          payment_type: 'membership' | 'booking'
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booking_id?: string | null
          stripe_payment_intent_id?: string | null
          amount: number
          currency?: string
          status?: string
          payment_type: 'membership' | 'booking'
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booking_id?: string | null
          stripe_payment_intent_id?: string | null
          amount?: number
          currency?: string
          status?: string
          payment_type?: 'membership' | 'booking'
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          user_id: string
          booking_id: string | null
          type: 'membership' | 'booking' | 'commission'
          direction: 'incoming' | 'outgoing'
          amount: number
          currency: string
          status: 'paid' | 'pending' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string
          paid_date: string | null
          description: string
          items: any
          tax_amount: number | null
          total_amount: number
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          user_id: string
          booking_id?: string | null
          type: 'membership' | 'booking' | 'commission'
          direction: 'incoming' | 'outgoing'
          amount: number
          currency?: string
          status?: 'paid' | 'pending' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string
          paid_date?: string | null
          description: string
          items: any
          tax_amount?: number | null
          total_amount: number
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          user_id?: string
          booking_id?: string | null
          type?: 'membership' | 'booking' | 'commission'
          direction?: 'incoming' | 'outgoing'
          amount?: number
          currency?: string
          status?: 'paid' | 'pending' | 'overdue' | 'cancelled'
          issue_date?: string
          due_date?: string
          paid_date?: string | null
          description?: string
          items?: any
          tax_amount?: number | null
          total_amount?: number
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}