-- Update specific W-2 filing from pending to accepted
-- Submission ID: W2-1762832662353

-- First, let's find and update the filing
UPDATE public.w2_filings
SET 
  irs_status = 'accepted',
  taxbandits_status = 'Accepted',
  accepted_at = NOW(),
  refund_amount = CASE
    -- Calculate refund: total withheld - estimated tax liability
    WHEN wages IS NOT NULL THEN 
      (COALESCE(federal_tax_withheld, 0) + COALESCE(social_security_tax, 0) + COALESCE(medicare_tax, 0)) - 
      -- Estimated tax: (wages - standard deduction) * 10% tax rate
      (GREATEST(COALESCE(wages, 0) - 13850, 0) * 0.10)
    ELSE 0
  END,
  refund_calculated_at = NOW(),
  updated_at = NOW()
WHERE submission_id = 'W2-1762832662353';

-- Verify the update
SELECT 
  id,
  submission_id,
  irs_status,
  taxbandits_status,
  refund_amount,
  accepted_at,
  filed_at,
  employee_name,
  employer_name,
  wages,
  federal_tax_withheld
FROM public.w2_filings
WHERE submission_id = 'W2-1762832662353';
