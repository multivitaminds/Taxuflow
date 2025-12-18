-- Create recipients table for managing contractors
CREATE TABLE IF NOT EXISTS recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  business_name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Tax Information (encrypted)
  ssn_encrypted TEXT,
  ein_encrypted TEXT,
  tin_type TEXT CHECK (tin_type IN ('SSN', 'EIN')),
  
  -- Address
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  
  -- Payment Tracking
  total_payments DECIMAL(12, 2) DEFAULT 0,
  payment_count INTEGER DEFAULT 0,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment history table
CREATE TABLE IF NOT EXISTS recipient_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES recipients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  description TEXT,
  category TEXT,
  
  -- Link to filing if applicable
  filing_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recipients_user_id ON recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_recipients_email ON recipients(email);
CREATE INDEX IF NOT EXISTS idx_recipients_is_active ON recipients(is_active);
CREATE INDEX IF NOT EXISTS idx_recipient_payments_recipient_id ON recipient_payments(recipient_id);
CREATE INDEX IF NOT EXISTS idx_recipient_payments_user_id ON recipient_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_recipient_payments_date ON recipient_payments(payment_date);

-- Enable RLS
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipient_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipients
CREATE POLICY "Users can view their own recipients"
  ON recipients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipients"
  ON recipients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipients"
  ON recipients FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipients"
  ON recipients FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for recipient_payments
CREATE POLICY "Users can view their own recipient payments"
  ON recipient_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipient payments"
  ON recipient_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipient payments"
  ON recipient_payments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipient payments"
  ON recipient_payments FOR DELETE
  USING (auth.uid() = user_id);
