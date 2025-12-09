-- Developer Platform Schema for Taxu
-- This creates tables needed for API keys, webhooks, events, and developer tools

-- ============================================
-- API Keys & Authentication
-- ============================================

-- Enhanced API Keys table (if not sufficient)
CREATE TABLE IF NOT EXISTS public.api_key_scopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  scope TEXT NOT NULL, -- e.g., 'tax_filing:read', 'neobank:write', 'investment:read'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Webhook System
-- ============================================

-- Webhook Endpoints (already exists, but let's ensure it has all fields)
-- Your existing 'webhooks' table is good, but let's add webhook events

CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL, -- e.g., 'tax_filing.completed', 'neobank.transaction.created'
  event_category VARCHAR(50) NOT NULL, -- 'tax_filing', 'neobank', 'investment', 'accounting'
  resource_id UUID, -- The ID of the resource that triggered the event
  resource_type VARCHAR(50), -- 'tax_filing', 'transaction', 'invoice', etc.
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  api_version VARCHAR(20) DEFAULT '2024-01',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0
);

-- Link webhook deliveries to events
ALTER TABLE public.webhook_deliveries 
ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.webhook_events(id) ON DELETE CASCADE;

-- Webhook event subscriptions
CREATE TABLE IF NOT EXISTS public.webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES public.webhooks(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(webhook_id, event_type)
);

-- ============================================
-- API Request Logs & Analytics
-- ============================================

CREATE TABLE IF NOT EXISTS public.api_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  request_id VARCHAR(100) UNIQUE, -- For tracing
  method VARCHAR(10) NOT NULL, -- GET, POST, PUT, DELETE
  endpoint TEXT NOT NULL,
  path_parameters JSONB,
  query_parameters JSONB,
  request_body JSONB,
  response_status INTEGER,
  response_body JSONB,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  error_message TEXT,
  error_code VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Rate Limiting tracking
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  endpoint_pattern TEXT NOT NULL, -- e.g., '/v1/tax-filings/*'
  window_start TIMESTAMPTZ NOT NULL,
  window_duration_seconds INTEGER NOT NULL, -- 60 for 1 minute, 3600 for 1 hour
  request_count INTEGER DEFAULT 1,
  limit_exceeded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Developer Workbench / Testing
-- ============================================

CREATE TABLE IF NOT EXISTS public.developer_test_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_name VARCHAR(255),
  method VARCHAR(10) NOT NULL,
  endpoint TEXT NOT NULL,
  headers JSONB,
  body JSONB,
  response_status INTEGER,
  response_body JSONB,
  response_time_ms INTEGER,
  environment VARCHAR(20) DEFAULT 'test', -- 'test', 'sandbox', 'production'
  is_saved BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.developer_test_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collection_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.developer_test_collection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.developer_test_collections(id) ON DELETE CASCADE,
  test_request_id UUID NOT NULL REFERENCES public.developer_test_requests(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SDK Downloads & Metrics
-- ============================================

CREATE TABLE IF NOT EXISTS public.sdk_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sdk_name VARCHAR(100) NOT NULL, -- 'taxu-node', 'taxu-python', 'taxu-ruby', etc.
  sdk_version VARCHAR(50) NOT NULL,
  download_source VARCHAR(50), -- 'npm', 'pypi', 'rubygems', 'docs', 'github'
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- API Documentation Views & Search
-- ============================================

CREATE TABLE IF NOT EXISTS public.documentation_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page_path TEXT NOT NULL, -- e.g., '/docs/api/tax-filing'
  page_title VARCHAR(255),
  time_on_page_seconds INTEGER,
  ip_address INET,
  referrer TEXT,
  search_query TEXT, -- If they came from search
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.documentation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page_path TEXT NOT NULL,
  feedback_type VARCHAR(20) NOT NULL, -- 'helpful', 'not_helpful', 'suggestion'
  feedback_text TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- API Changelog & Versioning
-- ============================================

CREATE TABLE IF NOT EXISTS public.api_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number VARCHAR(20) NOT NULL UNIQUE, -- '2024-01', '2024-02', etc.
  release_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  is_deprecated BOOLEAN DEFAULT false,
  deprecation_date DATE,
  sunset_date DATE,
  changelog TEXT,
  breaking_changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.api_changelog_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID NOT NULL REFERENCES public.api_versions(id) ON DELETE CASCADE,
  change_type VARCHAR(50) NOT NULL, -- 'feature', 'improvement', 'bugfix', 'breaking_change', 'deprecation'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  affected_endpoints TEXT[],
  migration_guide TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Developer Support & Tickets
-- ============================================

CREATE TABLE IF NOT EXISTS public.developer_support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  subject VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50), -- 'api', 'sdk', 'webhook', 'billing', 'technical', 'general'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed'
  assigned_to UUID,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.developer_support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.developer_support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_staff BOOLEAN DEFAULT false,
  message TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- API Status & Incidents
-- ============================================

CREATE TABLE IF NOT EXISTS public.api_status_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_title VARCHAR(255) NOT NULL,
  incident_description TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL, -- 'minor', 'major', 'critical'
  status VARCHAR(50) DEFAULT 'investigating', -- 'investigating', 'identified', 'monitoring', 'resolved'
  affected_services TEXT[], -- ['tax_filing_api', 'neobank_api', 'webhooks']
  started_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  root_cause TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.api_status_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES public.api_status_incidents(id) ON DELETE CASCADE,
  update_text TEXT NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_category ON public.webhook_events(event_category);
CREATE INDEX IF NOT EXISTS idx_webhook_events_user ON public.webhook_events(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_org ON public.webhook_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created ON public.webhook_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_request_logs_key ON public.api_request_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_user ON public.api_request_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_created ON public.api_request_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_endpoint ON public.api_request_logs(endpoint);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_key ON public.api_rate_limits(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window ON public.api_rate_limits(window_start);

CREATE INDEX IF NOT EXISTS idx_dev_test_requests_user ON public.developer_test_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_dev_test_requests_saved ON public.developer_test_requests(is_saved);

CREATE INDEX IF NOT EXISTS idx_sdk_downloads_name ON public.sdk_downloads(sdk_name);
CREATE INDEX IF NOT EXISTS idx_sdk_downloads_created ON public.sdk_downloads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_doc_views_path ON public.documentation_page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_doc_views_created ON public.documentation_page_views(created_at DESC);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE public.api_key_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_request_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_test_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_test_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sdk_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_support_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own API key scopes"
  ON public.api_key_scopes FOR SELECT
  USING (api_key_id IN (SELECT id FROM public.api_keys WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own webhook events"
  ON public.webhook_events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own webhook subscriptions"
  ON public.webhook_subscriptions FOR ALL
  USING (webhook_id IN (SELECT id FROM public.webhooks WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own API logs"
  ON public.api_request_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own test requests"
  ON public.developer_test_requests FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own test collections"
  ON public.developer_test_collections FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view SDK downloads anonymously"
  ON public.sdk_downloads FOR SELECT
  USING (true);

CREATE POLICY "Users can submit documentation feedback"
  ON public.documentation_feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can manage their own support tickets"
  ON public.developer_support_tickets FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can view messages for their tickets"
  ON public.developer_support_messages FOR SELECT
  USING (ticket_id IN (SELECT id FROM public.developer_support_tickets WHERE user_id = auth.uid()));

-- ============================================
-- Functions for Webhook Event Creation
-- ============================================

CREATE OR REPLACE FUNCTION public.create_webhook_event(
  p_event_type VARCHAR,
  p_event_category VARCHAR,
  p_resource_id UUID,
  p_resource_type VARCHAR,
  p_user_id UUID,
  p_organization_id UUID,
  p_payload JSONB
) RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  -- Create the event
  INSERT INTO public.webhook_events (
    event_type,
    event_category,
    resource_id,
    resource_type,
    user_id,
    organization_id,
    payload
  ) VALUES (
    p_event_type,
    p_event_category,
    p_resource_id,
    p_resource_type,
    p_user_id,
    p_organization_id,
    p_payload
  ) RETURNING id INTO v_event_id;

  -- Queue webhook deliveries for all subscribed webhooks
  INSERT INTO public.webhook_deliveries (
    webhook_id,
    event_id,
    event_type,
    payload,
    delivery_attempts
  )
  SELECT 
    w.id,
    v_event_id,
    p_event_type,
    p_payload,
    0
  FROM public.webhooks w
  INNER JOIN public.webhook_subscriptions ws ON ws.webhook_id = w.id
  WHERE ws.event_type = p_event_type
    AND ws.is_active = true
    AND w.is_active = true
    AND (w.user_id = p_user_id OR w.organization_id = p_organization_id);

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_webhook_event TO authenticated;
