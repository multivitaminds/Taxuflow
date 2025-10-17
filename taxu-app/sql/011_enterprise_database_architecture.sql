-- Enterprise Database Architecture Advanced Features
-- This script adds advanced enterprise features for scalability and compliance

-- Create organizations table for multi-tenant support
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_type VARCHAR(50) DEFAULT 'free', -- 'free', 'professional', 'enterprise'
    max_users INTEGER DEFAULT 5,
    max_documents INTEGER DEFAULT 100,
    features JSONB DEFAULT '[]'::jsonb,
    billing_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization memberships
CREATE TABLE IF NOT EXISTS organization_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member', 'viewer'
    permissions JSONB DEFAULT '[]'::jsonb,
    invited_by UUID REFERENCES users(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Create API keys table for programmatic access
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb,
    rate_limit_per_minute INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create webhooks table for integrations
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    events JSONB NOT NULL, -- Array of event types to listen for
    secret VARCHAR(255), -- For webhook signature verification
    is_active BOOLEAN DEFAULT TRUE,
    retry_count INTEGER DEFAULT 3,
    last_success_at TIMESTAMP WITH TIME ZONE,
    last_failure_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create webhook deliveries table
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    delivery_attempts INTEGER DEFAULT 0,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add organization support to existing tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS default_organization_id UUID REFERENCES organizations(id);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE tax_returns ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Create materialized view for organization statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS organization_stats AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    COUNT(DISTINCT om.user_id) as user_count,
    COUNT(DISTINCT d.id) as document_count,
    COUNT(DISTINCT tr.id) as tax_return_count,
    MAX(d.created_at) as last_document_upload,
    MAX(tr.created_at) as last_tax_return
FROM organizations o
LEFT JOIN organization_memberships om ON o.id = om.organization_id
LEFT JOIN documents d ON o.id = d.organization_id
LEFT JOIN tax_returns tr ON o.id = tr.organization_id
GROUP BY o.id, o.name;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_stats_org_id ON organization_stats(organization_id);

-- Enable RLS for new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- RLS policies for organizations
CREATE POLICY "Users can view organizations they belong to" ON organizations
    FOR SELECT USING (id IN (SELECT organization_id FROM organization_memberships WHERE user_id = auth.uid()));

CREATE POLICY "Organization admins can update organization" ON organizations
    FOR UPDATE USING (id IN (SELECT organization_id FROM organization_memberships WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

-- RLS policies for organization memberships
CREATE POLICY "Users can view memberships in their organizations" ON organization_memberships
    FOR SELECT USING (organization_id IN (SELECT organization_id FROM organization_memberships WHERE user_id = auth.uid()));

-- RLS policies for API keys
CREATE POLICY "Users can manage their own API keys" ON api_keys
    FOR ALL USING (user_id = auth.uid() OR organization_id IN (SELECT organization_id FROM organization_memberships WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

-- RLS policies for webhooks
CREATE POLICY "Users can manage webhooks in their organizations" ON webhooks
    FOR ALL USING (organization_id IN (SELECT organization_id FROM organization_memberships WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

-- RLS policies for webhook deliveries
CREATE POLICY "Users can view webhook deliveries for their webhooks" ON webhook_deliveries
    FOR SELECT USING (webhook_id IN (SELECT id FROM webhooks WHERE organization_id IN (SELECT organization_id FROM organization_memberships WHERE user_id = auth.uid())));

-- Add comprehensive indexes
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_org_memberships_user_id ON organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_org_id ON organization_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_webhooks_org_id ON webhooks(organization_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_documents_org_id ON documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_tax_forms_org_id ON tax_forms(organization_id);
CREATE INDEX IF NOT EXISTS idx_tax_returns_org_id ON tax_returns(organization_id);

-- Add comments
COMMENT ON TABLE organizations IS 'Organizations for multi-tenant support';
COMMENT ON TABLE organization_memberships IS 'User memberships in organizations';
COMMENT ON TABLE api_keys IS 'API keys for programmatic access';
COMMENT ON TABLE webhooks IS 'Webhook configurations for integrations';
COMMENT ON TABLE webhook_deliveries IS 'Webhook delivery logs';
COMMENT ON MATERIALIZED VIEW organization_stats IS 'Aggregated statistics per organization';