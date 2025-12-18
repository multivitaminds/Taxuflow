-- ============================================
-- VERIFICATION SCRIPT
-- Verify all relationships and data integrity
-- ============================================

-- 1. Verify tax filing statistics
SELECT 
  'TAX FILING STATS' as report_type,
  COUNT(*) as total_filings,
  COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_count,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
  COALESCE(SUM(CASE WHEN status = 'accepted' THEN refund_amount ELSE 0 END), 0) as total_refunds,
  COUNT(CASE WHEN refund_deposited = TRUE THEN 1 END) as refunds_deposited
FROM public.tax_filings;

-- 2. Verify the 8 specific W-2 filings
SELECT 
  '8 SPECIFIC W-2 FILINGS' as report_type,
  submission_id,
  status,
  refund_amount,
  refund_deposited,
  TO_CHAR(accepted_at, 'MM/DD/YYYY, HH12:MI:SS AM') as accepted_timestamp
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
ORDER BY submission_id;

-- 3. Verify neobank deposits
SELECT 
  'NEOBANK DEPOSITS' as report_type,
  COUNT(*) as total_deposits,
  SUM(refund_amount) as total_deposited,
  COUNT(CASE WHEN deposit_status = 'completed' THEN 1 END) as completed_deposits
FROM public.tax_filing_neobank_deposits;

-- 4. Verify neobank account balances
SELECT 
  'NEOBANK BALANCES' as report_type,
  na.account_type,
  na.account_number,
  na.balance,
  COUNT(tfnd.id) as refund_deposits_count,
  SUM(tfnd.refund_amount) as total_refunds_received
FROM public.neobank_accounts na
LEFT JOIN public.tax_filing_neobank_deposits tfnd ON na.id = tfnd.neobank_account_id
WHERE na.account_type = 'checking'
GROUP BY na.id, na.account_type, na.account_number, na.balance;

-- 5. Verify fraud detection is working
SELECT 
  'FRAUD DETECTION STATUS' as report_type,
  fraud_type,
  severity,
  COUNT(*) as incident_count
FROM public.fraud_detection_log
GROUP BY fraud_type, severity;

-- 6. Verify cross-feature relationships exist
SELECT 
  'CROSS-FEATURE RELATIONSHIPS' as report_type,
  'tax_filing_neobank_deposits' as table_name,
  COUNT(*) as record_count
FROM public.tax_filing_neobank_deposits
UNION ALL
SELECT 
  'CROSS-FEATURE RELATIONSHIPS',
  'tax_filing_accounting_transactions',
  COUNT(*)
FROM public.tax_filing_accounting_transactions
UNION ALL
SELECT 
  'CROSS-FEATURE RELATIONSHIPS',
  'taxu_audit_log',
  COUNT(*)
FROM public.taxu_audit_log;

-- 7. Show detailed refund deposit information
SELECT 
  'DETAILED REFUND DEPOSITS' as report_type,
  tf.submission_id,
  tf.form_type,
  tf.tax_year,
  tf.refund_amount as filing_refund,
  na.account_number as deposited_to_account,
  nt.amount as deposit_amount,
  TO_CHAR(nt.created_at, 'MM/DD/YYYY, HH12:MI:SS AM') as deposit_timestamp,
  tfnd.deposit_status
FROM public.tax_filings tf
INNER JOIN public.tax_filing_neobank_deposits tfnd ON tf.id = tfnd.tax_filing_id
INNER JOIN public.neobank_accounts na ON tfnd.neobank_account_id = na.id
LEFT JOIN public.neobank_transactions nt ON tfnd.neobank_transaction_id = nt.id
WHERE tf.status = 'accepted'
ORDER BY nt.created_at DESC;
