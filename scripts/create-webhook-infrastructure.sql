-- Webhook Endpoints table - stores registered webhook URLs
CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  description TEXT,
  secret TEXT NOT NULL, -- HMAC secret for signature verification
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'failed')),
  environment TEXT NOT NULL DEFAULT 'production' CHECK (environment IN ('production', 'test')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_triggered_at TIMESTAMPTZ,
  CONSTRAINT webhook_endpoints_url_user_unique UNIQUE(url, user_id)
);

-- Event Subscriptions table - maps endpoints to event types
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_endpoint_id UUID NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT webhook_subscriptions_unique UNIQUE(webhook_endpoint_id, event_type)
);

-- Webhook Delivery Logs table - tracks all webhook delivery attempts
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_endpoint_id UUID NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  http_status INTEGER,
  response_body TEXT,
  response_time_ms INTEGER,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'retrying')),
  error_message TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_retry_at TIMESTAMPTZ
);

-- Webhook Events table - stores all events that can trigger webhooks
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  resource_type TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_user_id ON webhook_endpoints(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_status ON webhook_endpoints(status);
CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_endpoint_id ON webhook_subscriptions(webhook_endpoint_id);
CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_event_type ON webhook_subscriptions(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_endpoint_id ON webhook_deliveries(webhook_endpoint_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_created_at ON webhook_deliveries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_next_retry ON webhook_deliveries(next_retry_at) WHERE status = 'retrying';
CREATE INDEX IF NOT EXISTS idx_webhook_events_user_id ON webhook_events(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);

-- Row Level Security
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

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

-- RLS Policies for webhook_subscriptions
CREATE POLICY "Users can view subscriptions for their endpoints"
  ON webhook_subscriptions FOR SELECT
  USING (
    webhook_endpoint_id IN (
      SELECT id FROM webhook_endpoints WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create subscriptions for their endpoints"
  ON webhook_subscriptions FOR INSERT
  WITH CHECK (
    webhook_endpoint_id IN (
      SELECT id FROM webhook_endpoints WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update subscriptions for their endpoints"
  ON webhook_subscriptions FOR UPDATE
  USING (
    webhook_endpoint_id IN (
      SELECT id FROM webhook_endpoints WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete subscriptions for their endpoints"
  ON webhook_subscriptions FOR DELETE
  USING (
    webhook_endpoint_id IN (
      SELECT id FROM webhook_endpoints WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for webhook_deliveries
CREATE POLICY "Users can view deliveries for their endpoints"
  ON webhook_deliveries FOR SELECT
  USING (
    webhook_endpoint_id IN (
      SELECT id FROM webhook_endpoints WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for webhook_events
CREATE POLICY "Users can view their own webhook events"
  ON webhook_events FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_webhook_endpoints_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for webhook_endpoints
CREATE TRIGGER update_webhook_endpoints_timestamp
  BEFORE UPDATE ON webhook_endpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_endpoints_updated_at();

-- Function to generate webhook secret
CREATE OR REPLACE FUNCTION generate_webhook_secret()
RETURNS TEXT AS $$
BEGIN
  RETURN 'whsec_' || encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;
