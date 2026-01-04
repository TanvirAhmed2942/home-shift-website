-- ShiftMyHome Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'driver', 'admin')),
  profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')) DEFAULT 'bronze',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_volume DECIMAL(10, 2) NOT NULL,
  vehicle_type TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  insurance_tier TEXT,
  insurance_cost DECIMAL(10, 2) DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracking table
CREATE TABLE IF NOT EXISTS public.tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status TEXT NOT NULL,
  eta TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  driver_amount DECIMAL(10, 2) NOT NULL,
  company_amount DECIMAL(10, 2) NOT NULL,
  tip_amount DECIMAL(10, 2) DEFAULT 0,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver earnings table
CREATE TABLE IF NOT EXISTS public.driver_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  base_amount DECIMAL(10, 2) NOT NULL,
  tip_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid')) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'signed_up', 'completed_first_job', 'rewarded')) DEFAULT 'pending',
  reward_amount DECIMAL(10, 2) DEFAULT 25.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON public.bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON public.bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_tracking_booking_id ON public.tracking(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_driver_earnings_driver_id ON public.driver_earnings(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_earnings_status ON public.driver_earnings(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(code);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for bookings table
CREATE POLICY "Customers can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Drivers can view their assigned bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = driver_id);

CREATE POLICY "Customers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = customer_id);

-- RLS Policies for tracking table
CREATE POLICY "Customers can view tracking for their bookings"
  ON public.tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = tracking.booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

CREATE POLICY "Drivers can update tracking for their bookings"
  ON public.tracking FOR ALL
  USING (auth.uid() = driver_id);

-- RLS Policies for payments table
CREATE POLICY "Customers can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = customer_id);

-- RLS Policies for driver earnings table
CREATE POLICY "Drivers can view their own earnings"
  ON public.driver_earnings FOR SELECT
  USING (auth.uid() = driver_id);

-- RLS Policies for referrals table
CREATE POLICY "Users can view their own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

CREATE POLICY "Users can create referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracking_updated_at
  BEFORE UPDATE ON public.tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate loyalty tier based on points
CREATE OR REPLACE FUNCTION calculate_loyalty_tier(points INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF points >= 5000 THEN
    RETURN 'platinum';
  ELSIF points >= 3000 THEN
    RETURN 'gold';
  ELSIF points >= 1000 THEN
    RETURN 'silver';
  ELSE
    RETURN 'bronze';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update loyalty tier when points change
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
  NEW.loyalty_tier = calculate_loyalty_tier(NEW.loyalty_points);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_loyalty_tier
  BEFORE INSERT OR UPDATE OF loyalty_points ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_loyalty_tier();

-- Insert demo data (optional, for testing)
-- Admin user (you'll need to create this in Supabase Auth first)
-- INSERT INTO public.users (id, email, role, profile)
-- VALUES (
--   'your-admin-uuid-here',
--   'admin@shiftmyhome.com',
--   'admin',
--   '{"name": "Admin User", "phone": "+44 20 1234 5678"}'::jsonb
-- );
