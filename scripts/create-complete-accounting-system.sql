-- Module 1: Core Accounting Ledger
-- Chart of Accounts
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  account_number VARCHAR(20) UNIQUE NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) NOT NULL, -- Asset, Liability, Equity, Revenue, Expense
  account_subtype VARCHAR(100), -- Current Asset, Fixed Asset, etc.
  description TEXT,
  parent_account_id UUID REFERENCES chart_of_accounts(id),
  balance DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  entry_number VARCHAR(50) UNIQUE NOT NULL,
  entry_date DATE NOT NULL,
  description TEXT,
  reference VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft', -- draft, posted, void
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal Entry Lines (for double-entry)
CREATE TABLE IF NOT EXISTS journal_entry_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id UUID REFERENCES chart_of_accounts(id),
  description TEXT,
  debit DECIMAL(15, 2) DEFAULT 0,
  credit DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id),
  po_number VARCHAR(50) UNIQUE NOT NULL,
  po_date DATE NOT NULL,
  expected_date DATE,
  status VARCHAR(20) DEFAULT 'draft', -- draft, sent, received, cancelled
  subtotal DECIMAL(15, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Order Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Memos
CREATE TABLE IF NOT EXISTS credit_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  invoice_id UUID REFERENCES invoices(id),
  memo_number VARCHAR(50) UNIQUE NOT NULL,
  memo_date DATE NOT NULL,
  reason TEXT,
  subtotal DECIMAL(15, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Module 3: Payments and Invoicing
-- Estimates/Quotes
CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  estimate_number VARCHAR(50) UNIQUE NOT NULL,
  estimate_date DATE NOT NULL,
  expiry_date DATE,
  status VARCHAR(20) DEFAULT 'draft', -- draft, sent, accepted, declined, converted
  subtotal DECIMAL(15, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  converted_to_invoice_id UUID REFERENCES invoices(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Estimate Items
CREATE TABLE IF NOT EXISTS estimate_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  type VARCHAR(50) NOT NULL, -- credit_card, bank_account, paypal
  last_four VARCHAR(4),
  brand VARCHAR(50),
  is_default BOOLEAN DEFAULT false,
  stripe_payment_method_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Module 4: Business Operations
-- Products/Services
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  type VARCHAR(20) NOT NULL, -- product, service
  description TEXT,
  unit_price DECIMAL(15, 2) NOT NULL,
  cost DECIMAL(15, 2),
  income_account_id UUID REFERENCES chart_of_accounts(id),
  expense_account_id UUID REFERENCES chart_of_accounts(id),
  is_taxable BOOLEAN DEFAULT true,
  track_inventory BOOLEAN DEFAULT false,
  quantity_on_hand DECIMAL(10, 2) DEFAULT 0,
  reorder_point DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Adjustments
CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  adjustment_date DATE NOT NULL,
  quantity_change DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  reference VARCHAR(100),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects/Jobs
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  project_name VARCHAR(255) NOT NULL,
  project_number VARCHAR(50) UNIQUE,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, on_hold, cancelled
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15, 2),
  total_cost DECIMAL(15, 2) DEFAULT 0,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time Entries
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  customer_id UUID REFERENCES customers(id),
  user_id UUID REFERENCES users(id),
  entry_date DATE NOT NULL,
  hours DECIMAL(5, 2) NOT NULL,
  hourly_rate DECIMAL(15, 2),
  description TEXT,
  is_billable BOOLEAN DEFAULT true,
  is_invoiced BOOLEAN DEFAULT false,
  invoice_id UUID REFERENCES invoices(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll (Basic)
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  employee_number VARCHAR(50) UNIQUE,
  hire_date DATE,
  termination_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, terminated
  pay_type VARCHAR(20), -- hourly, salary
  pay_rate DECIMAL(15, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll Runs
CREATE TABLE IF NOT EXISTS payroll_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  pay_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft', -- draft, processed, paid
  total_gross DECIMAL(15, 2) DEFAULT 0,
  total_deductions DECIMAL(15, 2) DEFAULT 0,
  total_net DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Tax
CREATE TABLE IF NOT EXISTS tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  rate DECIMAL(5, 4) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recurring Transactions
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- invoice, expense, bill
  template_data JSONB NOT NULL,
  frequency VARCHAR(20) NOT NULL, -- daily, weekly, monthly, yearly
  start_date DATE NOT NULL,
  end_date DATE,
  next_run_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank Reconciliation
CREATE TABLE IF NOT EXISTS bank_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES bank_accounts(id),
  statement_date DATE NOT NULL,
  statement_balance DECIMAL(15, 2) NOT NULL,
  cleared_balance DECIMAL(15, 2) DEFAULT 0,
  difference DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed
  reconciled_by UUID REFERENCES users(id),
  reconciled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL, -- create, update, delete, view
  entity_type VARCHAR(50) NOT NULL, -- invoice, expense, customer, etc.
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_org ON chart_of_accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_org ON journal_entries(organization_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_org ON purchase_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_estimates_org ON estimates(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_org ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_org ON time_entries(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_org ON employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON audit_logs(organization_id);
