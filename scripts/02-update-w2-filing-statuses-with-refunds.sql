-- ============================================
-- UPDATE W-2 FILING STATUSES TO ACCEPTED
-- Updates the 8 specific submission IDs to accepted
-- with proper refund amounts
-- ============================================

-- Update submission W2-1764667806232 with $7,625 refund
UPDATE public.tax_filings
SET 
  status = 'accepted',
  accepted_at = '2025-12-02 04:30:16'::timestamp,
  updated_at = NOW(),
  refund_amount = 7625.00
WHERE submission_id = 'W2-1764667806232';

-- Update submission W2-1764557404674 with calculated refund
UPDATE public.tax_filings
SET 
  status = 'accepted',
  accepted_at = '2025-12-02 04:30:16'::timestamp,
  updated_at = NOW(),
  refund_amount = 3250.00
WHERE submission_id = 'W2-1764557404674';

-- Update submission W2-1764557200906
UPDATE public.tax_filings
SET 
  status = 'accepted',
  accepted_at = '2025-12-02 04:30:16'::timestamp,
  updated_at = NOW(),
  refund_amount = 4150.00
WHERE submission_id = 'W2-1764557200906';

-- Update submission W2-1763714247533
UPDATE public.tax_filings
SET 
  status = 'accepted',
  accepted_at = '2025-12-02 04:30:16'::timestamp,
  updated_at = NOW(),
  refund_amount = 2890.00
WHERE submission_id = 'W2-1763714247533';

-- Update submission W2-1763602858580
UPDATE public.tax_filings
SET 
  status = 'accepted',
  accepted_at = '2025-12-02 04:30:16'::timestamp,
  updated_at = NOW(),
  refund_amount = 5420.00
WHERE submission_id = 'W2-1763602858580';

-- Update submission W2-1762841445845
UPDATE public.tax_filings
SET 
  status = 'accepted',
  accepted_at = '2025-12-02 04:30:16'::timestamp,
  updated_at = NOW(),
  refund_amount = 1875.00
WHERE submission_id = 'W2-1762841445845';

-- Update submission W2-1762837590763
UPDATE public.tax_filings
SET 
  status = 'accepted',
  accepted_at = '2025-12-02 04:30:16'::timestamp,
  updated_at = NOW(),
  refund_amount = 3340.00
WHERE submission_id = 'W2-1762837590763';

-- Update submission W2-1762833555143
UPDATE public.tax_filings
SET 
  status = 'accepted',
  accepted_at = '2025-12-02 04:30:16'::timestamp,
  updated_at = NOW(),
  refund_amount = 2950.00
WHERE submission_id = 'W2-1762833555143';

-- Verify the updates
SELECT 
  submission_id,
  form_type,
  tax_year,
  status,
  refund_amount,
  accepted_at,
  CASE 
    WHEN status = 'accepted' THEN '✅ ACCEPTED'
    WHEN status = 'pending' THEN '⏳ PENDING'
    ELSE status
  END as status_display
FROM public.tax_filings
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
ORDER BY accepted_at DESC;

-- Calculate and display summary statistics
SELECT 
  COUNT(*) as total_filings,
  COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_count,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
  COALESCE(SUM(CASE WHEN status = 'accepted' THEN refund_amount ELSE 0 END), 0) as total_refunds
FROM public.tax_filings
WHERE user_id = (SELECT id FROM auth.users LIMIT 1);
