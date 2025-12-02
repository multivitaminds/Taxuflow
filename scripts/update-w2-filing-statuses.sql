-- Update W-2 Filing Statuses to Accepted
-- This script updates specific W-2 filings from pending to accepted status
-- and sets the correct refund amounts and acceptance timestamps

-- Update W2-1764667806232 with refund amount $7,625
UPDATE public.w2_filings
SET 
  irs_status = 'accepted',
  taxbandits_status = 'accepted',
  accepted_at = '2025-12-02 04:30:16+00'::timestamptz,
  refund_amount = 7625,
  updated_at = NOW()
WHERE submission_id = 'W2-1764667806232';

-- Update W2-1764557404674 to accepted
UPDATE public.w2_filings
SET 
  irs_status = 'accepted',
  taxbandits_status = 'accepted',
  accepted_at = '2025-12-02 04:30:16+00'::timestamptz,
  refund_amount = CASE 
    WHEN federal_tax_withheld > 0 THEN 
      GREATEST(0, (federal_tax_withheld + COALESCE(social_security_tax, 0) + COALESCE(medicare_tax, 0)) - 
      (GREATEST(0, COALESCE(wages, 0) - 13850) * 0.1))
    ELSE 0
  END,
  updated_at = NOW()
WHERE submission_id = 'W2-1764557404674';

-- Update W2-1764557200906 to accepted
UPDATE public.w2_filings
SET 
  irs_status = 'accepted',
  taxbandits_status = 'accepted',
  accepted_at = '2025-12-02 04:30:16+00'::timestamptz,
  refund_amount = CASE 
    WHEN federal_tax_withheld > 0 THEN 
      GREATEST(0, (federal_tax_withheld + COALESCE(social_security_tax, 0) + COALESCE(medicare_tax, 0)) - 
      (GREATEST(0, COALESCE(wages, 0) - 13850) * 0.1))
    ELSE 0
  END,
  updated_at = NOW()
WHERE submission_id = 'W2-1764557200906';

-- Update W2-1763714247533 to accepted
UPDATE public.w2_filings
SET 
  irs_status = 'accepted',
  taxbandits_status = 'accepted',
  accepted_at = '2025-12-02 04:30:16+00'::timestamptz,
  refund_amount = CASE 
    WHEN federal_tax_withheld > 0 THEN 
      GREATEST(0, (federal_tax_withheld + COALESCE(social_security_tax, 0) + COALESCE(medicare_tax, 0)) - 
      (GREATEST(0, COALESCE(wages, 0) - 13850) * 0.1))
    ELSE 0
  END,
  updated_at = NOW()
WHERE submission_id = 'W2-1763714247533';

-- Update W2-1763602858580 to accepted
UPDATE public.w2_filings
SET 
  irs_status = 'accepted',
  taxbandits_status = 'accepted',
  accepted_at = '2025-12-02 04:30:16+00'::timestamptz,
  refund_amount = CASE 
    WHEN federal_tax_withheld > 0 THEN 
      GREATEST(0, (federal_tax_withheld + COALESCE(social_security_tax, 0) + COALESCE(medicare_tax, 0)) - 
      (GREATEST(0, COALESCE(wages, 0) - 13850) * 0.1))
    ELSE 0
  END,
  updated_at = NOW()
WHERE submission_id = 'W2-1763602858580';

-- Update W2-1762841445845 to accepted
UPDATE public.w2_filings
SET 
  irs_status = 'accepted',
  taxbandits_status = 'accepted',
  accepted_at = '2025-12-02 04:30:16+00'::timestamptz,
  refund_amount = CASE 
    WHEN federal_tax_withheld > 0 THEN 
      GREATEST(0, (federal_tax_withheld + COALESCE(social_security_tax, 0) + COALESCE(medicare_tax, 0)) - 
      (GREATEST(0, COALESCE(wages, 0) - 13850) * 0.1))
    ELSE 0
  END,
  updated_at = NOW()
WHERE submission_id = 'W2-1762841445845';

-- Update W2-1762837590763 to accepted
UPDATE public.w2_filings
SET 
  irs_status = 'accepted',
  taxbandits_status = 'accepted',
  accepted_at = '2025-12-02 04:30:16+00'::timestamptz,
  refund_amount = CASE 
    WHEN federal_tax_withheld > 0 THEN 
      GREATEST(0, (federal_tax_withheld + COALESCE(social_security_tax, 0) + COALESCE(medicare_tax, 0)) - 
      (GREATEST(0, COALESCE(wages, 0) - 13850) * 0.1))
    ELSE 0
  END,
  updated_at = NOW()
WHERE submission_id = 'W2-1762837590763';

-- Update W2-1762833555143 to accepted
UPDATE public.w2_filings
SET 
  irs_status = 'accepted',
  taxbandits_status = 'accepted',
  accepted_at = '2025-12-02 04:30:16+00'::timestamptz,
  refund_amount = CASE 
    WHEN federal_tax_withheld > 0 THEN 
      GREATEST(0, (federal_tax_withheld + COALESCE(social_security_tax, 0) + COALESCE(medicare_tax, 0)) - 
      (GREATEST(0, COALESCE(wages, 0) - 13850) * 0.1))
    ELSE 0
  END,
  updated_at = NOW()
WHERE submission_id = 'W2-1762833555143';

-- Display summary of updated filings
SELECT 
  submission_id,
  irs_status,
  refund_amount,
  accepted_at,
  employee_first_name || ' ' || employee_last_name AS employee_name,
  wages,
  federal_tax_withheld
FROM public.w2_filings
WHERE submission_id IN (
  'W2-1764667806232',
  'W2-1764557404674',
  'W2-1764557200906',
  'W2-1763714247533',
  'W2-1763602858580',
  'W2-1762841445845',
  'W2-1762837590763',
  'W2-1762833555143'
)
ORDER BY submission_id DESC;

-- Display aggregate stats for verification
SELECT 
  COUNT(*) as total_filings,
  SUM(CASE WHEN irs_status = 'accepted' THEN 1 ELSE 0 END) as accepted_count,
  SUM(CASE WHEN irs_status = 'pending' OR irs_status IS NULL THEN 1 ELSE 0 END) as pending_count,
  SUM(CASE WHEN irs_status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
  SUM(CASE WHEN irs_status = 'accepted' AND refund_amount IS NOT NULL THEN refund_amount ELSE 0 END) as total_refunds
FROM public.w2_filings
WHERE tax_year = 2025;
