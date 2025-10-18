-- Complete Books Schema Migration with RLS Policies
-- Run this in your Supabase SQL Editor

-- Create the books schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS books;

-- Organizations table
CREATE TABLE IF NOT EXISTS books.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Org members
CREATE TABLE IF NOT EXISTS books.org_members (
  org_id uuid REFERENCES books.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text CHECK (role IN ('owner','admin','member')) DEFAULT 'member',
  PRIMARY KEY (org_id, user_id),
  created_at timestamptz DEFAULT now()
);

-- Accounts
CREATE TABLE IF NOT EXISTS books.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  type text NOT NULL,
  subtype text,
  currency text DEFAULT 'USD',
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now()
);

-- Contacts
CREATE TABLE IF NOT EXISTS books.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  kind text CHECK (kind IN ('customer','vendor')) NOT NULL,
  display_name text NOT NULL,
  email text,
  phone text,
  tax_id text,
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now()
);

-- Items
CREATE TABLE IF NOT EXISTS books.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text,
  price numeric(14,2),
  income_account uuid REFERENCES books.accounts(id),
  expense_account uuid REFERENCES books.accounts(id),
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now()
);

-- Journal
CREATE TABLE IF NOT EXISTS books.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  date date NOT NULL,
  memo text,
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS books.journal_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES books.journal_entries(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES books.accounts(id),
  contact_id uuid REFERENCES books.contacts(id),
  debit numeric(14,2) DEFAULT 0,
  credit numeric(14,2) DEFAULT 0,
  memo text
);

-- Invoices
CREATE TABLE IF NOT EXISTS books.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES books.contacts(id),
  number text,
  status text CHECK (status IN ('draft','open','paid','void')) DEFAULT 'open',
  issue_date date NOT NULL,
  due_date date,
  currency text DEFAULT 'USD',
  subtotal numeric(14,2) DEFAULT 0,
  tax numeric(14,2) DEFAULT 0,
  total numeric(14,2) DEFAULT 0,
  balance numeric(14,2) DEFAULT 0,
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS books.invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES books.invoices(id) ON DELETE CASCADE,
  item_id uuid REFERENCES books.items(id),
  description text,
  quantity numeric(14,4) DEFAULT 1,
  unit_price numeric(14,2) DEFAULT 0,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  account_id uuid REFERENCES books.accounts(id)
);

-- Bills
CREATE TABLE IF NOT EXISTS books.bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES books.contacts(id),
  number text,
  status text CHECK (status IN ('open','paid','void')) DEFAULT 'open',
  issue_date date NOT NULL,
  due_date date,
  currency text DEFAULT 'USD',
  subtotal numeric(14,2) DEFAULT 0,
  tax numeric(14,2) DEFAULT 0,
  total numeric(14,2) DEFAULT 0,
  balance numeric(14,2) DEFAULT 0,
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS books.bill_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id uuid NOT NULL REFERENCES books.bills(id) ON DELETE CASCADE,
  description text,
  quantity numeric(14,4) DEFAULT 1,
  unit_price numeric(14,2) DEFAULT 0,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  account_id uuid REFERENCES books.accounts(id)
);

-- Payments
CREATE TABLE IF NOT EXISTS books.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  direction text CHECK (direction IN ('in','out')) NOT NULL,
  method text,
  amount numeric(14,2) NOT NULL,
  currency text DEFAULT 'USD',
  received_on date NOT NULL,
  contact_id uuid REFERENCES books.contacts(id),
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS books.payment_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES books.payments(id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES books.invoices(id),
  bill_id uuid REFERENCES books.bills(id),
  amount numeric(14,2) NOT NULL
);

-- Bank Accounts
CREATE TABLE IF NOT EXISTS books.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  mask text,
  currency text DEFAULT 'USD',
  external_id text,
  created_at timestamptz DEFAULT now()
);

-- Bank Transactions
CREATE TABLE IF NOT EXISTS books.bank_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id uuid NOT NULL REFERENCES books.bank_accounts(id) ON DELETE CASCADE,
  posted_on date NOT NULL,
  amount numeric(14,2) NOT NULL,
  counterparty text,
  memo text,
  fitid text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE books.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.org_members ENABLE ROW LEVEL SECURITY;
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

-- Helper function for org membership check
CREATE OR REPLACE FUNCTION books.is_org_member(_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM books.org_members m
    WHERE m.org_id = _org_id 
    AND m.user_id = auth.uid()
  );
$$;

-- RLS Policies
CREATE POLICY "Users can view orgs they belong to" ON books.organizations
  FOR SELECT USING (id IN (SELECT org_id FROM books.org_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view org memberships" ON books.org_members
  FOR SELECT USING (org_id IN (SELECT org_id FROM books.org_members WHERE user_id = auth.uid()));

CREATE POLICY "Org members can access accounts" ON books.accounts
  FOR ALL USING (books.is_org_member(org_id));

CREATE POLICY "Org members can access contacts" ON books.contacts
  FOR ALL USING (books.is_org_member(org_id));

CREATE POLICY "Org members can access items" ON books.items
  FOR ALL USING (books.is_org_member(org_id));

CREATE POLICY "Org members can access journal entries" ON books.journal_entries
  FOR ALL USING (books.is_org_member(org_id));

CREATE POLICY "Org members can access journal lines" ON books.journal_lines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.journal_entries je 
      WHERE je.id = journal_lines.entry_id 
      AND books.is_org_member(je.org_id)
    )
  );

CREATE POLICY "Org members can access invoices" ON books.invoices
  FOR ALL USING (books.is_org_member(org_id));

CREATE POLICY "Org members can access invoice lines" ON books.invoice_lines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.invoices i 
      WHERE i.id = invoice_lines.invoice_id 
      AND books.is_org_member(i.org_id)
    )
  );

CREATE POLICY "Org members can access bills" ON books.bills
  FOR ALL USING (books.is_org_member(org_id));

CREATE POLICY "Org members can access bill lines" ON books.bill_lines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.bills b 
      WHERE b.id = bill_lines.bill_id 
      AND books.is_org_member(b.org_id)
    )
  );

CREATE POLICY "Org members can access payments" ON books.payments
  FOR ALL USING (books.is_org_member(org_id));

CREATE POLICY "Org members can access payment applications" ON books.payment_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.payments p 
      WHERE p.id = payment_applications.payment_id 
      AND books.is_org_member(p.org_id)
    )
  );

CREATE POLICY "Org members can access bank accounts" ON books.bank_accounts
  FOR ALL USING (books.is_org_member(org_id));

CREATE POLICY "Org members can access bank transactions" ON books.bank_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.bank_accounts ba 
      WHERE ba.id = bank_transactions.bank_account_id 
      AND books.is_org_member(ba.org_id)
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_accounts_org_id ON books.accounts(org_id);
CREATE INDEX IF NOT EXISTS idx_books_contacts_org_id ON books.contacts(org_id);
CREATE INDEX IF NOT EXISTS idx_books_invoices_org_id ON books.invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_books_bills_org_id ON books.bills(org_id);
CREATE INDEX IF NOT EXISTS idx_books_payments_org_id ON books.payments(org_id);

-- Success message
SELECT 'Books schema migration completed successfully!' as result;