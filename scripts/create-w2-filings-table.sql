-- Create w2_filings table to track W-2 submissions to IRS via TaxBandits
CREATE TABLE IF NOT EXISTS public.w2_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- TaxBandits submission details
  submission_id TEXT UNIQUE,
  business_id TEXT,
  taxbandits_status TEXT,
  irs_status TEXT,
  
  -- Form data
  tax_year INTEGER NOT NULL,
  filing_type TEXT DEFAULT 'original', -- 'original', 'correction', 'void'
  
  -- Employer information (encrypted)
  employer_name TEXT NOT NULL,
  employer_ein TEXT NOT NULL,
  employer_address TEXT,
  employer_city TEXT,
  employer_state TEXT,
  employer_zip TEXT,
  
  -- Employee information (encrypted)
  employee_first_name TEXT NOT NULL,
  employee_middle_initial TEXT,
  employee_last_name TEXT NOT NULL,
  employee_ssn_encrypted TEXT NOT NULL,
  employee_address TEXT,
  employee_city TEXT,
  employee_state TEXT,
  employee_zip TEXT,
  
  -- W-2 box values
  wages NUMERIC(12, 2),
  federal_tax_withheld NUMERIC(12, 2),
  social_security_wages NUMERIC(12, 2),
  social_security_tax NUMERIC(12, 2),
  medicare_wages NUMERIC(12, 2),
  medicare_tax NUMERIC(12, 2),
  social_security_tips NUMERIC(12, 2) DEFAULT 0,
  allocated_tips NUMERIC(12, 2) DEFAULT 0,
  dependent_care_benefits NUMERIC(12, 2) DEFAULT 0,
  nonqualified_plans NUMERIC(12, 2) DEFAULT 0,
  
  -- Box 12 codes (stored as JSONB)
  box_12_codes JSONB DEFAULT '[]'::jsonb,
  
  -- State and local tax
  state_wages NUMERIC(12, 2),
  state_tax NUMERIC(12, 2),
  local_wages NUMERIC(12, 2) DEFAULT 0,
  local_tax NUMERIC(12, 2) DEFAULT 0,
  locality_name TEXT,
  
  -- Submission metadata
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reasons JSONB,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.w2_filings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own W-2 filings
CREATE POLICY "Users can view their own W-2 filings"
  ON public.w2_filings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own W-2 filings"
  ON public.w2_filings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own W-2 filings"
  ON public.w2_filings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_w2_filings_user_id ON public.w2_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_w2_filings_submission_id ON public.w2_filings(submission_id);
CREATE INDEX IF NOT EXISTS idx_w2_filings_tax_year ON public.w2_filings(tax_year);
CREATE INDEX IF NOT EXISTS idx_w2_filings_irs_status ON public.w2_filings(irs_status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_w2_filings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_w2_filings_timestamp
  BEFORE UPDATE ON public.w2_filings
  FOR EACH ROW
  EXECUTE FUNCTION update_w2_filings_updated_at();

COMMENT ON TABLE public.w2_filings IS 'Stores W-2 form submissions to IRS via TaxBandits';
COMMENT ON COLUMN public.w2_filings.submission_id IS 'TaxBandits submission ID returned from API';
COMMENT ON COLUMN public.w2_filings.employee_ssn_encrypted IS 'Encrypted employee SSN for security';
