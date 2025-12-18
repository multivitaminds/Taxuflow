-- Add comprehensive Row Level Security (RLS) policies
-- Version: 1
-- Date: 2025-01-15

-- Enable RLS on tables that don't have it yet
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Add missing RLS policies for critical tables

-- Form 941 filings policies
DROP POLICY IF EXISTS "Users can manage their own 941 filings" ON public.form_941_filings;
CREATE POLICY "Users can manage their own 941 filings"
  ON public.form_941_filings FOR ALL
  USING (auth.uid() = user_id);

-- W2 filings policies  
DROP POLICY IF EXISTS "Users can manage their own W-2 filings" ON public.w2_filings;
CREATE POLICY "Users can manage their own W-2 filings"
  ON public.w2_filings FOR ALL
  USING (auth.uid() = user_id);

-- 1099-NEC filings policies
DROP POLICY IF EXISTS "Users can manage their own 1099-NEC filings" ON public.nec_1099_filings;
CREATE POLICY "Users can manage their own 1099-NEC filings"
  ON public.nec_1099_filings FOR ALL
  USING (auth.uid() = user_id);

-- Recipients policies
DROP POLICY IF EXISTS "Users can manage their own recipients" ON public.recipients;
CREATE POLICY "Users can manage their own recipients"
  ON public.recipients FOR ALL
  USING (auth.uid() = user_id);

-- Investment holdings policies
DROP POLICY IF EXISTS "Users can manage their own investment holdings" ON public.investment_holdings;
CREATE POLICY "Users can manage their own investment holdings"
  ON public.investment_holdings FOR ALL
  USING (auth.uid() = user_id);

-- Neobank accounts policies
DROP POLICY IF EXISTS "Users can manage their own neobank accounts" ON public.neobank_accounts;
CREATE POLICY "Users can manage their own neobank accounts"
  ON public.neobank_accounts FOR ALL
  USING (auth.uid() = user_id);

-- Neobank transactions policies
DROP POLICY IF EXISTS "Users can manage their own neobank transactions" ON public.neobank_transactions;
CREATE POLICY "Users can manage their own neobank transactions"
  ON public.neobank_transactions FOR ALL
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.neobank_accounts
    WHERE id = neobank_transactions.account_id AND user_id = auth.uid()
  ));

-- Invoices policies
DROP POLICY IF EXISTS "Users can manage their own invoices" ON public.invoices;
CREATE POLICY "Users can manage their own invoices"
  ON public.invoices FOR ALL
  USING (auth.uid() = user_id);

-- Bills policies
DROP POLICY IF EXISTS "Users can manage their own bills" ON public.bills;
CREATE POLICY "Users can manage their own bills"
  ON public.bills FOR ALL
  USING (auth.uid() = user_id);

-- Expenses policies
DROP POLICY IF EXISTS "Users can manage their own expenses" ON public.expenses;
CREATE POLICY "Users can manage their own expenses"
  ON public.expenses FOR ALL
  USING (auth.uid() = user_id);

-- Documents policies (critical for security)
DROP POLICY IF EXISTS "Users can manage their own documents" ON public.documents;
CREATE POLICY "Users can manage their own documents"
  ON public.documents FOR ALL
  USING (auth.uid() = user_id);

-- W9 forms policies
DROP POLICY IF EXISTS "Users can manage their own W-9 forms" ON public.w9_forms;
CREATE POLICY "Users can manage their own W-9 forms"
  ON public.w9_forms FOR ALL
  USING (auth.uid() = user_id);

-- Tax filings policies
DROP POLICY IF EXISTS "Users can manage their own tax filings" ON public.tax_filings;
CREATE POLICY "Users can manage their own tax filings"
  ON public.tax_filings FOR ALL
  USING (auth.uid() = user_id);
