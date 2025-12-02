-- Create Fraud Detection System for Duplicate Filings
-- This script creates a trigger to prevent duplicate W-2 filings based on:
-- - Same SSN, EIN, and Tax Year combination
-- - Same submission_id

-- Create function to check for duplicate filings
CREATE OR REPLACE FUNCTION check_duplicate_w2_filing()
RETURNS TRIGGER AS $$
DECLARE
  existing_filing_count INTEGER;
  duplicate_submission_count INTEGER;
BEGIN
  -- Check for duplicate submission_id
  SELECT COUNT(*) INTO duplicate_submission_count
  FROM public.w2_filings
  WHERE submission_id = NEW.submission_id
    AND submission_id IS NOT NULL
    AND submission_id != ''
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
  
  IF duplicate_submission_count > 0 THEN
    RAISE EXCEPTION 'FRAUD ALERT: Duplicate submission ID detected. Submission ID % has already been filed.', NEW.submission_id
      USING HINT = 'This filing appears to be a duplicate. Please verify the submission ID.';
  END IF;
  
  -- Check for duplicate SSN + EIN + Tax Year combination (only for accepted/pending filings)
  SELECT COUNT(*) INTO existing_filing_count
  FROM public.w2_filings
  WHERE employee_ssn_encrypted = NEW.employee_ssn_encrypted
    AND employer_ein = NEW.employer_ein
    AND tax_year = NEW.tax_year
    AND irs_status IN ('accepted', 'pending')
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
  
  IF existing_filing_count > 0 THEN
    RAISE EXCEPTION 'FRAUD ALERT: Duplicate W-2 filing detected for Tax Year %. Employee SSN and Employer EIN combination has already been filed and accepted/pending.', NEW.tax_year
      USING HINT = 'This appears to be a duplicate filing for the same employee and employer. If this is a correction, please use the W-2c correction process.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
DROP TRIGGER IF EXISTS prevent_duplicate_w2_filing_insert ON public.w2_filings;
CREATE TRIGGER prevent_duplicate_w2_filing_insert
  BEFORE INSERT ON public.w2_filings
  FOR EACH ROW
  EXECUTE FUNCTION check_duplicate_w2_filing();

-- Create trigger for UPDATE operations
DROP TRIGGER IF EXISTS prevent_duplicate_w2_filing_update ON public.w2_filings;
CREATE TRIGGER prevent_duplicate_w2_filing_update
  BEFORE UPDATE ON public.w2_filings
  FOR EACH ROW
  WHEN (
    OLD.submission_id IS DISTINCT FROM NEW.submission_id OR
    OLD.employee_ssn_encrypted IS DISTINCT FROM NEW.employee_ssn_encrypted OR
    OLD.employer_ein IS DISTINCT FROM NEW.employer_ein OR
    OLD.tax_year IS DISTINCT FROM NEW.tax_year
  )
  EXECUTE FUNCTION check_duplicate_w2_filing();

-- Create audit log table for fraud attempts
CREATE TABLE IF NOT EXISTS public.w2_fraud_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  attempted_submission_id TEXT,
  attempted_ssn_encrypted TEXT,
  attempted_ein TEXT,
  attempted_tax_year INTEGER,
  existing_filing_id UUID,
  fraud_type TEXT, -- 'duplicate_submission_id', 'duplicate_ssn_ein_year'
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on fraud attempts table
ALTER TABLE public.w2_fraud_attempts ENABLE ROW LEVEL SECURITY;

-- Only admins can view fraud attempts
CREATE POLICY "Service role can manage fraud attempts"
  ON public.w2_fraud_attempts
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Create index for fraud detection queries
CREATE INDEX IF NOT EXISTS idx_w2_filings_fraud_detection 
  ON public.w2_filings(employee_ssn_encrypted, employer_ein, tax_year, irs_status);

CREATE INDEX IF NOT EXISTS idx_w2_filings_submission_id_unique 
  ON public.w2_filings(submission_id) 
  WHERE submission_id IS NOT NULL;
