-- =====================================================
-- COMPREHENSIVE SCHEMA ENHANCEMENT FOR DATA ENTRY
-- Ensures all tables support adding new entries with proper:
-- - Foreign key relationships
-- - Indexes for performance
-- - Default values for ease of insertion
-- - RLS policies for security
-- =====================================================

-- =====================================================
-- PART 1: ACCOUNTING MODULE ENHANCEMENTS
-- =====================================================

-- Ensure customers table has proper relationships
ALTER TABLE public.customers 
  DROP CONSTRAINT IF EXISTS customers_user_id_fkey,
  ADD CONSTRAINT customers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.customers 
  DROP CONSTRAINT IF EXISTS customers_organization_id_fkey,
  ADD CONSTRAINT customers_organization_id_fkey 
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add indexes for customer lookups
CREATE INDEX IF NOT EXISTS idx_customers_user_org ON public.customers(user_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_active ON public.customers(is_active) WHERE is_active = true;

-- Ensure vendors table has proper relationships
ALTER TABLE public.vendors 
  DROP CONSTRAINT IF EXISTS vendors_user_id_fkey,
  ADD CONSTRAINT vendors_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.vendors 
  DROP CONSTRAINT IF EXISTS vendors_organization_id_fkey,
  ADD CONSTRAINT vendors_organization_id_fkey 
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add indexes for vendor lookups
CREATE INDEX IF NOT EXISTS idx_vendors_user_org ON public.vendors(user_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_vendors_email ON public.vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendors_active ON public.vendors(is_active) WHERE is_active = true;

-- Ensure contacts table supports both individual and organizational relationships
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_org_id ON public.contacts(org_id);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON public.contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);

-- =====================================================
-- PART 2: EMPLOYEES AND PAYROLL ENHANCEMENTS
-- =====================================================

-- Ensure employees table has proper structure and relationships
ALTER TABLE public.employees 
  DROP CONSTRAINT IF EXISTS employees_organization_id_fkey,
  ADD CONSTRAINT employees_organization_id_fkey 
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'ssn_encrypted') THEN
    ALTER TABLE public.employees ADD COLUMN ssn_encrypted TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'address') THEN
    ALTER TABLE public.employees ADD COLUMN address TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'city') THEN
    ALTER TABLE public.employees ADD COLUMN city TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'state') THEN
    ALTER TABLE public.employees ADD COLUMN state TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'zip_code') THEN
    ALTER TABLE public.employees ADD COLUMN zip_code TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'phone') THEN
    ALTER TABLE public.employees ADD COLUMN phone TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'hire_date') THEN
    ALTER TABLE public.employees ADD COLUMN hire_date DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'termination_date') THEN
    ALTER TABLE public.employees ADD COLUMN termination_date DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'salary') THEN
    ALTER TABLE public.employees ADD COLUMN salary NUMERIC(10, 2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'employment_type') THEN
    ALTER TABLE public.employees ADD COLUMN employment_type TEXT DEFAULT 'full-time';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'employees' 
                 AND column_name = 'is_active') THEN
    ALTER TABLE public.employees ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Add indexes for employee lookups
CREATE INDEX IF NOT EXISTS idx_employees_org_id ON public.employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON public.employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_active ON public.employees(is_active) WHERE is_active = true;

-- =====================================================
-- PART 3: NEOBANK ACCOUNT ENHANCEMENTS
-- =====================================================

-- Ensure neobank_accounts can be created easily
ALTER TABLE public.neobank_accounts 
  ALTER COLUMN account_number SET DEFAULT ('ACC-' || substr(md5(random()::text), 1, 10)),
  ALTER COLUMN routing_number SET DEFAULT '123456789',
  ALTER COLUMN balance SET DEFAULT 0,
  ALTER COLUMN currency SET DEFAULT 'USD',
  ALTER COLUMN status SET DEFAULT 'active';

-- Add indexes for neobank account lookups
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_user_id ON public.neobank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_org_id ON public.neobank_accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_status ON public.neobank_accounts(status);
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_type ON public.neobank_accounts(account_type);

-- =====================================================
-- PART 4: INVOICE AND BILLING ENHANCEMENTS
-- =====================================================

-- Add auto-increment invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1000;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'invoices' 
                 AND column_name = 'invoice_number') THEN
    ALTER TABLE public.invoices 
      ADD COLUMN invoice_number VARCHAR(50) DEFAULT ('INV-' || nextval('invoice_number_seq'));
  END IF;
END $$;

-- Ensure invoice relationships
ALTER TABLE public.invoices 
  DROP CONSTRAINT IF EXISTS invoices_customer_id_fkey,
  ADD CONSTRAINT invoices_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;

ALTER TABLE public.invoice_items 
  DROP CONSTRAINT IF EXISTS invoice_items_invoice_id_fkey,
  ADD CONSTRAINT invoice_items_invoice_id_fkey 
    FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

-- Add indexes for invoice queries
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_user_org ON public.invoices(user_id, organization_id);

-- Auto-increment bill numbers
CREATE SEQUENCE IF NOT EXISTS bill_number_seq START 1000;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'bills' 
                 AND column_name = 'bill_number') THEN
    ALTER TABLE public.bills 
      ADD COLUMN bill_number VARCHAR(50) DEFAULT ('BILL-' || nextval('bill_number_seq'));
  END IF;
END $$;

-- Ensure bill relationships
ALTER TABLE public.bills 
  DROP CONSTRAINT IF EXISTS bills_vendor_id_fkey,
  ADD CONSTRAINT bills_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE RESTRICT;

ALTER TABLE public.bill_items 
  DROP CONSTRAINT IF EXISTS bill_items_bill_id_fkey,
  ADD CONSTRAINT bill_items_bill_id_fkey 
    FOREIGN KEY (bill_id) REFERENCES public.bills(id) ON DELETE CASCADE;

-- Add indexes for bill queries
CREATE INDEX IF NOT EXISTS idx_bills_vendor_id ON public.bills(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON public.bills(due_date);
CREATE INDEX IF NOT EXISTS idx_bills_user_org ON public.bills(user_id, organization_id);

-- =====================================================
-- PART 5: EXPENSE TRACKING ENHANCEMENTS
-- =====================================================

-- Ensure expense relationships
ALTER TABLE public.expenses 
  DROP CONSTRAINT IF EXISTS expenses_vendor_id_fkey,
  ADD CONSTRAINT expenses_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL;

ALTER TABLE public.expenses 
  DROP CONSTRAINT IF EXISTS expenses_account_id_fkey,
  ADD CONSTRAINT expenses_account_id_fkey 
    FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE SET NULL;

ALTER TABLE public.expenses 
  DROP CONSTRAINT IF EXISTS expenses_category_id_fkey,
  ADD CONSTRAINT expenses_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES public.expense_categories(id) ON DELETE SET NULL;

-- Add indexes for expense queries
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_vendor_id ON public.expenses(vendor_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON public.expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);

-- =====================================================
-- PART 6: INVESTMENT HOLDINGS ENHANCEMENTS
-- =====================================================

-- Ensure investment holdings relationships
ALTER TABLE public.investment_holdings 
  DROP CONSTRAINT IF EXISTS investment_holdings_user_id_fkey,
  ADD CONSTRAINT investment_holdings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Add portfolio support if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'investment_holdings' 
                 AND column_name = 'portfolio_id') THEN
    ALTER TABLE public.investment_holdings ADD COLUMN portfolio_id UUID;
    
    ALTER TABLE public.investment_holdings 
      ADD CONSTRAINT investment_holdings_portfolio_id_fkey 
      FOREIGN KEY (portfolio_id) REFERENCES public.investment_portfolios(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for investment queries
CREATE INDEX IF NOT EXISTS idx_investment_holdings_user_id ON public.investment_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_symbol ON public.investment_holdings(symbol);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_asset_type ON public.investment_holdings(asset_type);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_active ON public.investment_holdings(is_active) WHERE is_active = true;

-- =====================================================
-- PART 7: TAX FILING ENHANCEMENTS
-- =====================================================

-- Ensure tax filing relationships
ALTER TABLE public.tax_filings 
  DROP CONSTRAINT IF EXISTS tax_filings_user_id_fkey,
  ADD CONSTRAINT tax_filings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.tax_filings 
  DROP CONSTRAINT IF EXISTS tax_filings_organization_id_fkey,
  ADD CONSTRAINT tax_filings_organization_id_fkey 
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add indexes for tax filing queries
CREATE INDEX IF NOT EXISTS idx_tax_filings_user_id ON public.tax_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_tax_year ON public.tax_filings(tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_filings_status ON public.tax_filings(filing_status);
CREATE INDEX IF NOT EXISTS idx_tax_filings_form_type ON public.tax_filings(form_type);

-- Ensure W-2 filing relationships
ALTER TABLE public.w2_filings 
  DROP CONSTRAINT IF EXISTS w2_filings_user_id_fkey,
  ADD CONSTRAINT w2_filings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Add indexes for W-2 queries
CREATE INDEX IF NOT EXISTS idx_w2_filings_user_id ON public.w2_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_w2_filings_tax_year ON public.w2_filings(tax_year);
CREATE INDEX IF NOT EXISTS idx_w2_filings_status ON public.w2_filings(irs_status);

-- Ensure 1099-NEC filing relationships
ALTER TABLE public.nec_1099_filings 
  DROP CONSTRAINT IF EXISTS nec_1099_filings_user_id_fkey,
  ADD CONSTRAINT nec_1099_filings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Add indexes for 1099-NEC queries
CREATE INDEX IF NOT EXISTS idx_1099_nec_user_id ON public.nec_1099_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_1099_nec_tax_year ON public.nec_1099_filings(tax_year);
CREATE INDEX IF NOT EXISTS idx_1099_nec_status ON public.nec_1099_filings(irs_status);

-- =====================================================
-- PART 8: RECIPIENTS AND CONTRACTOR PAYMENTS
-- =====================================================

-- Ensure recipients relationships
ALTER TABLE public.recipients 
  DROP CONSTRAINT IF EXISTS recipients_user_id_fkey,
  ADD CONSTRAINT recipients_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Add indexes for recipient queries
CREATE INDEX IF NOT EXISTS idx_recipients_user_id ON public.recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_recipients_email ON public.recipients(email);
CREATE INDEX IF NOT EXISTS idx_recipients_active ON public.recipients(is_active) WHERE is_active = true;

-- Ensure recipient payments relationships
ALTER TABLE public.recipient_payments 
  DROP CONSTRAINT IF EXISTS recipient_payments_user_id_fkey,
  ADD CONSTRAINT recipient_payments_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.recipient_payments 
  DROP CONSTRAINT IF EXISTS recipient_payments_recipient_id_fkey,
  ADD CONSTRAINT recipient_payments_recipient_id_fkey 
    FOREIGN KEY (recipient_id) REFERENCES public.recipients(id) ON DELETE CASCADE;

-- Add indexes for payment queries
CREATE INDEX IF NOT EXISTS idx_recipient_payments_user_id ON public.recipient_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_recipient_payments_recipient_id ON public.recipient_payments(recipient_id);
CREATE INDEX IF NOT EXISTS idx_recipient_payments_date ON public.recipient_payments(payment_date);

-- =====================================================
-- PART 9: CROSS-MODULE RELATIONSHIPS
-- =====================================================

-- Link neobank transactions to tax categories
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'neobank_transactions' 
                 AND column_name = 'tax_category_id') THEN
    ALTER TABLE public.neobank_transactions ADD COLUMN tax_category_id UUID;
    
    ALTER TABLE public.neobank_transactions 
      ADD CONSTRAINT neobank_transactions_tax_category_fkey 
      FOREIGN KEY (tax_category_id) REFERENCES public.tax_categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Link investment transactions to tax filings
ALTER TABLE public.investment_transactions 
  DROP CONSTRAINT IF EXISTS investment_transactions_tax_filing_id_fkey,
  ADD CONSTRAINT investment_transactions_tax_filing_id_fkey 
    FOREIGN KEY (tax_filing_id) REFERENCES public.tax_filings(id) ON DELETE SET NULL;

-- Ensure tax filing neobank deposits relationships
ALTER TABLE public.tax_filing_neobank_deposits 
  DROP CONSTRAINT IF EXISTS tax_filing_deposits_filing_id_fkey,
  ADD CONSTRAINT tax_filing_deposits_filing_id_fkey 
    FOREIGN KEY (tax_filing_id) REFERENCES public.tax_filings(id) ON DELETE CASCADE;

ALTER TABLE public.tax_filing_neobank_deposits 
  DROP CONSTRAINT IF EXISTS tax_filing_deposits_account_id_fkey,
  ADD CONSTRAINT tax_filing_deposits_account_id_fkey 
    FOREIGN KEY (neobank_account_id) REFERENCES public.neobank_accounts(id) ON DELETE CASCADE;

-- =====================================================
-- PART 10: BULK INSERT SUPPORT FUNCTIONS
-- =====================================================

-- Function to bulk insert customers
CREATE OR REPLACE FUNCTION bulk_insert_customers(
  customers_data JSONB,
  target_user_id UUID,
  target_org_id UUID
) RETURNS TABLE(id UUID, company_name TEXT, created_at TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.customers (
    user_id,
    organization_id,
    company_name,
    contact_name,
    email,
    phone,
    address_line1,
    city,
    state,
    zip_code,
    is_active,
    created_at
  )
  SELECT 
    target_user_id,
    target_org_id,
    (c->>'company_name')::TEXT,
    (c->>'contact_name')::TEXT,
    (c->>'email')::TEXT,
    (c->>'phone')::TEXT,
    (c->>'address')::TEXT,
    (c->>'city')::TEXT,
    (c->>'state')::TEXT,
    (c->>'zip_code')::TEXT,
    COALESCE((c->>'is_active')::BOOLEAN, true),
    NOW()
  FROM jsonb_array_elements(customers_data) AS c
  RETURNING customers.id, customers.company_name, customers.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to bulk insert vendors
CREATE OR REPLACE FUNCTION bulk_insert_vendors(
  vendors_data JSONB,
  target_user_id UUID,
  target_org_id UUID
) RETURNS TABLE(id UUID, company_name TEXT, created_at TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.vendors (
    user_id,
    organization_id,
    company_name,
    contact_name,
    email,
    phone,
    address_line1,
    city,
    state,
    zip_code,
    is_active,
    created_at
  )
  SELECT 
    target_user_id,
    target_org_id,
    (v->>'company_name')::TEXT,
    (v->>'contact_name')::TEXT,
    (v->>'email')::TEXT,
    (v->>'phone')::TEXT,
    (v->>'address')::TEXT,
    (v->>'city')::TEXT,
    (v->>'state')::TEXT,
    (v->>'zip_code')::TEXT,
    COALESCE((v->>'is_active')::BOOLEAN, true),
    NOW()
  FROM jsonb_array_elements(vendors_data) AS v
  RETURNING vendors.id, vendors.company_name, vendors.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to bulk insert employees
CREATE OR REPLACE FUNCTION bulk_insert_employees(
  employees_data JSONB,
  target_org_id UUID
) RETURNS TABLE(id UUID, first_name TEXT, last_name TEXT, created_at TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.employees (
    organization_id,
    first_name,
    last_name,
    email,
    phone,
    position,
    address,
    city,
    state,
    zip_code,
    hire_date,
    salary,
    employment_type,
    is_active,
    created_at
  )
  SELECT 
    target_org_id,
    (e->>'first_name')::TEXT,
    (e->>'last_name')::TEXT,
    (e->>'email')::TEXT,
    (e->>'phone')::TEXT,
    (e->>'position')::TEXT,
    (e->>'address')::TEXT,
    (e->>'city')::TEXT,
    (e->>'state')::TEXT,
    (e->>'zip_code')::TEXT,
    COALESCE((e->>'hire_date')::DATE, CURRENT_DATE),
    (e->>'salary')::NUMERIC,
    COALESCE((e->>'employment_type')::TEXT, 'full-time'),
    COALESCE((e->>'is_active')::BOOLEAN, true),
    NOW()
  FROM jsonb_array_elements(employees_data) AS e
  RETURNING employees.id, employees.first_name, employees.last_name, employees.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to bulk insert investment holdings
CREATE OR REPLACE FUNCTION bulk_insert_investment_holdings(
  holdings_data JSONB,
  target_user_id UUID,
  target_portfolio_id UUID DEFAULT NULL
) RETURNS TABLE(id UUID, symbol TEXT, shares NUMERIC, created_at TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.investment_holdings (
    user_id,
    portfolio_id,
    symbol,
    name,
    asset_type,
    shares,
    average_cost_basis,
    current_price,
    market_value,
    purchase_date,
    is_active,
    created_at
  )
  SELECT 
    target_user_id,
    target_portfolio_id,
    (h->>'symbol')::TEXT,
    (h->>'name')::TEXT,
    COALESCE((h->>'asset_type')::TEXT, 'stock'),
    (h->>'shares')::NUMERIC,
    (h->>'cost_basis')::NUMERIC,
    (h->>'current_price')::NUMERIC,
    (h->>'shares')::NUMERIC * (h->>'current_price')::NUMERIC,
    COALESCE((h->>'purchase_date')::DATE, CURRENT_DATE),
    COALESCE((h->>'is_active')::BOOLEAN, true),
    NOW()
  FROM jsonb_array_elements(holdings_data) AS h
  RETURNING investment_holdings.id, investment_holdings.symbol, investment_holdings.shares, investment_holdings.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PART 11: VALIDATION AND CONSTRAINT IMPROVEMENTS
-- =====================================================

-- Add check constraints for data integrity
ALTER TABLE public.invoices 
  DROP CONSTRAINT IF EXISTS invoices_amounts_positive,
  ADD CONSTRAINT invoices_amounts_positive 
    CHECK (total_amount >= 0 AND subtotal >= 0);

ALTER TABLE public.bills 
  DROP CONSTRAINT IF EXISTS bills_amounts_positive,
  ADD CONSTRAINT bills_amounts_positive 
    CHECK (total_amount >= 0 AND subtotal >= 0);

ALTER TABLE public.expenses 
  DROP CONSTRAINT IF EXISTS expenses_amount_positive,
  ADD CONSTRAINT expenses_amount_positive 
    CHECK (amount >= 0);

ALTER TABLE public.neobank_accounts 
  DROP CONSTRAINT IF EXISTS neobank_accounts_balance_check,
  ADD CONSTRAINT neobank_accounts_balance_check 
    CHECK (balance >= -10000); -- Allow reasonable overdraft

-- =====================================================
-- PART 12: RLS POLICY IMPROVEMENTS FOR INSERT OPERATIONS
-- =====================================================

-- Drop and recreate policies to ensure INSERT works properly
DO $$
DECLARE
  table_rec RECORD;
BEGIN
  -- For major tables, ensure users can insert their own data
  FOR table_rec IN 
    SELECT unnest(ARRAY[
      'customers', 'vendors', 'invoices', 'bills', 'expenses',
      'neobank_accounts', 'investment_holdings', 'recipients',
      'tax_filings', 'w2_filings', 'nec_1099_filings'
    ]) AS table_name
  LOOP
    -- Ensure insert policy exists
    EXECUTE format('
      DROP POLICY IF EXISTS %I_insert_own ON public.%I;
      CREATE POLICY %I_insert_own ON public.%I
        FOR INSERT
        WITH CHECK (user_id = auth.uid());
    ', table_rec.table_name, table_rec.table_name, table_rec.table_name, table_rec.table_name);
  END LOOP;
END $$;

-- Grant necessary permissions for bulk functions
GRANT EXECUTE ON FUNCTION bulk_insert_customers TO authenticated;
GRANT EXECUTE ON FUNCTION bulk_insert_vendors TO authenticated;
GRANT EXECUTE ON FUNCTION bulk_insert_employees TO authenticated;
GRANT EXECUTE ON FUNCTION bulk_insert_investment_holdings TO authenticated;

-- =====================================================
-- VERIFICATION AND SUMMARY
-- =====================================================

-- Create a view to check table relationships
CREATE OR REPLACE VIEW table_relationships_summary AS
SELECT 
  tc.table_schema,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Schema enhancement completed successfully!';
  RAISE NOTICE 'All tables now support:';
  RAISE NOTICE '  ✓ Single entry inserts';
  RAISE NOTICE '  ✓ Bulk entry uploads via functions';
  RAISE NOTICE '  ✓ Proper foreign key relationships';
  RAISE NOTICE '  ✓ Optimized indexes for queries';
  RAISE NOTICE '  ✓ RLS policies for security';
  RAISE NOTICE '';
  RAISE NOTICE 'Available bulk insert functions:';
  RAISE NOTICE '  - bulk_insert_customers(json, user_id, org_id)';
  RAISE NOTICE '  - bulk_insert_vendors(json, user_id, org_id)';
  RAISE NOTICE '  - bulk_insert_employees(json, org_id)';
  RAISE NOTICE '  - bulk_insert_investment_holdings(json, user_id, portfolio_id)';
END $$;
