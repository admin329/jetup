/*
  # Create customer profiles table

  1. New Tables
    - `customer_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `phone` (text)
      - `address` (jsonb)
      - `membership_type` (text)
      - `membership_expiry_date` (timestamp)
      - `profile_completion_status` (text)
      - `has_uploaded_id` (boolean)
      - `booking_count` (integer)
      - `booking_limit` (integer)
      - `cancellation_count` (integer)
      - `cancellation_limit` (integer)
      - `discount_usage` (jsonb)
      - `total_discounts_used` (integer)

  2. Security
    - Enable RLS on `customer_profiles` table
    - Add policies for customers and admins
*/

-- Create customer profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  phone text,
  address jsonb,
  membership_type text DEFAULT 'standard',
  membership_expiry_date timestamptz,
  profile_completion_status text DEFAULT 'incomplete',
  has_uploaded_id boolean DEFAULT false,
  booking_count integer DEFAULT 0,
  booking_limit integer DEFAULT 10,
  cancellation_count integer DEFAULT 0,
  cancellation_limit integer DEFAULT 10,
  discount_usage jsonb DEFAULT '{}',
  total_discounts_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Customers can read own profile"
  ON customer_profiles
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Customers can update own profile"
  ON customer_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Customers can insert own profile"
  ON customer_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all customer profiles"
  ON customer_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_customer_profiles_updated_at
  BEFORE UPDATE ON customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();