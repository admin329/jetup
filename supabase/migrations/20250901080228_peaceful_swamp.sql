/*
  # Create operator profiles table

  1. New Tables
    - `operator_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `operator_id` (text, unique)
      - `company_name` (text)
      - `phone` (text)
      - `has_uploaded_aoc` (boolean)
      - `is_approved_by_admin` (boolean)
      - `operator_cancellation_count` (integer)
      - `membership_type` (text)
      - `membership_expiry_date` (timestamp)

  2. Security
    - Enable RLS on `operator_profiles` table
    - Add policies for operators and admins
*/

-- Create operator profiles table
CREATE TABLE IF NOT EXISTS operator_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  operator_id text UNIQUE NOT NULL,
  company_name text,
  phone text,
  has_uploaded_aoc boolean DEFAULT false,
  is_approved_by_admin boolean DEFAULT false,
  operator_cancellation_count integer DEFAULT 0,
  membership_type text,
  membership_expiry_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE operator_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Operators can read own profile"
  ON operator_profiles
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Operators can update own profile"
  ON operator_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Operators can insert own profile"
  ON operator_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all operator profiles"
  ON operator_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_operator_profiles_updated_at
  BEFORE UPDATE ON operator_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();