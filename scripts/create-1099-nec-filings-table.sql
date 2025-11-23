-- Create 1099-NEC filings table to track contractor payments
CREATE TABLE IF NOT EXISTS public.nec_1099_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Filing metadata
  submission_id TEXT UNIQUE,
  business_id TEXT,
  tax_year INTEGER NOT NULL,
  filing_type TEXT DEFAULT 'original' CHECK (filing_type IN ('original', 'corrected')),
  
  -- Status tracking
  irs_status TEXT DEFAULT 'pending' CHECK (irs_status IN ('pending', 'accepted', 'rejected')),
  taxbandits_status TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reasons JSONB,
  
  -- Payer (Business) Information
  payer_name TEXT NOT NULL,
  payer_ein TEXT NOT NULL,
  payer_address TEXT,
  payer_city TEXT,
  payer_state TEXT,
  payer_zip TEXT,
  
  -- Recipient (Contractor) Information
  recipient_first_name TEXT NOT NULL,
  recipient_middle_initial TEXT,
  recipient_last_name TEXT NOT NULL,
  recipient_ssn_encrypted TEXT,
  recipient_ein_encrypted TEXT,
  recipient_address TEXT,
  recipient_city TEXT,
  recipient_state TEXT,
  recipient_zip TEXT,
  recipient_email TEXT,
  
  -- Form data (Box amounts)
  nonemployee_compensation NUMERIC(12, 2) NOT NULL CHECK (nonemployee_compensation >= 600),
  federal_tax_withheld NUMERIC(12, 2) DEFAULT 0,
  
  -- Additional metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_tin CHECK (
    recipient_ssn_encrypted IS NOT NULL OR recipient_ein_encrypted IS NOT NULL
  )
);

-- Enable RLS
ALTER TABLE public.nec_1099_filings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own 1099-NEC filings"
  ON public.nec_1099_filings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 1099-NEC filings"
  ON public.nec_1099_filings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 1099-NEC filings"
  ON public.nec_1099_filings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_nec_1099_filings_user_id ON public.nec_1099_filings(user_id);
CREATE INDEX idx_nec_1099_filings_submission_id ON public.nec_1099_filings(submission_id);
CREATE INDEX idx_nec_1099_filings_tax_year ON public.nec_1099_filings(tax_year);
CREATE INDEX idx_nec_1099_filings_irs_status ON public.nec_1099_filings(irs_status);

-- Add comment
COMMENT ON TABLE public.nec_1099_filings IS 'Stores 1099-NEC (Nonemployee Compensation) form filings for contractor payments';
