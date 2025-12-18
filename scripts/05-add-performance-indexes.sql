-- Add comprehensive performance indexes
-- Version: 1  
-- Date: 2025-01-15

-- User-related indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Tax filing indexes
CREATE INDEX IF NOT EXISTS idx_form_941_filings_user_id ON public.form_941_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_form_941_filings_tax_year_quarter ON public.form_941_filings(tax_year, quarter);
CREATE INDEX IF NOT EXISTS idx_form_941_filings_status ON public.form_941_filings(filing_status);
CREATE INDEX IF NOT EXISTS idx_form_941_filings_org_id ON public.form_941_filings(organization_id);

CREATE INDEX IF NOT EXISTS idx_w2_filings_user_id ON public.w2_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_w2_filings_tax_year ON public.w2_filings(tax_year);
CREATE INDEX IF NOT EXISTS idx_w2_filings_status ON public.w2_filings(taxbandits_status);

CREATE INDEX IF NOT EXISTS idx_nec_1099_filings_user_id ON public.nec_1099_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_nec_1099_filings_tax_year ON public.nec_1099_filings(tax_year);

CREATE INDEX IF NOT EXISTS idx_tax_filings_user_id ON public.tax_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_tax_year ON public.tax_filings(tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_filings_status ON public.tax_filings(filing_status);

-- Recipients and contractor payments
CREATE INDEX IF NOT EXISTS idx_recipients_user_id ON public.recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_recipients_email ON public.recipients(email);
CREATE INDEX IF NOT EXISTS idx_recipients_active ON public.recipients(is_active);

CREATE INDEX IF NOT EXISTS idx_contractor_payments_recipient_year 
  ON public.contractor_payments(recipient_id, tax_year);
CREATE INDEX IF NOT EXISTS idx_contractor_payments_user_id 
  ON public.contractor_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_contractor_payments_date 
  ON public.contractor_payments(payment_date DESC);

-- Investment indexes
CREATE INDEX IF NOT EXISTS idx_investment_holdings_user_id ON public.investment_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_symbol ON public.investment_holdings(symbol);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_active ON public.investment_holdings(is_active);

CREATE INDEX IF NOT EXISTS idx_investment_portfolios_user_id ON public.investment_portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_portfolios_active ON public.investment_portfolios(is_active);

CREATE INDEX IF NOT EXISTS idx_investment_transactions_holding_date 
  ON public.investment_transactions(holding_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_investment_transactions_user_id 
  ON public.investment_transactions(user_id);

-- Neobank indexes
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_user_id ON public.neobank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_status ON public.neobank_accounts(status);

CREATE INDEX IF NOT EXISTS idx_neobank_cards_user_id ON public.neobank_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_neobank_cards_account_id ON public.neobank_cards(account_id);
CREATE INDEX IF NOT EXISTS idx_neobank_cards_status ON public.neobank_cards(status);

CREATE INDEX IF NOT EXISTS idx_neobank_transactions_account_date 
  ON public.neobank_transactions(account_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_neobank_transactions_status 
  ON public.neobank_transactions(status);

-- Accounting indexes
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON public.invoices(invoice_date DESC);

CREATE INDEX IF NOT EXISTS idx_bills_vendor_id ON public.bills(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON public.bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_date ON public.bills(bill_date DESC);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON public.expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_vendor_id ON public.expenses(vendor_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(expense_date DESC);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_active ON public.customers(is_active);

CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON public.vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_email ON public.vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendors_active ON public.vendors(is_active);

-- Documents and W9 forms
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_tax_year ON public.documents(tax_year);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(processing_status);

CREATE INDEX IF NOT EXISTS idx_w9_forms_user_id ON public.w9_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_w9_forms_recipient_id ON public.w9_forms(recipient_id);
CREATE INDEX IF NOT EXISTS idx_w9_forms_status ON public.w9_forms(status);

-- API and audit indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON public.api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON public.api_keys(key_prefix);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- Organization indexes
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organization_memberships_user_id 
  ON public.organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_memberships_org_id 
  ON public.organization_memberships(organization_id);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
