-- Enhanced accounting tables for Taxu proprietary accounting layer

-- Invoices table (already exists, but ensuring proper structure)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  amount_due DECIMAL(12, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoice line items
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expenses/Journal Entries (enhanced)
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  category TEXT NOT NULL,
  payment_method TEXT,
  receipt_url TEXT,
  is_tax_deductible BOOLEAN DEFAULT false,
  tax_category TEXT,
  vendor TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contacts/Customers (enhanced)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'customer' CHECK (type IN ('customer', 'vendor', 'both')),
  company_name TEXT,
  contact_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  tax_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expense categories for AI categorization
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_tax_deductible BOOLEAN DEFAULT false,
  tax_form_line TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bank accounts (for future bank sync)
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'credit_card')),
  last_four TEXT,
  balance DECIMAL(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own invoices" ON invoices
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own invoice items" ON invoice_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own journal entries" ON journal_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own contacts" ON contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own expense categories" ON expense_categories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bank accounts" ON bank_accounts
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);

-- Insert default expense categories
INSERT INTO expense_categories (user_id, name, description, is_tax_deductible, tax_form_line)
SELECT 
  auth.uid(),
  category.name,
  category.description,
  category.is_tax_deductible,
  category.tax_form_line
FROM (VALUES
  ('Office Supplies', 'Pens, paper, printer ink, etc.', true, 'Schedule C Line 18'),
  ('Software & Subscriptions', 'Business software, SaaS tools', true, 'Schedule C Line 18'),
  ('Marketing & Advertising', 'Ads, promotions, marketing materials', true, 'Schedule C Line 8'),
  ('Travel', 'Business travel expenses', true, 'Schedule C Line 24a'),
  ('Meals & Entertainment', 'Business meals (50% deductible)', true, 'Schedule C Line 24b'),
  ('Professional Services', 'Legal, accounting, consulting fees', true, 'Schedule C Line 17'),
  ('Rent & Utilities', 'Office rent, electricity, internet', true, 'Schedule C Line 20b'),
  ('Insurance', 'Business insurance premiums', true, 'Schedule C Line 15'),
  ('Equipment', 'Computers, furniture, tools', true, 'Schedule C Line 13'),
  ('Vehicle Expenses', 'Mileage, gas, maintenance', true, 'Schedule C Line 9'),
  ('Phone & Internet', 'Business phone and internet', true, 'Schedule C Line 25'),
  ('Education & Training', 'Courses, books, conferences', true, 'Schedule C Line 27a'),
  ('Bank Fees', 'Transaction fees, service charges', true, 'Schedule C Line 10'),
  ('Contractor Payments', 'Payments to contractors/freelancers', true, 'Schedule C Line 11'),
  ('Personal', 'Non-business expenses', false, NULL)
) AS category(name, description, is_tax_deductible, tax_form_line)
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE user_id = auth.uid()
);
