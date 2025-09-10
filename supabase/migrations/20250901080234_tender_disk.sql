/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `booking_number` (text, unique)
      - `customer_id` (uuid, foreign key to users)
      - `operator_id` (uuid, foreign key to users, nullable)
      - `type` (enum: flight_request, route_booking)
      - `from_airport` (text)
      - `to_airport` (text)
      - `departure_date` (timestamp)
      - `return_date` (timestamp, nullable)
      - `passengers` (integer)
      - `trip_type` (enum: oneWay, roundTrip)
      - `special_requests` (text)
      - `status` (text)
      - `total_amount` (decimal)
      - `is_paid` (boolean)
      - `payment_method` (text)
      - `transaction_id` (text)
      - `discount_requested` (boolean)
      - `discount_percentage` (integer)
      - `discount_amount` (decimal)
      - `final_price` (decimal)
      - `is_cancelled` (boolean)
      - `cancellation_info` (jsonb)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for customers, operators, and admins
*/

-- Create custom types
CREATE TYPE booking_type AS ENUM ('flight_request', 'route_booking');
CREATE TYPE trip_type AS ENUM ('oneWay', 'roundTrip');

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  operator_id uuid REFERENCES users(id) ON DELETE SET NULL,
  type booking_type NOT NULL DEFAULT 'flight_request',
  from_airport text NOT NULL,
  to_airport text NOT NULL,
  departure_date timestamptz NOT NULL,
  return_date timestamptz,
  passengers integer NOT NULL DEFAULT 1,
  trip_type trip_type NOT NULL DEFAULT 'oneWay',
  special_requests text,
  status text DEFAULT 'Pending',
  total_amount decimal(10,2),
  is_paid boolean DEFAULT false,
  payment_method text,
  transaction_id text,
  discount_requested boolean DEFAULT false,
  discount_percentage integer DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  final_price decimal(10,2),
  is_cancelled boolean DEFAULT false,
  cancellation_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Customers can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    operator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Customers can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

CREATE POLICY "Customers and operators can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    operator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_operator_id ON bookings(operator_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_departure_date ON bookings(departure_date);
