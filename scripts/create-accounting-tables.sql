-- Create accounting tables for QuickBooks-style features

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'United States',
  tax_id VARCHAR(50),
  payment_terms INTEGER DEFAULT 30,
  credit_limit NUMERIC(12, 2),
  balance NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'United States',
  tax_id VARCHAR(50),
  payment_terms INTEGER DEFAULT 30,
  account_number VARCHAR(100),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  account_number VARCHAR(50),
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) NOT NULL, -- Asset, Liability, Equity, Revenue, Expense
  account_subtype VARCHAR(100), -- Cash, Accounts Receivable, Fixed Assets, etc.
  parent_account_id UUID REFERENCES accounts(id),
  description TEXT,
  current_balance NUMERIC(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, viewed, partial, paid, overdue, cancelled
  subtotal NUMERIC(12, 2) DEFAULT 0,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) DEFAULT 0,
  amount_paid NUMERIC(12, 2) DEFAULT 0,
  amount_due NUMERIC(12, 2) DEFAULT 0,
  payment_terms INTEGER DEFAULT 30,
  notes TEXT,
  terms_conditions TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice items/line items
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  account_id UUID REFERENCES accounts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense categories
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_category_id UUID REFERENCES expense_categories(id),
  is_tax_deductible BOOLEAN DEFAULT true,
  account_id UUID REFERENCES accounts(id),
  color VARCHAR(7), -- Hex color code
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id),
  expense_date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  payment_method VARCHAR(50), -- cash, credit_card, debit_card, check, bank_transfer
  reference_number VARCHAR(100),
  receipt_url TEXT,
  is_billable BOOLEAN DEFAULT false,
  is_tax_deductible BOOLEAN DEFAULT true,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, reimbursed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank accounts
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id),
  bank_name VARCHAR(255) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_number_last4 VARCHAR(4),
  account_type VARCHAR(50), -- checking, savings, credit_card
  routing_number VARCHAR(50),
  current_balance NUMERIC(12, 2) DEFAULT 0,
  is_connected BOOLEAN DEFAULT false,
  connection_id VARCHAR(255), -- For Plaid or similar
  last_synced_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank transactions
CREATE TABLE IF NOT EXISTS bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  posted_date DATE,
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  transaction_type VARCHAR(50), -- debit, credit
  category_id UUID REFERENCES expense_categories(id),
  vendor_id UUID REFERENCES vendors(id),
  customer_id UUID REFERENCES customers(id),
  is_reconciled BOOLEAN DEFAULT false,
  is_categorized BOOLEAN DEFAULT false,
  notes TEXT,
  external_id VARCHAR(255), -- From bank/Plaid
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  payment_date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_method VARCHAR(50), -- cash, check, credit_card, ach, wire_transfer
  reference_number VARCHAR(100),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'completed', -- pending, completed, failed, refunded
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recurring transactions
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- invoice, expense, bill
  customer_id UUID REFERENCES customers(id),
  vendor_id UUID REFERENCES vendors(id),
  frequency VARCHAR(50) NOT NULL, -- daily, weekly, monthly, quarterly, annually
  start_date DATE NOT NULL,
  end_date DATE,
  next_date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  template_data JSONB, -- Store invoice/expense template
  is_active BOOLEAN DEFAULT true,
  last_generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Estimates/Quotes
CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  estimate_number VARCHAR(50) UNIQUE NOT NULL,
  estimate_date DATE NOT NULL,
  expiry_date DATE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, viewed, accepted, declined, expired
  subtotal NUMERIC(12, 2) DEFAULT 0,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  terms_conditions TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  converted_to_invoice_id UUID REFERENCES invoices(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Estimate items
CREATE TABLE IF NOT EXISTS estimate_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills (from vendors)
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  bill_number VARCHAR(50),
  bill_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partial, paid, overdue
  subtotal NUMERIC(12, 2) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) DEFAULT 0,
  amount_paid NUMERIC(12, 2) DEFAULT 0,
  amount_due NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bill items
CREATE TABLE IF NOT EXISTS bill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  account_id UUID REFERENCES accounts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_customers_user ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_user ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_account ON bank_transactions(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
