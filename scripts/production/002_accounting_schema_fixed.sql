-- Accounting Platform Schema (Compatible with existing structure)
-- This script safely adds any missing tables without conflicting

-- Only create tables if they don't exist in the books schema

-- Chart of Accounts (compatible with existing books.accounts)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'books' AND tablename = 'accounts') THEN
    CREATE TABLE books.accounts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
      subtype TEXT,
      currency TEXT DEFAULT 'USD',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(org_id, code)
    );
  END IF;
END $$;

-- Contacts table (compatible with existing books.contacts using 'kind')
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'books' AND tablename = 'contacts') THEN
    CREATE TABLE books.contacts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
      kind TEXT NOT NULL CHECK (kind IN ('customer', 'vendor', 'both')),
      display_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      tax_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_books_accounts_org_id ON books.accounts(org_id);
CREATE INDEX IF NOT EXISTS idx_books_accounts_type ON books.accounts(type) WHERE type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_books_contacts_org_id ON books.contacts(org_id);
CREATE INDEX IF NOT EXISTS idx_books_contacts_kind ON books.contacts(kind) WHERE kind IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_books_invoices_org_id ON books.invoices(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_books_invoices_status ON books.invoices(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_books_bills_org_id ON books.bills(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_books_bills_status ON books.bills(status) WHERE status IS NOT NULL;

-- Enable RLS (safely, will not error if already enabled)
ALTER TABLE books.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.bills ENABLE ROW LEVEL SECURITY;

-- Create or replace RLS policies
DROP POLICY IF EXISTS "Users can view org accounts" ON books.accounts;
CREATE POLICY "Users can view org accounts" ON books.accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM books.org_members
      WHERE org_members.org_id = accounts.org_id
      AND org_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage org accounts" ON books.accounts;
CREATE POLICY "Users can manage org accounts" ON books.accounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.org_members
      WHERE org_members.org_id = accounts.org_id
      AND org_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view org contacts" ON books.contacts;
CREATE POLICY "Users can view org contacts" ON books.contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM books.org_members
      WHERE org_members.org_id = contacts.org_id
      AND org_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage org contacts" ON books.contacts;
CREATE POLICY "Users can manage org contacts" ON books.contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.org_members
      WHERE org_members.org_id = contacts.org_id
      AND org_members.user_id = auth.uid()
    )
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Accounting schema verified and indexes created successfully';
END $$;
