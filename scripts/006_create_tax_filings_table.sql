-- Create tax_filings table to track filed returns
CREATE TABLE IF NOT EXISTS tax_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  filing_status TEXT NOT NULL,
  refund_amount DECIMAL(10, 2),
  bank_routing TEXT,
  bank_account TEXT,
  bank_account_type TEXT,
  filed_at TIMESTAMP WITH TIME ZONE,
  irs_confirmation TEXT,
  state_confirmation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tax_filings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own filings"
  ON tax_filings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own filings"
  ON tax_filings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own filings"
  ON tax_filings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_tax_filings_user_id ON tax_filings(user_id);
CREATE INDEX idx_tax_filings_tax_year ON tax_filings(tax_year);
