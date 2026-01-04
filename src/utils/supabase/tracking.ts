import { supabase } from './client';
import type { Database } from './client';

type TrackingInsert = Database['public']['Tables']['tracking']['Insert'];
type TrackingRow = Database['public']['Tables']['tracking']['Row'];

// Update driver location
export async function updateDriverLocation(
  bookingId: string,
  driverId: string,
  latitude: number,
  longitude: number,
  status: string,
  eta: string
) {
  try {
    // Check if tracking exists
    const { data: existing } = await supabase
      .from('tracking')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('tracking')
        .update({
          latitude,
          longitude,
          status,
          eta,
          updated_at: new Date().toISOString(),
        })
        .eq('booking_id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('tracking')
        .insert({
          booking_id: bookingId,
          driver_id: driverId,
          latitude,
          longitude,
          status,
          eta,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error('Error updating driver location:', error);
    return { data: null, error };
  }
}

// Get tracking info for a booking
export async function getTrackingInfo(bookingId: string) {
  try {
    const { data, error } = await supabase
      .from('tracking')
      .select(`
        *,
        driver:users!driver_id(*)
      `)
      .eq('booking_id', bookingId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    return { data: null, error };
  }
}

// Subscribe to tracking updates (real-time)
export function subscribeToTracking(bookingId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`tracking:${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tracking',
        filter: `booking_id=eq.${bookingId}`,
      },
      callback
    )
    .subscribe();
}

// Start tracking (driver starts job)
export async function startTracking(bookingId: string, driverId: string) {
  try {
    // Update booking status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'in_progress', updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;

    // Get initial location (you would use browser geolocation API)
    // For now, using placeholder coordinates
    const { data, error } = await supabase
      .from('tracking')
      .insert({
        booking_id: bookingId,
        driver_id: driverId,
        latitude: 55.9533, // Edinburgh default
        longitude: -3.1883,
        status: 'en_route_to_pickup',
        eta: '15 minutes',
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error starting tracking:', error);
    return { data: null, error };
  }
}

// Stop tracking (driver completes job)
export async function stopTracking(bookingId: string) {
  try {
    // Update booking status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;

    // Update tracking status
    const { data, error } = await supabase
      .from('tracking')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error stopping tracking:', error);
    return { data: null, error };
  }
}

// Update tracking status
export async function updateTrackingStatus(bookingId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('tracking')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating tracking status:', error);
    return { data: null, error };
  }
}

// Get all active tracking (admin view)
export async function getAllActiveTracking() {
  try {
    const { data, error } = await supabase
      .from('tracking')
      .select(`
        *,
        booking:bookings(*),
        driver:users!driver_id(*)
      `)
      .neq('status', 'completed')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching active tracking:', error);
    return { data: null, error };
  }
}
