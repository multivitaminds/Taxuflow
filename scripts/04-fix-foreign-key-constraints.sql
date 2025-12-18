-- Fix foreign key constraints that may have been missed
-- Version: 1
-- Date: 2025-01-15

-- Drop any existing constraints that might conflict (ignore errors if they don't exist)
DO $$ 
BEGIN
    -- Form 941 foreign keys
    ALTER TABLE public.form_941_filings DROP CONSTRAINT IF EXISTS fk_form_941_user;
    ALTER TABLE public.form_941_filings DROP CONSTRAINT IF EXISTS fk_form_941_organization;
    ALTER TABLE public.form_941_filings DROP CONSTRAINT IF EXISTS fk_form_941_amended;
    
    -- W2 filings foreign keys
    ALTER TABLE public.w2_filings DROP CONSTRAINT IF EXISTS fk_w2_user;
    ALTER TABLE public.w2_filings DROP CONSTRAINT IF EXISTS fk_w2_organization;
    
    -- 1099-NEC filings foreign keys
    ALTER TABLE public.nec_1099_filings DROP CONSTRAINT IF EXISTS fk_nec_1099_user;
    ALTER TABLE public.nec_1099_filings DROP CONSTRAINT IF EXISTS fk_nec_1099_organization;
    
    -- Recipients foreign keys
    ALTER TABLE public.recipients DROP CONSTRAINT IF EXISTS fk_recipients_user;
    
    -- Contractor payments foreign keys
    ALTER TABLE public.contractor_payments DROP CONSTRAINT IF EXISTS fk_contractor_payments_recipient;
    ALTER TABLE public.contractor_payments DROP CONSTRAINT IF EXISTS fk_contractor_payments_user;
    ALTER TABLE public.contractor_payments DROP CONSTRAINT IF EXISTS fk_contractor_payments_filing;
    
    -- Investment foreign keys
    ALTER TABLE public.investment_holdings DROP CONSTRAINT IF EXISTS fk_investment_holdings_user;
    ALTER TABLE public.investment_holdings DROP CONSTRAINT IF EXISTS fk_investment_holdings_organization;
    
    ALTER TABLE public.investment_portfolios DROP CONSTRAINT IF EXISTS fk_investment_portfolios_user;
    
    ALTER TABLE public.investment_transactions DROP CONSTRAINT IF EXISTS fk_investment_transactions_holding;
    ALTER TABLE public.investment_transactions DROP CONSTRAINT IF EXISTS fk_investment_transactions_user;
    
    -- Neobank foreign keys
    ALTER TABLE public.neobank_accounts DROP CONSTRAINT IF EXISTS fk_neobank_accounts_user;
    ALTER TABLE public.neobank_accounts DROP CONSTRAINT IF EXISTS fk_neobank_accounts_organization;
    
    ALTER TABLE public.neobank_cards DROP CONSTRAINT IF EXISTS fk_neobank_cards_user;
    ALTER TABLE public.neobank_cards DROP CONSTRAINT IF EXISTS fk_neobank_cards_account;
    
    ALTER TABLE public.neobank_transactions DROP CONSTRAINT IF EXISTS fk_neobank_transactions_account;
    ALTER TABLE public.neobank_transactions DROP CONSTRAINT IF EXISTS fk_neobank_transactions_card;
    
    -- Accounting foreign keys
    ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS fk_invoices_customer;
    ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS fk_invoices_user;
    ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS fk_invoices_organization;
    
    ALTER TABLE public.bills DROP CONSTRAINT IF EXISTS fk_bills_vendor;
    ALTER TABLE public.bills DROP CONSTRAINT IF EXISTS fk_bills_user;
    ALTER TABLE public.bills DROP CONSTRAINT IF EXISTS fk_bills_organization;
    
    ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS fk_expenses_vendor;
    ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS fk_expenses_category;
    ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS fk_expenses_user;
    ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS fk_expenses_account;
    
    -- Document foreign keys
    ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS fk_documents_user;
    ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS fk_documents_organization;
    
    -- W9 forms foreign keys
    ALTER TABLE public.w9_forms DROP CONSTRAINT IF EXISTS fk_w9_forms_user;
    ALTER TABLE public.w9_forms DROP CONSTRAINT IF EXISTS fk_w9_forms_recipient;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Now add the correct foreign key constraints

-- Form 941 filings
ALTER TABLE public.form_941_filings
  ADD CONSTRAINT fk_form_941_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.form_941_filings
  ADD CONSTRAINT fk_form_941_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.form_941_filings
  ADD CONSTRAINT fk_form_941_amended
    FOREIGN KEY (amendment_of) REFERENCES public.form_941_filings(id) ON DELETE SET NULL;

-- W2 filings
ALTER TABLE public.w2_filings
  ADD CONSTRAINT fk_w2_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.w2_filings
  ADD CONSTRAINT fk_w2_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 1099-NEC filings
ALTER TABLE public.nec_1099_filings
  ADD CONSTRAINT fk_nec_1099_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.nec_1099_filings
  ADD CONSTRAINT fk_nec_1099_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Recipients
ALTER TABLE public.recipients
  ADD CONSTRAINT fk_recipients_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Contractor payments
ALTER TABLE public.contractor_payments
  ADD CONSTRAINT fk_contractor_payments_recipient
    FOREIGN KEY (recipient_id) REFERENCES public.recipients(id) ON DELETE CASCADE;

ALTER TABLE public.contractor_payments
  ADD CONSTRAINT fk_contractor_payments_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.contractor_payments
  ADD CONSTRAINT fk_contractor_payments_filing
    FOREIGN KEY (filing_id) REFERENCES public.nec_1099_filings(id) ON DELETE SET NULL;

-- Investment tables
ALTER TABLE public.investment_holdings
  ADD CONSTRAINT fk_investment_holdings_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.investment_holdings
  ADD CONSTRAINT fk_investment_holdings_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;

ALTER TABLE public.investment_portfolios
  ADD CONSTRAINT fk_investment_portfolios_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.investment_transactions
  ADD CONSTRAINT fk_investment_transactions_holding
    FOREIGN KEY (holding_id) REFERENCES public.investment_holdings(id) ON DELETE CASCADE;

ALTER TABLE public.investment_transactions
  ADD CONSTRAINT fk_investment_transactions_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Neobank tables
ALTER TABLE public.neobank_accounts
  ADD CONSTRAINT fk_neobank_accounts_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.neobank_accounts
  ADD CONSTRAINT fk_neobank_accounts_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;

ALTER TABLE public.neobank_cards
  ADD CONSTRAINT fk_neobank_cards_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.neobank_cards
  ADD CONSTRAINT fk_neobank_cards_account
    FOREIGN KEY (account_id) REFERENCES public.neobank_accounts(id) ON DELETE CASCADE;

ALTER TABLE public.neobank_transactions
  ADD CONSTRAINT fk_neobank_transactions_account
    FOREIGN KEY (account_id) REFERENCES public.neobank_accounts(id) ON DELETE CASCADE;

ALTER TABLE public.neobank_transactions
  ADD CONSTRAINT fk_neobank_transactions_card
    FOREIGN KEY (card_id) REFERENCES public.neobank_cards(id) ON DELETE SET NULL;

-- Accounting tables
ALTER TABLE public.invoices
  ADD CONSTRAINT fk_invoices_customer
    FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;

ALTER TABLE public.invoices
  ADD CONSTRAINT fk_invoices_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.invoices
  ADD CONSTRAINT fk_invoices_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.bills
  ADD CONSTRAINT fk_bills_vendor
    FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL;

ALTER TABLE public.bills
  ADD CONSTRAINT fk_bills_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.bills
  ADD CONSTRAINT fk_bills_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.expenses
  ADD CONSTRAINT fk_expenses_vendor
    FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL;

ALTER TABLE public.expenses
  ADD CONSTRAINT fk_expenses_category
    FOREIGN KEY (category_id) REFERENCES public.expense_categories(id) ON DELETE SET NULL;

ALTER TABLE public.expenses
  ADD CONSTRAINT fk_expenses_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.expenses
  ADD CONSTRAINT fk_expenses_account
    FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE SET NULL;

-- Documents
ALTER TABLE public.documents
  ADD CONSTRAINT fk_documents_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.documents
  ADD CONSTRAINT fk_documents_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;

-- W9 forms
ALTER TABLE public.w9_forms
  ADD CONSTRAINT fk_w9_forms_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.w9_forms
  ADD CONSTRAINT fk_w9_forms_recipient
    FOREIGN KEY (recipient_id) REFERENCES public.recipients(id) ON DELETE CASCADE;
