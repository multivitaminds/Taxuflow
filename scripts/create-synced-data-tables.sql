-- Create tables for synced data from accounting platforms

-- Synced invoices
CREATE TABLE IF NOT EXISTS synced_invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  xero_id TEXT,
  qbo_id TEXT,
  invoice_number TEXT NOT NULL,
  contact_name TEXT,
  total DECIMAL(10, 2),
  amount_due DECIMAL(10, 2),
  status TEXT,
  date DATE,
  due_date DATE,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, provider, xero_id),
  UNIQUE(user_id, provider, qbo_id)
);

-- Synced contacts
CREATE TABLE IF NOT EXISTS synced_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  xero_id TEXT,
  qbo_id TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  is_customer BOOLEAN DEFAULT false,
  is_supplier BOOLEAN DEFAULT false,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, provider, xero_id),
  UNIQUE(user_id, provider, qbo_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_synced_invoices_user ON synced_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_synced_invoices_provider ON synced_invoices(provider);
CREATE INDEX IF NOT EXISTS idx_synced_contacts_user ON synced_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_synced_contacts_provider ON synced_contacts(provider);

-- Enable RLS
ALTER TABLE synced_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_contacts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own synced invoices"
  ON synced_invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own synced contacts"
  ON synced_contacts FOR SELECT
  USING (auth.uid() = user_id);
