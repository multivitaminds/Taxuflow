-- Taxu Business OS - Books Schema Migration
-- QuickBooks Integration with multi-tenant RLS
-- This creates a complete accounting/bookkeeping system

-- Create books schema
CREATE SCHEMA IF NOT EXISTS books;

-- Organizations & membership (extending existing organizations table)
-- Note: We'll reference the existing organizations table from main schema
-- and create books-specific membership if needed

-- QBO connections for storing encrypted tokens
CREATE TABLE IF NOT EXISTS books.qbo_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  realm_id TEXT NOT NULL,
  access_token_enc TEXT NOT NULL,
  refresh_token_enc TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts (Chart of Accounts)
CREATE TABLE IF NOT EXISTS books.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  type TEXT NOT NULL, -- asset, liability, equity, income, expense, etc.
  subtype TEXT,
  currency TEXT DEFAULT 'USD',
  external_id TEXT,       -- QBO Id
  external_rev TEXT,      -- QBO SyncToken
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts (customers/vendors)
CREATE TABLE IF NOT EXISTS books.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('customer','vendor')) NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  tax_id TEXT,
  billing_address JSONB,
  shipping_address JSONB,
  external_id TEXT,
  external_rev TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items (for invoicing)
CREATE TABLE IF NOT EXISTS books.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  description TEXT,
  price NUMERIC(14,2),
  income_account_id UUID REFERENCES books.accounts(id),
  expense_account_id UUID REFERENCES books.accounts(id),
  external_id TEXT,
  external_rev TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS books.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  reference TEXT,
  memo TEXT,
  total_amount NUMERIC(14,2) DEFAULT 0,
  external_id TEXT,
  external_rev TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books.journal_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID NOT NULL REFERENCES books.journal_entries(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES books.accounts(id),
  contact_id UUID REFERENCES books.contacts(id),
  debit NUMERIC(14,2) DEFAULT 0,
  credit NUMERIC(14,2) DEFAULT 0,
  memo TEXT,
  external_id TEXT
);

-- Invoices (AR)
CREATE TABLE IF NOT EXISTS books.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES books.contacts(id), -- customer
  number TEXT,
  status TEXT CHECK (status IN ('draft','open','paid','void','overdue')) DEFAULT 'open',
  issue_date DATE NOT NULL,
  due_date DATE,
  currency TEXT DEFAULT 'USD',
  subtotal NUMERIC(14,2) DEFAULT 0,
  tax_amount NUMERIC(14,2) DEFAULT 0,
  total_amount NUMERIC(14,2) DEFAULT 0,
  balance NUMERIC(14,2) DEFAULT 0,
  memo TEXT,
  external_id TEXT,
  external_rev TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books.invoice_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES books.invoices(id) ON DELETE CASCADE,
  item_id UUID REFERENCES books.items(id),
  description TEXT NOT NULL,
  quantity NUMERIC(14,4) DEFAULT 1,
  unit_price NUMERIC(14,2) DEFAULT 0,
  line_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  account_id UUID REFERENCES books.accounts(id),
  external_id TEXT
);

-- Bills (AP)
CREATE TABLE IF NOT EXISTS books.bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES books.contacts(id), -- vendor
  number TEXT,
  status TEXT CHECK (status IN ('open','paid','void','overdue')) DEFAULT 'open',
  issue_date DATE NOT NULL,
  due_date DATE,
  currency TEXT DEFAULT 'USD',
  subtotal NUMERIC(14,2) DEFAULT 0,
  tax_amount NUMERIC(14,2) DEFAULT 0,
  total_amount NUMERIC(14,2) DEFAULT 0,
  balance NUMERIC(14,2) DEFAULT 0,
  memo TEXT,
  external_id TEXT,
  external_rev TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books.bill_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID NOT NULL REFERENCES books.bills(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(14,4) DEFAULT 1,
  unit_price NUMERIC(14,2) DEFAULT 0,
  line_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  account_id UUID REFERENCES books.accounts(id),
  external_id TEXT
);

-- Payments (in/out) and applications
CREATE TABLE IF NOT EXISTS books.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('in','out')) NOT NULL,
  method TEXT, -- ach, card, wire, cash, check, etc.
  amount NUMERIC(14,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_date DATE NOT NULL,
  reference TEXT,
  contact_id UUID REFERENCES books.contacts(id),
  memo TEXT,
  external_id TEXT,
  external_rev TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books.payment_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES books.payments(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES books.invoices(id),
  bill_id UUID REFERENCES books.bills(id),
  applied_amount NUMERIC(14,2) NOT NULL,
  external_id TEXT
);

-- Bank accounts & transactions (for feeds/reconciliation)
CREATE TABLE IF NOT EXISTS books.bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  account_number_mask TEXT,
  routing_number TEXT,
  account_type TEXT, -- checking, savings, credit, etc.
  currency TEXT DEFAULT 'USD',
  current_balance NUMERIC(14,2),
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books.bank_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_account_id UUID NOT NULL REFERENCES books.bank_accounts(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  counterparty TEXT,
  description TEXT,
  category TEXT,
  fitid TEXT UNIQUE, -- unique id from bank feed
  is_reconciled BOOLEAN DEFAULT FALSE,
  journal_entry_id UUID REFERENCES books.journal_entries(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync tracking
CREATE TABLE IF NOT EXISTS books.sync_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL, -- 'full', 'incremental', 'entity_specific'
  entity_type TEXT, -- 'invoices', 'payments', etc.
  status TEXT CHECK (status IN ('pending','running','completed','failed')) DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE books.qbo_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.bill_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.payment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.sync_jobs ENABLE ROW LEVEL SECURITY;

-- Utility function: check if user is member of organization
CREATE OR REPLACE FUNCTION books.is_org_member(_org_id UUID)
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM organization_memberships m
    WHERE m.organization_id = _org_id 
    AND m.user_id = auth.uid()
  );
$$;

-- Helper function for RLS policies
CREATE OR REPLACE FUNCTION books.allow_org(_org_id UUID) 
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE 
AS $$ 
  SELECT books.is_org_member(_org_id); 
$$;

-- Create RLS policies for organization-scoped access
CREATE POLICY "org_qbo_connections" ON books.qbo_connections
  FOR ALL USING (books.allow_org(org_id));

CREATE POLICY "org_accounts" ON books.accounts
  FOR ALL USING (books.allow_org(org_id));

CREATE POLICY "org_contacts" ON books.contacts
  FOR ALL USING (books.allow_org(org_id));

CREATE POLICY "org_items" ON books.items
  FOR ALL USING (books.allow_org(org_id));

CREATE POLICY "org_journal_entries" ON books.journal_entries
  FOR ALL USING (books.allow_org(org_id));

CREATE POLICY "org_invoices" ON books.invoices
  FOR ALL USING (books.allow_org(org_id));

CREATE POLICY "org_bills" ON books.bills
  FOR ALL USING (books.allow_org(org_id));

CREATE POLICY "org_payments" ON books.payments
  FOR ALL USING (books.allow_org(org_id));

CREATE POLICY "org_bank_accounts" ON books.bank_accounts
  FOR ALL USING (books.allow_org(org_id));

CREATE POLICY "org_sync_jobs" ON books.sync_jobs
  FOR ALL USING (books.allow_org(org_id));

-- Child table policies (inherit through parent relationships)
CREATE POLICY "org_journal_lines" ON books.journal_lines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.journal_entries je 
      WHERE je.id = journal_lines.entry_id 
      AND books.allow_org(je.org_id)
    )
  );

CREATE POLICY "org_invoice_lines" ON books.invoice_lines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.invoices i 
      WHERE i.id = invoice_lines.invoice_id 
      AND books.allow_org(i.org_id)
    )
  );

CREATE POLICY "org_bill_lines" ON books.bill_lines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.bills b 
      WHERE b.id = bill_lines.bill_id 
      AND books.allow_org(b.org_id)
    )
  );

CREATE POLICY "org_payment_applications" ON books.payment_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.payments p 
      WHERE p.id = payment_applications.payment_id 
      AND books.allow_org(p.org_id)
    )
  );

CREATE POLICY "org_bank_transactions" ON books.bank_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.bank_accounts ba 
      WHERE ba.id = bank_transactions.bank_account_id 
      AND books.allow_org(ba.org_id)
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_accounts_org_id ON books.accounts(org_id);
CREATE INDEX IF NOT EXISTS idx_books_accounts_type ON books.accounts(type);
CREATE INDEX IF NOT EXISTS idx_books_accounts_external_id ON books.accounts(external_id);

CREATE INDEX IF NOT EXISTS idx_books_contacts_org_id ON books.contacts(org_id);
CREATE INDEX IF NOT EXISTS idx_books_contacts_kind ON books.contacts(kind);
CREATE INDEX IF NOT EXISTS idx_books_contacts_external_id ON books.contacts(external_id);

CREATE INDEX IF NOT EXISTS idx_books_invoices_org_id ON books.invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_books_invoices_contact_id ON books.invoices(contact_id);
CREATE INDEX IF NOT EXISTS idx_books_invoices_status ON books.invoices(status);
CREATE INDEX IF NOT EXISTS idx_books_invoices_due_date ON books.invoices(due_date);

CREATE INDEX IF NOT EXISTS idx_books_bills_org_id ON books.bills(org_id);
CREATE INDEX IF NOT EXISTS idx_books_bills_contact_id ON books.bills(contact_id);
CREATE INDEX IF NOT EXISTS idx_books_bills_status ON books.bills(status);
CREATE INDEX IF NOT EXISTS idx_books_bills_due_date ON books.bills(due_date);

CREATE INDEX IF NOT EXISTS idx_books_payments_org_id ON books.payments(org_id);
CREATE INDEX IF NOT EXISTS idx_books_payments_direction ON books.payments(direction);
CREATE INDEX IF NOT EXISTS idx_books_payments_date ON books.payments(payment_date);

-- Add comments
COMMENT ON SCHEMA books IS 'Complete accounting/bookkeeping system with QuickBooks integration';
COMMENT ON TABLE books.qbo_connections IS 'Encrypted QuickBooks Online OAuth tokens per organization';
COMMENT ON TABLE books.accounts IS 'Chart of accounts synchronized with QuickBooks';
COMMENT ON TABLE books.contacts IS 'Customers and vendors from QuickBooks';
COMMENT ON TABLE books.items IS 'Products/services for invoicing';
COMMENT ON TABLE books.invoices IS 'Accounts receivable - customer invoices';
COMMENT ON TABLE books.bills IS 'Accounts payable - vendor bills';
COMMENT ON TABLE books.payments IS 'Payment transactions (receipts and disbursements)';
COMMENT ON TABLE books.bank_accounts IS 'Bank accounts for reconciliation';
COMMENT ON TABLE books.bank_transactions IS 'Bank feed transactions for reconciliation';
COMMENT ON TABLE books.sync_jobs IS 'QuickBooks synchronization job tracking';