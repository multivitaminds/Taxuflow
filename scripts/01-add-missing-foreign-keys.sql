-- Add missing foreign key relationships for better data integrity
-- Version: 1
-- Date: 2025-01-15

-- Add foreign keys for form_941_filings
ALTER TABLE public.form_941_filings
  ADD CONSTRAINT fk_form_941_filings_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_form_941_filings_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_form_941_filings_amended
    FOREIGN KEY (amendment_of) REFERENCES public.form_941_filings(id) ON DELETE SET NULL;

-- Add foreign keys for w2_filings
ALTER TABLE public.w2_filings
  ADD CONSTRAINT fk_w2_filings_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_w2_filings_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add foreign keys for nec_1099_filings
ALTER TABLE public.nec_1099_filings
  ADD CONSTRAINT fk_nec_1099_filings_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_nec_1099_filings_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add foreign keys for recipients
ALTER TABLE public.recipients
  ADD CONSTRAINT fk_recipients_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign keys for contractor_payments
ALTER TABLE public.contractor_payments
  ADD CONSTRAINT fk_contractor_payments_recipient
    FOREIGN KEY (recipient_id) REFERENCES public.recipients(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_contractor_payments_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign keys for investment tables
ALTER TABLE public.investment_holdings
  ADD CONSTRAINT fk_investment_holdings_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_investment_holdings_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;

ALTER TABLE public.investment_portfolios
  ADD CONSTRAINT fk_investment_portfolios_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.investment_transactions
  ADD CONSTRAINT fk_investment_transactions_holding
    FOREIGN KEY (holding_id) REFERENCES public.investment_holdings(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_investment_transactions_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign keys for neobank tables
ALTER TABLE public.neobank_accounts
  ADD CONSTRAINT fk_neobank_accounts_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_neobank_accounts_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;

ALTER TABLE public.neobank_cards
  ADD CONSTRAINT fk_neobank_cards_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_neobank_cards_account
    FOREIGN KEY (account_id) REFERENCES public.neobank_accounts(id) ON DELETE CASCADE;

ALTER TABLE public.neobank_transactions
  ADD CONSTRAINT fk_neobank_transactions_account
    FOREIGN KEY (account_id) REFERENCES public.neobank_accounts(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_neobank_transactions_card
    FOREIGN KEY (card_id) REFERENCES public.neobank_cards(id) ON DELETE SET NULL;

-- Add foreign keys for accounting tables
ALTER TABLE public.invoices
  ADD CONSTRAINT fk_invoices_customer
    FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_invoices_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_invoices_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.bills
  ADD CONSTRAINT fk_bills_vendor
    FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_bills_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_bills_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.expenses
  ADD CONSTRAINT fk_expenses_vendor
    FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_expenses_category
    FOREIGN KEY (category_id) REFERENCES public.expense_categories(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_expenses_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_form_941_filings_user_id ON public.form_941_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_form_941_filings_tax_year_quarter ON public.form_941_filings(tax_year, quarter);
CREATE INDEX IF NOT EXISTS idx_w2_filings_user_id ON public.w2_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_w2_filings_tax_year ON public.w2_filings(tax_year);
CREATE INDEX IF NOT EXISTS idx_nec_1099_filings_user_id ON public.nec_1099_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_recipients_user_id ON public.recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_user_id ON public.investment_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_user_id ON public.neobank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_bills_vendor_id ON public.bills(vendor_id);

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contractor_payments_recipient_year 
  ON public.contractor_payments(recipient_id, tax_year);
  
CREATE INDEX IF NOT EXISTS idx_neobank_transactions_account_date 
  ON public.neobank_transactions(account_id, transaction_date DESC);

CREATE INDEX IF NOT EXISTS idx_investment_transactions_holding_date 
  ON public.investment_transactions(holding_id, transaction_date DESC);
