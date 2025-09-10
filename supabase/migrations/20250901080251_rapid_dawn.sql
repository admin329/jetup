/*
  # Create invoices table

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `invoice_number` (text, unique)
      - `user_id` (uuid, foreign key to users)
      - `booking_id` (uuid, foreign key to bookings, nullable)
      - `type` (enum: membership, booking, commission)
      - `direction` (enum: incoming, outgoing)
      - `amount` (decimal)
      - `currency` (text)
      - `status` (enum: paid, pending, overdue, cancelled)
      - `issue_date` (date)
      - `due_date` (date)
      - `paid_date` (date, nullable)
      - `description` (text)
      - `items` (jsonb)
      - `tax_amount` (decimal)
      - `total_amount` (decimal)
      - `payment_method` (text)
      - `notes` (text)

  2. Security
    - Enable RLS on `invoices` table
    - Add policies for users and admins
*/

-- Create custom types
CREATE TYPE invoice_type AS ENUM ('membership', 'booking', 'commission');
CREATE TYPE invoice_direction AS ENUM ('incoming', 'outgoing');
CREATE TYPE invoice_status AS ENUM ('paid', 'pending', 'overdue', 'cancelled');

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  type invoice_type NOT NULL,
  direction invoice_direction NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  status invoice_status DEFAULT 'pending',
  issue_date date NOT NULL,
  due_date date NOT NULL,
  paid_date date,
  description text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  tax_amount decimal(10,2),
  total_amount decimal(10,2) NOT NULL,
  payment_method text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create invoices"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_type ON invoices(type);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
