-- QuickBooks OAuth connections table
CREATE TABLE IF NOT EXISTS quickbooks_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  realm_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  UNIQUE(user_id)
);

-- Add qbo_id columns to existing tables for sync tracking
ALTER TABLE customers ADD COLUMN IF NOT EXISTS qbo_id TEXT UNIQUE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ;

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS qbo_id TEXT UNIQUE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ;

ALTER TABLE vendors ADD COLUMN IF NOT EXISTS qbo_id TEXT UNIQUE;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ;

ALTER TABLE expenses ADD COLUMN IF NOT EXISTS qbo_id TEXT UNIQUE;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_qbo_id ON customers(qbo_id);
CREATE INDEX IF NOT EXISTS idx_invoices_qbo_id ON invoices(qbo_id);
CREATE INDEX IF NOT EXISTS idx_vendors_qbo_id ON vendors(qbo_id);
CREATE INDEX IF NOT EXISTS idx_expenses_qbo_id ON expenses(qbo_id);

-- Enable Row Level Security
ALTER TABLE quickbooks_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own QuickBooks connections"
  ON quickbooks_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own QuickBooks connections"
  ON quickbooks_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own QuickBooks connections"
  ON quickbooks_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own QuickBooks connections"
  ON quickbooks_connections FOR DELETE
  USING (auth.uid() = user_id);
