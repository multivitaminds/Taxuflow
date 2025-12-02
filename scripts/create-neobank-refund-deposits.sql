-- Create NeoBank Refund Deposits
-- This script creates transactions in the Taxu NeoBank accounts for accepted W-2 refunds
-- Ensures refunds are properly credited to users' neobank accounts

-- Insert refund deposits into neobank_transactions for each accepted W-2 filing with refund
INSERT INTO public.neobank_transactions (
  id,
  account_id,
  transaction_type,
  amount,
  currency,
  description,
  merchant_name,
  status,
  transaction_date,
  posted_date,
  is_tax_deductible,
  metadata,
  created_at
)
SELECT 
  gen_random_uuid(),
  na.id as account_id,
  'deposit',
  wf.refund_amount,
  'USD',
  'IRS Tax Refund - W-2 Filing ' || wf.submission_id,
  'Internal Revenue Service',
  'completed',
  wf.accepted_at,
  wf.accepted_at + INTERVAL '1 day',
  false,
  jsonb_build_object(
    'source', 'tax_filing',
    'filing_id', wf.id,
    'submission_id', wf.submission_id,
    'tax_year', wf.tax_year,
    'form_type', 'W-2'
  ),
  NOW()
FROM public.w2_filings wf
INNER JOIN public.neobank_accounts na ON na.user_id = wf.user_id AND na.account_type = 'checking' AND na.status = 'active'
WHERE wf.irs_status = 'accepted'
  AND wf.refund_amount IS NOT NULL
  AND wf.refund_amount > 0
  AND NOT EXISTS (
    -- Prevent duplicate deposits
    SELECT 1 FROM public.neobank_transactions nt
    WHERE nt.metadata->>'submission_id' = wf.submission_id
    AND nt.transaction_type = 'deposit'
  );

-- Update neobank account balances with refund amounts
UPDATE public.neobank_accounts na
SET 
  balance = balance + (
    SELECT COALESCE(SUM(wf.refund_amount), 0)
    FROM public.w2_filings wf
    WHERE wf.user_id = na.user_id
      AND wf.irs_status = 'accepted'
      AND wf.refund_amount IS NOT NULL
      AND wf.refund_amount > 0
      AND NOT EXISTS (
        SELECT 1 FROM public.neobank_transactions nt
        WHERE nt.account_id = na.id
          AND nt.metadata->>'submission_id' = wf.submission_id
          AND nt.transaction_type = 'deposit'
          AND nt.created_at < NOW() - INTERVAL '1 minute'
      )
  ),
  updated_at = NOW()
WHERE na.account_type = 'checking'
  AND na.status = 'active';

-- Display summary of refund deposits
SELECT 
  na.account_number,
  na.balance as current_balance,
  COUNT(nt.id) as refund_count,
  SUM(nt.amount) as total_refunds_deposited
FROM public.neobank_accounts na
LEFT JOIN public.neobank_transactions nt ON nt.account_id = na.id 
  AND nt.transaction_type = 'deposit'
  AND nt.metadata->>'source' = 'tax_filing'
WHERE na.account_type = 'checking'
  AND na.status = 'active'
GROUP BY na.account_number, na.balance;
