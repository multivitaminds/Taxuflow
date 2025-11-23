-- Create tax_filings table with e-file provider tracking
CREATE TABLE IF NOT EXISTS tax_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Filing Information
  tax_year INTEGER NOT NULL,
  filing_status TEXT NOT NULL,
  
  -- E-File Provider Data
  provider_name TEXT DEFAULT 'mock',
  submission_id TEXT,
  provider_response JSONB,
  
  -- Status Tracking
  irs_status TEXT,
  state_status TEXT,
  rejection_reasons TEXT[],
  
  -- Refund Information
  refund_amount DECIMAL(10, 2),
  
  -- Bank Information (encrypted in production)
  bank_routing TEXT,
  bank_account TEXT,
  bank_account_type TEXT,
  
  -- Timestamps
  filed_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_tax_filings_user_id ON tax_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_submission_id ON tax_filings(submission_id);

-- Enable RLS
ALTER TABLE tax_filings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own filings"
  ON tax_filings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own filings"
  ON tax_filings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own filings"
  ON tax_filings FOR UPDATE
  USING (auth.uid() = user_id);
