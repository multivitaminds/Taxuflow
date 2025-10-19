-- =====================================================
-- TAXU ENTERPRISE DATABASE ARCHITECTURE
-- Billion-Dollar Platform Schema
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For advanced indexing

-- =====================================================
-- USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- Enhanced user profiles with enterprise features
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ssn_encrypted TEXT; -- Encrypted SSN
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US';
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York';
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'; -- free, pro, enterprise
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- User preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark', -- dark, light, auto
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  tax_reminders BOOLEAN DEFAULT TRUE,
  deduction_alerts BOOLEAN DEFAULT TRUE,
  audit_warnings BOOLEAN DEFAULT TRUE,
  dashboard_layout JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TEAM & COLLABORATION
-- =====================================================

-- Teams for families, businesses, accountants
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  team_type TEXT NOT NULL, -- family, business, accountant_firm
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  billing_email TEXT,
  subscription_tier TEXT DEFAULT 'free',
  max_members INTEGER DEFAULT 5,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members with roles
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- owner, admin, member, viewer, accountant
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- pending, active, suspended
  UNIQUE(team_id, user_id)
);

-- Team invitations
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  invited_by UUID REFERENCES users(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADVANCED TAX OPTIMIZATION
-- =====================================================

-- Tax strategies and recommendations
CREATE TABLE IF NOT EXISTS tax_strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  strategy_type TEXT NOT NULL, -- deduction, credit, timing, entity_structure
  title TEXT NOT NULL,
  description TEXT,
  potential_savings DECIMAL(12, 2),
  confidence_score INTEGER, -- 0-100
  priority TEXT, -- high, medium, low
  status TEXT DEFAULT 'recommended', -- recommended, applied, dismissed
  ai_agent TEXT, -- Which agent recommended it
  reasoning TEXT,
  action_items JSONB DEFAULT '[]',
  deadline DATE,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Multi-year tax history and projections
CREATE TABLE IF NOT EXISTS tax_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  filing_status TEXT, -- single, married_joint, married_separate, head_of_household
  total_income DECIMAL(12, 2),
  adjusted_gross_income DECIMAL(12, 2),
  taxable_income DECIMAL(12, 2),
  total_tax DECIMAL(12, 2),
  total_deductions DECIMAL(12, 2),
  total_credits DECIMAL(12, 2),
  refund_amount DECIMAL(12, 2),
  amount_owed DECIMAL(12, 2),
  effective_tax_rate DECIMAL(5, 2),
  marginal_tax_rate DECIMAL(5, 2),
  filing_date DATE,
  status TEXT DEFAULT 'in_progress', -- in_progress, filed, accepted, rejected
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tax_year)
);

-- Deduction tracking and categorization
CREATE TABLE IF NOT EXISTS deduction_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category_type TEXT, -- standard, itemized, business, investment
  irs_form TEXT, -- Which IRS form this applies to
  max_amount DECIMAL(12, 2),
  eligibility_criteria JSONB DEFAULT '{}',
  documentation_required TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced deductions table
ALTER TABLE deductions ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES deduction_categories(id);
ALTER TABLE deductions ADD COLUMN IF NOT EXISTS receipt_url TEXT;
ALTER TABLE deductions ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending'; -- pending, verified, rejected
ALTER TABLE deductions ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES users(id);
ALTER TABLE deductions ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE deductions ADD COLUMN IF NOT EXISTS notes TEXT;

-- =====================================================
-- AI AGENT INTELLIGENCE SYSTEM
-- =====================================================

-- AI agent capabilities and performance tracking
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL UNIQUE, -- sophie, leo, riley, kai, jordan
  display_name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  capabilities JSONB DEFAULT '[]',
  model_version TEXT,
  accuracy_score DECIMAL(5, 2), -- 0-100
  total_analyses INTEGER DEFAULT 0,
  successful_analyses INTEGER DEFAULT 0,
  average_confidence DECIMAL(5, 2),
  specializations TEXT[],
  languages_supported TEXT[] DEFAULT ARRAY['en'],
  status TEXT DEFAULT 'active', -- active, training, maintenance
  last_trained_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI agent learning and feedback
CREATE TABLE IF NOT EXISTS ai_agent_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  activity_id UUID REFERENCES agent_activities(id),
  feedback_type TEXT NOT NULL, -- helpful, not_helpful, incorrect, excellent
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  correction_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI agent conversations and context
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  conversation_type TEXT, -- chat, analysis, recommendation
  messages JSONB DEFAULT '[]',
  context JSONB DEFAULT '{}',
  sentiment TEXT, -- positive, neutral, negative
  resolved BOOLEAN DEFAULT FALSE,
  satisfaction_rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DOCUMENT INTELLIGENCE
-- =====================================================

-- Document processing queue
CREATE TABLE IF NOT EXISTS document_processing_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'queued', -- queued, processing, completed, failed
  priority INTEGER DEFAULT 5, -- 1-10, higher is more urgent
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  processing_duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document versions and history
CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  changes_description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document sharing and permissions
CREATE TABLE IF NOT EXISTS document_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES users(id),
  shared_with UUID REFERENCES users(id),
  permission_level TEXT NOT NULL, -- view, edit, admin
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDIT & COMPLIANCE
-- =====================================================

-- Audit risk assessments
CREATE TABLE IF NOT EXISTS audit_risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  overall_risk_score INTEGER CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  risk_level TEXT, -- low, medium, high, critical
  risk_factors JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  assessed_by TEXT DEFAULT 'kai', -- AI agent name
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance checks and validations
CREATE TABLE IF NOT EXISTS compliance_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL, -- irs_validation, state_validation, documentation
  status TEXT NOT NULL, -- passed, failed, warning
  details JSONB DEFAULT '{}',
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trail for all actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT, -- document, tax_return, deduction, etc.
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  changes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS & ALERTS
-- =====================================================

-- User notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- tax_deadline, deduction_found, audit_warning, document_processed
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  category TEXT, -- tax, document, account, security
  action_url TEXT,
  action_label TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax deadline reminders
CREATE TABLE IF NOT EXISTS tax_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deadline_type TEXT NOT NULL, -- federal_filing, state_filing, estimated_payment, extension
  tax_year INTEGER NOT NULL,
  deadline_date DATE NOT NULL,
  description TEXT,
  applies_to TEXT[], -- Array of filing statuses or entity types
  reminder_days_before INTEGER[] DEFAULT ARRAY[30, 14, 7, 1],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS & REPORTING
-- =====================================================

-- User activity analytics
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  session_id TEXT,
  page_url TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform metrics and KPIs
CREATE TABLE IF NOT EXISTS platform_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(12, 2),
  metric_type TEXT, -- count, percentage, currency, duration
  period TEXT, -- daily, weekly, monthly, yearly
  period_start DATE,
  period_end DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INTEGRATIONS & API
-- =====================================================

-- Third-party integrations
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL, -- plaid, stripe, quickbooks, xero
  integration_name TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- active, inactive, error
  credentials_encrypted TEXT,
  last_sync_at TIMESTAMPTZ,
  sync_frequency TEXT DEFAULT 'daily',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API keys for developers
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  rate_limit INTEGER DEFAULT 1000, -- requests per hour
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook endpoints
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_triggered_at TIMESTAMPTZ,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FINANCIAL CONNECTIONS
-- =====================================================

-- Connected bank accounts
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  account_type TEXT, -- checking, savings, investment
  account_number_encrypted TEXT,
  routing_number_encrypted TEXT,
  account_nickname TEXT,
  balance DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  is_primary BOOLEAN DEFAULT FALSE,
  plaid_account_id TEXT,
  last_synced_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES bank_accounts(id),
  transaction_date DATE NOT NULL,
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  category TEXT,
  is_deductible BOOLEAN DEFAULT FALSE,
  deduction_id UUID REFERENCES deductions(id),
  merchant_name TEXT,
  plaid_transaction_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Team indexes
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_tax_documents_user_id ON tax_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_documents_document_type ON tax_documents(document_type);

-- Tax indexes
CREATE INDEX IF NOT EXISTS idx_tax_years_user_id ON tax_years(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_years_tax_year ON tax_years(tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_strategies_user_id ON tax_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_strategies_status ON tax_strategies(status);

-- AI agent indexes
CREATE INDEX IF NOT EXISTS idx_agent_activities_user_id ON agent_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_activities_agent_name ON agent_activities(agent_name);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE deduction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_processing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Team policies
CREATE POLICY "Users can view teams they belong to" ON teams FOR SELECT USING (
  id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
);
CREATE POLICY "Team owners can update their teams" ON teams FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Users can create teams" ON teams FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Tax strategies policies
CREATE POLICY "Users can view own tax strategies" ON tax_strategies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own tax strategies" ON tax_strategies FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Bank accounts policies
CREATE POLICY "Users can view own bank accounts" ON bank_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bank accounts" ON bank_accounts FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- AI conversations policies
CREATE POLICY "Users can view own conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for certain tables
CREATE POLICY "Anyone can view AI agents" ON ai_agents FOR SELECT USING (true);
CREATE POLICY "Anyone can view deduction categories" ON deduction_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view tax deadlines" ON tax_deadlines FOR SELECT USING (true);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert AI agents
INSERT INTO ai_agents (agent_name, display_name, role, description, capabilities, specializations) VALUES
('sophie', 'Sophie', 'Document Analyst', 'Expert at analyzing tax documents and extracting data with precision', 
 '["document_ocr", "data_extraction", "form_recognition", "multi_language_support"]'::jsonb,
 ARRAY['W-2', '1099', '1040', 'receipts', 'invoices']),
('leo', 'Leo', 'Refund Analyst', 'Calculates your maximum refund and identifies tax-saving opportunities',
 '["tax_calculation", "refund_optimization", "credit_identification", "scenario_modeling"]'::jsonb,
 ARRAY['federal_tax', 'state_tax', 'credits', 'deductions']),
('riley', 'Riley', 'Business Planner', 'Finds deductions and creates tax strategies for your business',
 '["deduction_discovery", "business_strategy", "expense_categorization", "tax_planning"]'::jsonb,
 ARRAY['business_expenses', 'home_office', 'vehicle', 'travel']),
('kai', 'Kai', 'Audit Advisor', 'Assesses audit risk and ensures compliance with IRS regulations',
 '["risk_assessment", "compliance_checking", "audit_preparation", "documentation_review"]'::jsonb,
 ARRAY['audit_risk', 'irs_compliance', 'documentation', 'red_flags']),
('jordan', 'Jordan', 'Tax Strategist', 'Provides personalized tax strategies and year-round planning',
 '["strategic_planning", "tax_optimization", "multi_year_planning", "entity_structuring"]'::jsonb,
 ARRAY['tax_strategy', 'retirement', 'investments', 'estate_planning'])
ON CONFLICT (agent_name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  capabilities = EXCLUDED.capabilities,
  specializations = EXCLUDED.specializations;

-- Insert deduction categories
INSERT INTO deduction_categories (name, description, category_type, irs_form) VALUES
('Home Office', 'Deduction for business use of your home', 'business', 'Form 8829'),
('Vehicle Expenses', 'Business use of your vehicle', 'business', 'Schedule C'),
('Travel Expenses', 'Business travel costs', 'business', 'Schedule C'),
('Meals & Entertainment', 'Business meals and entertainment', 'business', 'Schedule C'),
('Medical Expenses', 'Unreimbursed medical and dental expenses', 'itemized', 'Schedule A'),
('Charitable Contributions', 'Donations to qualified organizations', 'itemized', 'Schedule A'),
('State and Local Taxes', 'State and local income, sales, and property taxes', 'itemized', 'Schedule A'),
('Mortgage Interest', 'Interest paid on home mortgage', 'itemized', 'Schedule A'),
('Student Loan Interest', 'Interest paid on qualified student loans', 'standard', 'Form 1040'),
('Retirement Contributions', 'Contributions to IRA, 401(k), etc.', 'standard', 'Form 1040'),
('Health Savings Account', 'Contributions to HSA', 'standard', 'Form 8889'),
('Self-Employment Tax', 'Deduction for self-employment tax', 'business', 'Schedule SE'),
('Business Insurance', 'Insurance premiums for business', 'business', 'Schedule C'),
('Professional Services', 'Legal, accounting, consulting fees', 'business', 'Schedule C'),
('Education Expenses', 'Qualified education expenses', 'standard', 'Form 8863')
ON CONFLICT (name) DO NOTHING;

-- Insert tax deadlines for current year
INSERT INTO tax_deadlines (deadline_type, tax_year, deadline_date, description) VALUES
('federal_filing', 2024, '2025-04-15', 'Federal tax return filing deadline'),
('extension', 2024, '2025-10-15', 'Extended filing deadline (if extension filed)'),
('estimated_payment', 2024, '2024-04-15', 'Q1 estimated tax payment'),
('estimated_payment', 2024, '2024-06-17', 'Q2 estimated tax payment'),
('estimated_payment', 2024, '2024-09-16', 'Q3 estimated tax payment'),
('estimated_payment', 2024, '2025-01-15', 'Q4 estimated tax payment')
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_strategies_updated_at BEFORE UPDATE ON tax_strategies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_years_updated_at BEFORE UPDATE ON tax_years
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON ai_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user preferences on user creation
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_preferences_trigger
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_user_preferences();

-- Function to track user login
CREATE OR REPLACE FUNCTION track_user_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login_at = NOW();
  NEW.login_count = COALESCE(NEW.login_count, 0) + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON DATABASE postgres IS 'Taxu Enterprise Database - Billion-Dollar Platform Architecture';
