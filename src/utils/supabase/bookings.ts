import { supabase } from './client';
import type { Database } from './client';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingRow = Database['public']['Tables']['bookings']['Row'];

// Create a new booking
export async function createBooking(booking: BookingInsert) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { data: null, error };
  }
}

// Get booking by ID
export async function getBooking(bookingId: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users!customer_id(*),
        driver:users!driver_id(*)
      `)
      .eq('id', bookingId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching booking:', error);
    return { data: null, error };
  }
}

// Get all bookings for a customer
export async function getCustomerBookings(customerId: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        driver:users!driver_id(*)
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    return { data: null, error };
  }
}

// Get all bookings for a driver
export async function getDriverBookings(driverId: string, status?: string) {
  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        customer:users!customer_id(*)
      `)
      .eq('driver_id', driverId)
      .order('scheduled_date', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching driver bookings:', error);
    return { data: null, error };
  }
}

// Get available bookings (not assigned to any driver)
export async function getAvailableBookings() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users!customer_id(*)
      `)
      .is('driver_id', null)
      .eq('status', 'confirmed')
      .order('scheduled_date', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching available bookings:', error);
    return { data: null, error };
  }
}

// Update booking status
export async function updateBookingStatus(bookingId: string, status: BookingRow['status']) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { data: null, error };
  }
}

// Assign driver to booking
export async function assignDriverToBooking(bookingId: string, driverId: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        driver_id: driverId, 
        status: 'assigned',
        updated_at: new Date().toISOString() 
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error assigning driver:', error);
    return { data: null, error };
  }
}

// Cancel booking
export async function cancelBooking(bookingId: string, reason?: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { data: null, error };
  }
}

// Get all bookings (admin)
export async function getAllBookings(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        customer:users!customer_id(*),
        driver:users!driver_id(*)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.startDate) {
      query = query.gte('scheduled_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('scheduled_date', filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return { data: null, error };
  }
}

// Update booking
export async function updateBooking(bookingId: string, updates: Partial<BookingInsert>) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { data: null, error };
  }
}

// Subscribe to booking updates (real-time)
export function subscribeToBooking(bookingId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`booking:${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `id=eq.${bookingId}`,
      },
      callback
    )
    .subscribe();
}

// Subscribe to all bookings (real-time) - Admin
export function subscribeToAllBookings(callback: (payload: any) => void) {
  return supabase
    .channel('all-bookings')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
      },
      callback
    )
    .subscribe();
}
