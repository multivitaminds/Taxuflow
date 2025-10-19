-- Advanced Accounting Features for QuickBooks Parity
-- Purchase Orders, Sales Tax, Credit Memos, Recurring Transactions

-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  po_number TEXT UNIQUE NOT NULL,
  po_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_date DATE,
  status TEXT CHECK (status IN ('draft', 'sent', 'partially_received', 'received', 'cancelled')) DEFAULT 'draft',
  subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Order Line Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  quantity_received DECIMAL(10,2) DEFAULT 0,
  unit_price DECIMAL(15,2) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Tax Rates Table
CREATE TABLE IF NOT EXISTS sales_tax_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rate DECIMAL(5,4) NOT NULL,
  jurisdiction TEXT,
  tax_type TEXT CHECK (tax_type IN ('state', 'county', 'city', 'district')) DEFAULT 'state',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Tax Liability Table
CREATE TABLE IF NOT EXISTS sales_tax_liability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_rate_id UUID REFERENCES sales_tax_rates(id) ON DELETE SET NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  taxable_sales DECIMAL(15,2) DEFAULT 0,
  tax_collected DECIMAL(15,2) DEFAULT 0,
  tax_paid DECIMAL(15,2) DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'filed', 'paid')) DEFAULT 'pending',
  filing_date DATE,
  payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Memos Table
CREATE TABLE IF NOT EXISTS credit_memos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  credit_memo_number TEXT UNIQUE NOT NULL,
  credit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT CHECK (status IN ('draft', 'issued', 'applied', 'refunded')) DEFAULT 'draft',
  subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  amount_applied DECIMAL(15,2) DEFAULT 0,
  remaining_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Memo Line Items
CREATE TABLE IF NOT EXISTS credit_memo_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  credit_memo_id UUID REFERENCES credit_memos(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recurring Transactions Table
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT CHECK (transaction_type IN ('invoice', 'bill', 'expense')) NOT NULL,
  template_name TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  next_date DATE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  amount DECIMAL(15,2) NOT NULL,
  status TEXT CHECK (status IN ('active', 'paused', 'completed')) DEFAULT 'active',
  template_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')) DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  actual_cost DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time Tracking Table
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  hours DECIMAL(5,2) NOT NULL,
  hourly_rate DECIMAL(10,2),
  description TEXT,
  billable BOOLEAN DEFAULT true,
  invoiced BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_purchase_orders_user_id ON purchase_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor_id ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_sales_tax_rates_user_id ON sales_tax_rates(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_memos_user_id ON credit_memos(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_memos_customer_id ON credit_memos(customer_id);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_user_id ON recurring_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_next_date ON recurring_transactions(next_date);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);

-- Enable RLS
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_tax_liability ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_memo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own purchase orders" ON purchase_orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own sales tax rates" ON sales_tax_rates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own sales tax liability" ON sales_tax_liability FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own credit memos" ON credit_memos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own recurring transactions" ON recurring_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own time entries" ON time_entries FOR ALL USING (auth.uid() = user_id);
