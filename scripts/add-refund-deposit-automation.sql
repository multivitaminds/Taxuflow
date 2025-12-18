-- ===================================================================
-- ADD AUTOMATIC TAX REFUND DEPOSIT TO NEOBANK ACCOUNTS
-- This script adds functionality to automatically credit tax refunds
-- to user's Taxu checking accounts
-- ===================================================================

-- Step 1: Add refund tracking columns to neobank_accounts
ALTER TABLE public.neobank_accounts 
ADD COLUMN IF NOT EXISTS total_tax_refunds_deposited DECIMAL(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_refund_deposit_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_tax_refund_account BOOLEAN DEFAULT false;

-- Step 2: Update existing accounts to mark first checking account as tax refund account
UPDATE public.neobank_accounts 
SET is_tax_refund_account = true
WHERE account_type = 'checking'
  AND id IN (
    SELECT MIN(id) 
    FROM public.neobank_accounts 
    WHERE account_type = 'checking' 
    GROUP BY user_id
  );

-- Step 3: Add columns to track refund status in filings
ALTER TABLE public.w2_filings
ADD COLUMN IF NOT EXISTS refund_deposited BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS refund_deposited_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS refund_account_id UUID REFERENCES public.neobank_accounts(id);

-- Step 4: Create function to automatically deposit refunds
CREATE OR REPLACE FUNCTION deposit_tax_refund_to_account()
RETURNS TRIGGER AS $$
DECLARE
  v_refund_account_id UUID;
  v_refund_amount DECIMAL(12, 2);
BEGIN
  -- Only process accepted W-2 filings with refunds that haven't been deposited
  IF NEW.irs_status = 'accepted' AND 
     NEW.refund_amount > 0 AND 
     (OLD.refund_deposited IS NULL OR OLD.refund_deposited = false) THEN
    
    v_refund_amount := NEW.refund_amount;
    
    -- Find user's tax refund checking account
    SELECT id INTO v_refund_account_id
    FROM public.neobank_accounts
    WHERE user_id = NEW.user_id
      AND account_type = 'checking'
      AND (is_tax_refund_account = true OR nickname LIKE '%Tax Refund%')
      AND status = 'active'
    ORDER BY created_at ASC
    LIMIT 1;
    
    -- If no specific tax refund account, use first checking account
    IF v_refund_account_id IS NULL THEN
      SELECT id INTO v_refund_account_id
      FROM public.neobank_accounts
      WHERE user_id = NEW.user_id
        AND account_type = 'checking'
        AND status = 'active'
      ORDER BY created_at ASC
      LIMIT 1;
    END IF;
    
    IF v_refund_account_id IS NOT NULL THEN
      -- Update account balance
      UPDATE public.neobank_accounts
      SET 
        balance = balance + v_refund_amount,
        total_tax_refunds_deposited = COALESCE(total_tax_refunds_deposited, 0) + v_refund_amount,
        last_refund_deposit_date = NOW(),
        updated_at = NOW()
      WHERE id = v_refund_account_id;
      
      -- Create transaction record
      INSERT INTO public.neobank_transactions (
        account_id,
        user_id,
        amount,
        transaction_type,
        status,
        description,
        merchant_name,
        category,
        transaction_date,
        created_at
      ) VALUES (
        v_refund_account_id,
        NEW.user_id,
        v_refund_amount,
        'credit',
        'completed',
        'Tax Refund Deposit - ' || NEW.form_type || ' ' || NEW.tax_year,
        'IRS Tax Refund',
        'Income',
        NOW(),
        NOW()
      );
      
      -- Mark refund as deposited
      NEW.refund_deposited := true;
      NEW.refund_deposited_at := NOW();
      NEW.refund_account_id := v_refund_account_id;
      
      RAISE NOTICE 'Tax refund of $ % deposited to account %', v_refund_amount, v_refund_account_id;
    ELSE
      RAISE WARNING 'No checking account found for user % to deposit refund', NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger for automatic refund deposits
DROP TRIGGER IF EXISTS trigger_deposit_tax_refund ON public.w2_filings;
CREATE TRIGGER trigger_deposit_tax_refund
  BEFORE UPDATE ON public.w2_filings
  FOR EACH ROW
  EXECUTE FUNCTION deposit_tax_refund_to_account();

-- Step 6: Add similar columns for business tax refunds in 1099 filings
ALTER TABLE public.nec_1099_filings
ADD COLUMN IF NOT EXISTS refund_deposited BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS refund_deposited_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS refund_account_id UUID REFERENCES public.neobank_accounts(id);

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_tax_refund 
  ON public.neobank_accounts(user_id, is_tax_refund_account) 
  WHERE is_tax_refund_account = true;

CREATE INDEX IF NOT EXISTS idx_w2_filings_refund_status 
  ON public.w2_filings(user_id, irs_status, refund_deposited) 
  WHERE irs_status = 'accepted';

-- Done!
SELECT 'Tax refund auto-deposit system created successfully!' AS status;
