import { supabase } from './client';
import type { Database } from './client';

type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentRow = Database['public']['Tables']['payments']['Row'];

// Create payment record
export async function createPayment(payment: PaymentInsert) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error creating payment:', error);
    return { data: null, error };
  }
}

// Get payment by booking ID
export async function getPaymentByBooking(bookingId: string) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching payment:', error);
    return { data: null, error };
  }
}

// Get all payments for a customer
export async function getCustomerPayments(customerId: string) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        booking:bookings(*)
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching customer payments:', error);
    return { data: null, error };
  }
}

// Update payment status
export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentRow['status'],
  stripePaymentId?: string
) {
  try {
    const updates: any = { status };
    if (stripePaymentId) {
      updates.stripe_payment_id = stripePaymentId;
    }

    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { data: null, error };
  }
}

// Process refund
export async function processRefund(paymentId: string) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error processing refund:', error);
    return { data: null, error };
  }
}

// Get all payments (admin)
export async function getAllPayments(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    let query = supabase
      .from('payments')
      .select(`
        *,
        booking:bookings(*),
        customer:users!customer_id(*)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching all payments:', error);
    return { data: null, error };
  }
}

// Calculate payment split (70% driver, 30% company)
export function calculatePaymentSplit(totalAmount: number, tipAmount: number = 0) {
  const driverBaseAmount = totalAmount * 0.7;
  const companyAmount = totalAmount * 0.3;
  const driverTotalAmount = driverBaseAmount + tipAmount;

  return {
    driver_amount: driverBaseAmount,
    company_amount: companyAmount,
    driver_total_with_tip: driverTotalAmount,
    tip_amount: tipAmount,
  };
}

// Record driver earnings
export async function recordDriverEarnings(
  driverId: string,
  bookingId: string,
  baseAmount: number,
  tipAmount: number = 0
) {
  try {
    const { data, error } = await supabase
      .from('driver_earnings')
      .insert({
        driver_id: driverId,
        booking_id: bookingId,
        base_amount: baseAmount,
        tip_amount: tipAmount,
        total_amount: baseAmount + tipAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error recording driver earnings:', error);
    return { data: null, error };
  }
}

// Get driver earnings
export async function getDriverEarnings(driverId: string, filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    let query = supabase
      .from('driver_earnings')
      .select(`
        *,
        booking:bookings(*)
      `)
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching driver earnings:', error);
    return { data: null, error };
  }
}

// Mark earnings as paid
export async function markEarningsAsPaid(earningsIds: string[]) {
  try {
    const { data, error } = await supabase
      .from('driver_earnings')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .in('id', earningsIds)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error marking earnings as paid:', error);
    return { data: null, error };
  }
}

// Get driver earnings summary
export async function getDriverEarningsSummary(driverId: string) {
  try {
    const { data, error } = await supabase
      .from('driver_earnings')
      .select('base_amount, tip_amount, total_amount, status')
      .eq('driver_id', driverId);

    if (error) throw error;

    const summary = {
      total_pending: 0,
      total_paid: 0,
      total_tips: 0,
      total_earnings: 0,
    };

    data?.forEach((earning) => {
      if (earning.status === 'pending') {
        summary.total_pending += earning.total_amount;
      } else {
        summary.total_paid += earning.total_amount;
      }
      summary.total_tips += earning.tip_amount;
      summary.total_earnings += earning.total_amount;
    });

    return { data: summary, error: null };
  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    return { data: null, error };
  }
}
