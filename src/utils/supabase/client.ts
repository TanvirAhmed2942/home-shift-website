import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Type definitions for our database tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'customer' | 'driver' | 'admin';
          created_at: string;
          profile: {
            name: string;
            phone: string;
            avatar?: string;
          };
          loyalty_points?: number;
          loyalty_tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          driver_id?: string;
          pickup_address: string;
          delivery_address: string;
          items: any[];
          total_volume: number;
          vehicle_type: string;
          price: number;
          insurance_tier?: string;
          insurance_cost?: number;
          status: 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
          scheduled_date: string;
          created_at: string;
          updated_at: string;
          recurring?: boolean;
          recurring_frequency?: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      tracking: {
        Row: {
          id: string;
          booking_id: string;
          driver_id: string;
          latitude: number;
          longitude: number;
          status: string;
          eta: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tracking']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tracking']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          amount: number;
          driver_amount: number;
          company_amount: number;
          tip_amount?: number;
          payment_method: string;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          stripe_payment_id?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      driver_earnings: {
        Row: {
          id: string;
          driver_id: string;
          booking_id: string;
          base_amount: number;
          tip_amount: number;
          total_amount: number;
          status: 'pending' | 'paid';
          paid_at?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['driver_earnings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['driver_earnings']['Insert']>;
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referee_id: string;
          code: string;
          status: 'pending' | 'signed_up' | 'completed_first_job' | 'rewarded';
          reward_amount: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['referrals']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['referrals']['Insert']>;
      };
    };
  };
}
