-- ============================================
-- TAXU COMPREHENSIVE SCHEMA RELATIONSHIPS
-- Creates all necessary foreign keys and relationships
-- between Tax Filing, Neobank, Accounting, and Investment
-- ============================================

-- Add organization_id to tax_filings if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tax_filings' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE public.tax_filings 
    ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
    
    CREATE INDEX idx_tax_filings_org_id ON public.tax_filings(organization_id);
  END IF;
END $$;

-- Add refund_deposited flag to track if refund was sent to neobank
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tax_filings' AND column_name = 'refund_deposited'
  ) THEN
    ALTER TABLE public.tax_filings 
    ADD COLUMN refund_deposited BOOLEAN DEFAULT FALSE,
    ADD COLUMN refund_deposit_date TIMESTAMP WITH TIME ZONE,
    ADD COLUMN neobank_transaction_id UUID;
  END IF;
END $$;

-- Create tax_filing_neobank_deposits junction table
CREATE TABLE IF NOT EXISTS public.tax_filing_neobank_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_filing_id UUID NOT NULL REFERENCES public.tax_filings(id) ON DELETE CASCADE,
  neobank_account_id UUID NOT NULL REFERENCES public.neobank_accounts(id) ON DELETE CASCADE,
  neobank_transaction_id UUID REFERENCES public.neobank_transactions(id) ON DELETE SET NULL,
  refund_amount NUMERIC(15, 2) NOT NULL,
  deposit_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
  deposit_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tax_filing_id, neobank_account_id)
);

CREATE INDEX IF NOT EXISTS idx_filing_neobank_deposits_filing ON public.tax_filing_neobank_deposits(tax_filing_id);
CREATE INDEX IF NOT EXISTS idx_filing_neobank_deposits_account ON public.tax_filing_neobank_deposits(neobank_account_id);

-- Enable RLS
ALTER TABLE public.tax_filing_neobank_deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own filing deposits"
  ON public.tax_filing_neobank_deposits FOR SELECT
  USING (
    tax_filing_id IN (
      SELECT id FROM public.tax_filings WHERE user_id = auth.uid()
    )
  );

-- Create tax_filing_accounting_transactions junction
CREATE TABLE IF NOT EXISTS public.tax_filing_accounting_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_filing_id UUID NOT NULL REFERENCES public.tax_filings(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- refund_received, tax_payment, estimated_payment
  amount NUMERIC(15, 2) NOT NULL,
  accounting_posted BOOLEAN DEFAULT FALSE,
  invoice_id UUID,
  expense_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_filing_accounting_tx_filing ON public.tax_filing_accounting_transactions(tax_filing_id);

ALTER TABLE public.tax_filing_accounting_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own filing accounting transactions"
  ON public.tax_filing_accounting_transactions FOR ALL
  USING (
    tax_filing_id IN (
      SELECT id FROM public.tax_filings WHERE user_id = auth.uid()
    )
  );

-- Add tax_filing_id to investment_transactions for tax-loss harvesting tracking
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'investment_transactions' AND column_name = 'tax_filing_id'
  ) THEN
    ALTER TABLE public.investment_transactions 
    ADD COLUMN tax_filing_id UUID REFERENCES public.tax_filings(id) ON DELETE SET NULL;
    
    CREATE INDEX idx_investment_tx_filing ON public.investment_transactions(tax_filing_id);
  END IF;
END $$;

-- Create comprehensive audit log table
CREATE TABLE IF NOT EXISTS public.taxu_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL, -- tax_filing, neobank_account, investment_holding, etc.
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- create, update, delete, status_change
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.taxu_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.taxu_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.taxu_audit_log(created_at);

ALTER TABLE public.taxu_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs"
  ON public.taxu_audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- Create fraud detection table
CREATE TABLE IF NOT EXISTS public.fraud_detection_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  fraud_type VARCHAR(100) NOT NULL, -- duplicate_filing, suspicious_refund, etc.
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
  details JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'flagged', -- flagged, reviewing, resolved, false_positive
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fraud_log_user ON public.fraud_detection_log(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_log_status ON public.fraud_detection_log(status);
CREATE INDEX IF NOT EXISTS idx_fraud_log_severity ON public.fraud_detection_log(severity);

ALTER TABLE public.fraud_detection_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view fraud logs
CREATE POLICY "Admins can view fraud logs"
  ON public.fraud_detection_log FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
