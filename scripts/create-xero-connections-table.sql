-- Create xero_connections table to store Xero OAuth credentials
CREATE TABLE IF NOT EXISTS xero_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  UNIQUE(user_id, tenant_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_xero_connections_user_id ON xero_connections(user_id);

-- Enable Row Level Security
ALTER TABLE xero_connections ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only access their own connections
CREATE POLICY "Users can manage their own Xero connections"
  ON xero_connections
  FOR ALL
  USING (auth.uid() = user_id);
