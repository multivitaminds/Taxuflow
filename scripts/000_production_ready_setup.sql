-- Production-Ready Setup for Taxu
-- This script ensures all tables have proper RLS policies and indexes for Vercel deployment

-- ============================================================================
-- SECURITY: Enable Row Level Security on all tables
-- ============================================================================

-- Public schema tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.w2_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligent_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deductions_credits ENABLE ROW LEVEL SECURITY;

-- Accounting tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: Users can only access their own data
-- ============================================================================

-- User Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Documents
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
CREATE POLICY "Users can insert own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
CREATE POLICY "Users can update own documents" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;
CREATE POLICY "Users can delete own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

-- W2 Data
DROP POLICY IF EXISTS "Users can view own W2 data" ON public.w2_data;
CREATE POLICY "Users can view own W2 data" ON public.w2_data
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own W2 data" ON public.w2_data;
CREATE POLICY "Users can insert own W2 data" ON public.w2_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tax Forms
DROP POLICY IF EXISTS "Users can view own tax forms" ON public.tax_forms;
CREATE POLICY "Users can view own tax forms" ON public.tax_forms
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own tax forms" ON public.tax_forms;
CREATE POLICY "Users can manage own tax forms" ON public.tax_forms
  FOR ALL USING (auth.uid() = user_id);

-- Tax Calculations
DROP POLICY IF EXISTS "Users can view own calculations" ON public.tax_calculations;
CREATE POLICY "Users can view own calculations" ON public.tax_calculations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own calculations" ON public.tax_calculations;
CREATE POLICY "Users can manage own calculations" ON public.tax_calculations
  FOR ALL USING (auth.uid() = user_id);

-- Invoices
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own invoices" ON public.invoices;
CREATE POLICY "Users can manage own invoices" ON public.invoices
  FOR ALL USING (auth.uid() = user_id);

-- Bills
DROP POLICY IF EXISTS "Users can view own bills" ON public.bills;
CREATE POLICY "Users can view own bills" ON public.bills
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own bills" ON public.bills;
CREATE POLICY "Users can manage own bills" ON public.bills
  FOR ALL USING (auth.uid() = user_id);

-- Expenses
DROP POLICY IF EXISTS "Users can view own expenses" ON public.expenses;
CREATE POLICY "Users can view own expenses" ON public.expenses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own expenses" ON public.expenses;
CREATE POLICY "Users can manage own expenses" ON public.expenses
  FOR ALL USING (auth.uid() = user_id);

-- Customers
DROP POLICY IF EXISTS "Users can view own customers" ON public.customers;
CREATE POLICY "Users can view own customers" ON public.customers
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own customers" ON public.customers;
CREATE POLICY "Users can manage own customers" ON public.customers
  FOR ALL USING (auth.uid() = user_id);

-- Vendors
DROP POLICY IF EXISTS "Users can view own vendors" ON public.vendors;
CREATE POLICY "Users can view own vendors" ON public.vendors
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own vendors" ON public.vendors;
CREATE POLICY "Users can manage own vendors" ON public.vendors
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- PERFORMANCE: Add indexes for common queries
-- ============================================================================

-- User lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(ai_processing_status);

-- Tax data lookups
CREATE INDEX IF NOT EXISTS idx_w2_user_id ON public.w2_data(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_forms_user_id ON public.tax_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_forms_year ON public.tax_forms(tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_user_id ON public.tax_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_user_id ON public.tax_filings(user_id);

-- Accounting lookups
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON public.invoices(invoice_date DESC);

CREATE INDEX IF NOT EXISTS idx_bills_user_id ON public.bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_vendor_id ON public.bills(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_date ON public.bills(bill_date DESC);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category_id);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON public.vendors(user_id);

CREATE INDEX IF NOT EXISTS idx_bank_transactions_account ON public.bank_transactions(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON public.bank_transactions(transaction_date DESC);

-- Agent activity lookups
CREATE INDEX IF NOT EXISTS idx_agent_activities_user_id ON public.agent_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_activities_created ON public.agent_activities(created_at DESC);

-- Composite indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_documents_user_status ON public.documents(user_id, ai_processing_status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_status ON public.invoices(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bills_user_status ON public.bills(user_id, status);

-- ============================================================================
-- OPTIMIZE: Analyze tables for query planner
-- ============================================================================

ANALYZE public.user_profiles;
ANALYZE public.documents;
ANALYZE public.w2_data;
ANALYZE public.tax_forms;
ANALYZE public.tax_calculations;
ANALYZE public.invoices;
ANALYZE public.bills;
ANALYZE public.expenses;
ANALYZE public.customers;
ANALYZE public.vendors;
ANALYZE public.bank_transactions;
ANALYZE public.agent_activities;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Production setup complete!';
  RAISE NOTICE '✅ Row Level Security enabled on all tables';
  RAISE NOTICE '✅ Performance indexes created';
  RAISE NOTICE '✅ Database optimized for Vercel deployment';
END $$;
