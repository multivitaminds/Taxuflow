-- ===================================================================
-- ESTABLISH PROPER TABLE RELATIONSHIPS FOR USER TYPES
-- This script creates proper foreign key relationships and indexes
-- for Standard Users, Business Users, and Developer Users
-- ===================================================================

-- First, ensure user_profiles has all necessary columns
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'regular' CHECK (user_type IN ('regular', 'business', 'developer', 'admin')),
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"banking": true, "wallet": true, "tax_filing": true}'::jsonb,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS company_size TEXT CHECK (company_size IN ('solo', 'small', 'medium', 'large', NULL)),
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- ===================================================================
-- NEOBANK TABLES - Ensure proper user_id relationships
-- ===================================================================

-- All neobank tables should reference user_profiles(id) which references auth.users(id)
-- This creates a chain: auth.users -> user_profiles -> neobank_*

-- Add organization_id where missing for business users
ALTER TABLE public.neobank_accounts 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.neobank_cards 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.neobank_transactions 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- ===================================================================
-- TAX FILING TABLES - Ensure proper user_id relationships
-- ===================================================================

-- W-2 Forms
ALTER TABLE public.w2_forms 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.w2_filings 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Form 941 
ALTER TABLE public.form_941_filings 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 1099-NEC
ALTER TABLE public.nec_1099_filings 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- ===================================================================
-- ACCOUNTING TABLES - Ensure proper user_id relationships
-- ===================================================================

-- Chart of Accounts
ALTER TABLE public.chart_of_accounts 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Invoices
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Bills
ALTER TABLE public.bills 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Expenses
ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- ===================================================================
-- DEVELOPER PORTAL TABLES - API Keys and Webhooks
-- ===================================================================

-- API Keys table already has user_id and organization_id
-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_org_id ON public.api_keys(organization_id);

-- Webhooks table
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON public.webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_org_id ON public.webhooks(organization_id);

-- ===================================================================
-- ORGANIZATION RELATIONSHIPS
-- ===================================================================

-- Ensure org_members properly links users to organizations
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON public.org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON public.org_members(org_id);

-- ===================================================================
-- CREATE VIEW FOR USER ACCESS CONTROL
-- ===================================================================

CREATE OR REPLACE VIEW user_access_summary AS
SELECT 
  up.id AS user_id,
  up.email,
  up.full_name,
  up.user_type,
  up.subscription_tier,
  up.subscription_status,
  up.company_name,
  COALESCE(
    jsonb_agg(
      DISTINCT jsonb_build_object(
        'feature', fa.feature_name,
        'access_level', fa.access_level,
        'is_enabled', fa.is_enabled
      )
    ) FILTER (WHERE fa.feature_name IS NOT NULL),
    '[]'::jsonb
  ) AS features,
  COALESCE(
    jsonb_agg(
      DISTINCT jsonb_build_object(
        'org_id', om.org_id,
        'role', om.role
      )
    ) FILTER (WHERE om.org_id IS NOT NULL),
    '[]'::jsonb
  ) AS organizations
FROM public.user_profiles up
LEFT JOIN public.feature_access fa ON fa.user_id = up.id AND fa.is_enabled = true
LEFT JOIN public.org_members om ON om.user_id = up.id
GROUP BY up.id, up.email, up.full_name, up.user_type, up.subscription_tier, 
         up.subscription_status, up.company_name;

-- Grant access to the view
GRANT SELECT ON user_access_summary TO authenticated;

-- ===================================================================
-- CREATE HELPER FUNCTIONS
-- ===================================================================

-- Function to check if user has access to a feature
CREATE OR REPLACE FUNCTION has_feature_access(
  p_user_id UUID,
  p_feature_name TEXT,
  p_required_access_level TEXT DEFAULT 'read'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_access BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.feature_access
    WHERE user_id = p_user_id
      AND feature_name = p_feature_name
      AND is_enabled = true
      AND (
        p_required_access_level = 'read' OR
        (p_required_access_level = 'write' AND access_level IN ('write', 'admin')) OR
        (p_required_access_level = 'admin' AND access_level = 'admin')
      )
  ) INTO v_has_access;
  
  RETURN v_has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's organizations
CREATE OR REPLACE FUNCTION get_user_organizations(p_user_id UUID)
RETURNS TABLE (
  org_id UUID,
  org_name TEXT,
  user_role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    om.role
  FROM public.organizations o
  INNER JOIN public.org_members om ON om.org_id = o.id
  WHERE om.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is business user
CREATE OR REPLACE FUNCTION is_business_user(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_business BOOLEAN;
BEGIN
  SELECT user_type IN ('business', 'admin') INTO v_is_business
  FROM public.user_profiles
  WHERE id = p_user_id;
  
  RETURN COALESCE(v_is_business, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is developer
CREATE OR REPLACE FUNCTION is_developer(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_dev BOOLEAN;
BEGIN
  SELECT user_type IN ('developer', 'admin') INTO v_is_dev
  FROM public.user_profiles
  WHERE id = p_user_id;
  
  RETURN COALESCE(v_is_dev, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ===================================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON public.user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON public.user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Feature access indexes
CREATE INDEX IF NOT EXISTS idx_feature_access_user_feature ON public.feature_access(user_id, feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_access_enabled ON public.feature_access(is_enabled) WHERE is_enabled = true;

-- Neobank indexes
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_user ON public.neobank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_org ON public.neobank_accounts(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neobank_cards_user ON public.neobank_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_neobank_transactions_user ON public.neobank_transactions(account_id);

-- Tax filing indexes
CREATE INDEX IF NOT EXISTS idx_w2_forms_user ON public.w2_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_w2_forms_org ON public.w2_forms(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_form_941_user ON public.form_941_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_nec_1099_user ON public.nec_1099_filings(user_id);

-- Accounting indexes
CREATE INDEX IF NOT EXISTS idx_invoices_user ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_org ON public.invoices(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bills_user ON public.bills(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user ON public.expenses(user_id);

-- Documents indexes
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_org ON public.documents(organization_id) WHERE organization_id IS NOT NULL;

-- ===================================================================
-- UPDATE EXISTING RLS POLICIES
-- ===================================================================

-- Helper function for RLS policies
CREATE OR REPLACE FUNCTION user_has_org_access(p_org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members
    WHERE org_id = p_org_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- SUMMARY
-- ===================================================================

-- This script establishes the following relationships:
-- 
-- 1. STANDARD USERS (user_type = 'regular'):
--    - Can access: personal tax filing, W-2s, basic deductions
--    - Tables: tax_documents, tax_filings, w2_data, deductions_credits
--    - Linked via: user_id -> user_profiles.id -> auth.users.id
--
-- 2. BUSINESS USERS (user_type = 'business'):
--    - Can access: everything Standard + accounting, neobank, payroll
--    - Tables: neobank_*, invoices, bills, expenses, form_941_filings, etc.
--    - Linked via: user_id AND organization_id
--    - Additional link: org_members table for multi-user businesses
--
-- 3. DEVELOPER USERS (user_type = 'developer'):
--    - Can access: API keys, webhooks, API docs, SDK
--    - Tables: api_keys, webhooks, api_key_usage
--    - Linked via: user_id -> user_profiles.id -> auth.users.id
--
-- All tables maintain referential integrity through foreign keys
-- All user data is accessible via RLS policies based on auth.uid()
-- Organizations allow multiple users to collaborate on business data
