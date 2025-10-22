-- Developer Platform Infrastructure
-- Creates tables for API keys, webhooks, and API logs

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- First 8 chars for display (e.g., "taxu_live_")
  key_hash TEXT NOT NULL UNIQUE, -- Hashed full key for verification
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'production')),
  permissions JSONB DEFAULT '["read", "write"]'::jsonb,
  rate_limit INTEGER DEFAULT 1000, -- Requests per hour
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Webhook Endpoints table
CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  description TEXT,
  secret TEXT NOT NULL, -- For HMAC signature verification
  events TEXT[] NOT NULL, -- Array of event types to listen for
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'production')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook Events table (delivery log)
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_endpoint_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'delivered', 'failed', 'retrying')),
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  response_code INTEGER,
  response_body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Request Logs table
CREATE TABLE IF NOT EXISTS api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  request_body JSONB,
  response_body JSONB,
  ip_address TEXT,
  user_agent TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_environment ON api_keys(environment);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_user_id ON webhook_endpoints(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_endpoint_id ON webhook_events(webhook_endpoint_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_api_logs_api_key_id ON api_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_keys
CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys"
  ON api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
  ON api_keys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
  ON api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for webhook_endpoints
CREATE POLICY "Users can view their own webhook endpoints"
  ON webhook_endpoints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhook endpoints"
  ON webhook_endpoints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhook endpoints"
  ON webhook_endpoints FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhook endpoints"
  ON webhook_endpoints FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for webhook_events
CREATE POLICY "Users can view webhook events for their endpoints"
  ON webhook_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM webhook_endpoints
      WHERE webhook_endpoints.id = webhook_events.webhook_endpoint_id
      AND webhook_endpoints.user_id = auth.uid()
    )
  );

-- RLS Policies for api_logs
CREATE POLICY "Users can view their own API logs"
  ON api_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhook_endpoints_updated_at
  BEFORE UPDATE ON webhook_endpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
