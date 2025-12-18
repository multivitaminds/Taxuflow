-- ============================================
-- DEPOSIT TAX REFUNDS TO NEOBANK ACCOUNTS
-- Automatically deposits accepted refunds to Taxu Bank
-- ============================================

-- Function to deposit refund to neobank
CREATE OR REPLACE FUNCTION deposit_tax_refund_to_neobank()
RETURNS TRIGGER AS $$
DECLARE
  v_neobank_account_id UUID;
  v_new_balance NUMERIC(15, 2);
  v_transaction_id UUID;
BEGIN
  -- Only process if status changed to accepted and has refund amount
  IF NEW.status = 'accepted' AND NEW.refund_amount > 0 AND 
     (OLD.status IS NULL OR OLD.status != 'accepted') AND
     NEW.refund_deposited = FALSE THEN
    
    -- Find user's primary checking account
    SELECT id INTO v_neobank_account_id
    FROM public.neobank_accounts
    WHERE user_id = NEW.user_id 
      AND account_type = 'checking'
      AND status = 'active'
    ORDER BY created_at ASC
    LIMIT 1;
    
    -- If no checking account exists, create one
    IF v_neobank_account_id IS NULL THEN
      INSERT INTO public.neobank_accounts (
        user_id,
        account_type,
        account_number,
        routing_number,
        balance,
        currency,
        status
      ) VALUES (
        NEW.user_id,
        'checking',
        'TAXU' || LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0'),
        '121000248',
        NEW.refund_amount,
        'USD',
        'active'
      )
      RETURNING id INTO v_neobank_account_id;
      
      v_new_balance := NEW.refund_amount;
    ELSE
      -- Update existing account balance
      UPDATE public.neobank_accounts
      SET balance = balance + NEW.refund_amount,
          updated_at = NOW()
      WHERE id = v_neobank_account_id
      RETURNING balance INTO v_new_balance;
    END IF;
    
    -- Create neobank transaction record
    INSERT INTO public.neobank_transactions (
      user_id,
      account_id,
      transaction_type,
      amount,
      balance_after,
      status,
      description,
      category,
      metadata
    ) VALUES (
      NEW.user_id,
      v_neobank_account_id,
      'deposit',
      NEW.refund_amount,
      v_new_balance,
      'completed',
      'Tax Refund - ' || NEW.form_type || ' ' || NEW.tax_year,
      'tax_refund',
      jsonb_build_object(
        'source', 'tax_filing',
        'filing_id', NEW.id,
        'submission_id', NEW.submission_id,
        'form_type', NEW.form_type,
        'tax_year', NEW.tax_year
      )
    )
    RETURNING id INTO v_transaction_id;
    
    -- Create junction table record
    INSERT INTO public.tax_filing_neobank_deposits (
      tax_filing_id,
      neobank_account_id,
      neobank_transaction_id,
      refund_amount,
      deposit_status,
      deposit_date
    ) VALUES (
      NEW.id,
      v_neobank_account_id,
      v_transaction_id,
      NEW.refund_amount,
      'completed',
      NOW()
    );
    
    -- Mark filing as deposited
    NEW.refund_deposited := TRUE;
    NEW.refund_deposit_date := NOW();
    NEW.neobank_transaction_id := v_transaction_id;
    
    -- Log the deposit
    INSERT INTO public.taxu_audit_log (
      user_id,
      entity_type,
      entity_id,
      action,
      new_values
    ) VALUES (
      NEW.user_id,
      'tax_refund_deposit',
      NEW.id,
      'refund_deposited',
      jsonb_build_object(
        'refund_amount', NEW.refund_amount,
        'neobank_account_id', v_neobank_account_id,
        'transaction_id', v_transaction_id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic refund deposits
DROP TRIGGER IF EXISTS trigger_deposit_tax_refund ON public.tax_filings;
CREATE TRIGGER trigger_deposit_tax_refund
  BEFORE UPDATE ON public.tax_filings
  FOR EACH ROW
  EXECUTE FUNCTION deposit_tax_refund_to_neobank();

-- Manually trigger deposits for the 8 accepted filings
UPDATE public.tax_filings
SET refund_deposited = FALSE
WHERE submission_id IN (
  'W2-1764667806232',
  'W2-1764557404674',
  'W2-1764557200906',
  'W2-1763714247533',
  'W2-1763602858580',
  'W2-1762841445845',
  'W2-1762837590763',
  'W2-1762833555143'
) AND status = 'accepted';

-- Verify deposits
SELECT 
  tf.submission_id,
  tf.form_type,
  tf.refund_amount,
  tf.refund_deposited,
  na.account_number as neobank_account,
  na.balance as account_balance,
  nt.amount as deposit_amount,
  nt.created_at as deposit_date
FROM public.tax_filings tf
LEFT JOIN public.tax_filing_neobank_deposits tfnd ON tf.id = tfnd.tax_filing_id
LEFT JOIN public.neobank_accounts na ON tfnd.neobank_account_id = na.id
LEFT JOIN public.neobank_transactions nt ON tfnd.neobank_transaction_id = nt.id
WHERE tf.submission_id IN (
  'W2-1764667806232',
  'W2-1764557404674',
  'W2-1764557200906',
  'W2-1763714247533',
  'W2-1763602858580',
  'W2-1762841445845',
  'W2-1762837590763',
  'W2-1762833555143'
)
ORDER BY tf.accepted_at DESC;
