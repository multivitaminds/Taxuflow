-- Add comprehensive Row Level Security (RLS) policies
-- Fixed version matching actual database schema
-- Version: 2
-- Date: 2025-01-15

-- Enable RLS on critical tables
ALTER TABLE public.form_941_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.w2_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nec_1099_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.w9_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_filings ENABLE ROW LEVEL SECURITY;

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

-- Contractor payments policies
DROP POLICY IF EXISTS "Users can manage their own contractor payments" ON public.contractor_payments;
CREATE POLICY "Users can manage their own contractor payments"
  ON public.contractor_payments FOR ALL
  USING (auth.uid() = user_id);

-- Investment holdings policies
DROP POLICY IF EXISTS "Users can manage their own investment holdings" ON public.investment_holdings;
CREATE POLICY "Users can manage their own investment holdings"
  ON public.investment_holdings FOR ALL
  USING (auth.uid() = user_id);

-- Investment portfolios policies
DROP POLICY IF EXISTS "Users can manage their own investment portfolios" ON public.investment_portfolios;
CREATE POLICY "Users can manage their own investment portfolios"
  ON public.investment_portfolios FOR ALL
  USING (auth.uid() = user_id);

-- Investment transactions policies
DROP POLICY IF EXISTS "Users can manage their own investment transactions" ON public.investment_transactions;
CREATE POLICY "Users can manage their own investment transactions"
  ON public.investment_transactions FOR ALL
  USING (auth.uid() = user_id);

-- Neobank accounts policies
DROP POLICY IF EXISTS "Users can manage their own neobank accounts" ON public.neobank_accounts;
CREATE POLICY "Users can manage their own neobank accounts"
  ON public.neobank_accounts FOR ALL
  USING (auth.uid() = user_id);

-- Neobank cards policies
DROP POLICY IF EXISTS "Users can manage their own neobank cards" ON public.neobank_cards;
CREATE POLICY "Users can manage their own neobank cards"
  ON public.neobank_cards FOR ALL
  USING (auth.uid() = user_id);

-- Neobank transactions policies
DROP POLICY IF EXISTS "Users can view own neobank transactions" ON public.neobank_transactions;
CREATE POLICY "Users can view own neobank transactions"
  ON public.neobank_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.neobank_accounts
      WHERE id = neobank_transactions.account_id AND user_id = auth.uid()
    )
  );

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

-- Customers policies
DROP POLICY IF EXISTS "Users can manage their own customers" ON public.customers;
CREATE POLICY "Users can manage their own customers"
  ON public.customers FOR ALL
  USING (auth.uid() = user_id);

-- Vendors policies
DROP POLICY IF EXISTS "Users can manage their own vendors" ON public.vendors;
CREATE POLICY "Users can manage their own vendors"
  ON public.vendors FOR ALL
  USING (auth.uid() = user_id);

-- Accounts policies
DROP POLICY IF EXISTS "Users can manage their own accounts" ON public.accounts;
CREATE POLICY "Users can manage their own accounts"
  ON public.accounts FOR ALL
  USING (auth.uid() = user_id);

-- Bank accounts policies
DROP POLICY IF EXISTS "Users can manage their own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can manage their own bank accounts"
  ON public.bank_accounts FOR ALL
  USING (auth.uid() = user_id);
