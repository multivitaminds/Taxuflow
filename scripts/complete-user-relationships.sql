-- ===================================================================
-- COMPLETE USER RELATIONSHIPS SETUP
-- Run this script in order - creates all necessary tables and relationships
-- for Standard Users, Business Users, and Developer Users
-- ===================================================================

-- Step 1: Ensure user_profiles has all necessary columns
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

-- Step 2: Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL CHECK (role_name IN ('user', 'business_user', 'developer', 'admin', 'super_admin')),
  permissions JSONB DEFAULT '{}'::jsonb,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_name)
);

-- Step 3: Create feature_access table
CREATE TABLE IF NOT EXISTS public.feature_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  access_level TEXT CHECK (access_level IN ('none', 'read', 'write', 'admin')),
  granted_by_subscription BOOLEAN DEFAULT false,
  granted_by_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_name)
);

-- Step 4: Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_access ENABLE ROW LEVEL SECURITY;

-- Step 5: RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Step 6: RLS Policies for feature_access
DROP POLICY IF EXISTS "Users can view their own feature access" ON public.feature_access;
CREATE POLICY "Users can view their own feature access"
  ON public.feature_access FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own feature access" ON public.feature_access;
CREATE POLICY "Users can manage their own feature access"
  ON public.feature_access FOR ALL
  USING (auth.uid() = user_id);

-- Step 7: Create indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_name ON public.user_roles(role_name);
CREATE INDEX IF NOT EXISTS idx_feature_access_user_id ON public.feature_access(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_access_user_feature ON public.feature_access(user_id, feature_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON public.user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON public.user_profiles(subscription_tier);

-- Step 8: Add organization relationships
ALTER TABLE public.neobank_accounts 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.neobank_cards 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.neobank_transactions 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.w2_forms 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.w2_filings 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.form_941_filings 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.nec_1099_filings 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Step 9: Create helper functions
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

-- Step 10: Create trigger function for subscription-based features
CREATE OR REPLACE FUNCTION grant_features_for_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Clear existing subscription-granted features
  DELETE FROM public.feature_access 
  WHERE user_id = NEW.id AND granted_by_subscription = true;
  
  -- Grant features based on subscription tier
  CASE NEW.subscription_tier
    WHEN 'free' THEN
      INSERT INTO public.feature_access (user_id, feature_name, access_level, granted_by_subscription)
      VALUES 
        (NEW.id, 'w2_filing', 'write', true),
        (NEW.id, 'basic_deductions', 'write', true),
        (NEW.id, 'refund_tracking', 'read', true)
      ON CONFLICT (user_id, feature_name) DO NOTHING;
        
    WHEN 'premium' THEN
      INSERT INTO public.feature_access (user_id, feature_name, access_level, granted_by_subscription)
      VALUES 
        (NEW.id, 'w2_filing', 'write', true),
        (NEW.id, 'itemized_deductions', 'write', true),
        (NEW.id, '1099_filing', 'write', true),
        (NEW.id, 'state_filing', 'write', true),
        (NEW.id, 'investment_income', 'write', true)
      ON CONFLICT (user_id, feature_name) DO NOTHING;
        
    WHEN 'business-filing' THEN
      INSERT INTO public.feature_access (user_id, feature_name, access_level, granted_by_subscription)
      VALUES 
        (NEW.id, 'schedule_c', 'write', true),
        (NEW.id, '1099_management', 'write', true),
        (NEW.id, 'quarterly_estimates', 'write', true),
        (NEW.id, 'expense_tracking', 'write', true),
        (NEW.id, 'accounting', 'write', true),
        (NEW.id, 'banking', 'write', true),
        (NEW.id, 'wallet', 'write', true)
      ON CONFLICT (user_id, feature_name) DO NOTHING;
        
    ELSE
      NULL;
  END CASE;
  
  -- Grant developer features if user_type is developer
  IF NEW.user_type = 'developer' THEN
    INSERT INTO public.feature_access (user_id, feature_name, access_level, granted_by_subscription)
    VALUES 
      (NEW.id, 'api_keys', 'write', true),
      (NEW.id, 'api_docs', 'read', true),
      (NEW.id, 'webhooks', 'write', true),
      (NEW.id, 'sdk_access', 'read', true),
      (NEW.id, 'developer_portal', 'write', true)
    ON CONFLICT (user_id, feature_name) DO NOTHING;
  END IF;
  
  -- Grant business features if user_type is business
  IF NEW.user_type = 'business' THEN
    INSERT INTO public.feature_access (user_id, feature_name, access_level, granted_by_subscription)
    VALUES 
      (NEW.id, 'accounting', 'write', true),
      (NEW.id, 'banking', 'write', true),
      (NEW.id, 'wallet', 'write', true),
      (NEW.id, 'employee_management', 'write', true),
      (NEW.id, 'payroll', 'write', true)
    ON CONFLICT (user_id, feature_name) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Create trigger
DROP TRIGGER IF EXISTS on_subscription_change ON public.user_profiles;
CREATE TRIGGER on_subscription_change
  AFTER INSERT OR UPDATE OF subscription_tier, user_type ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION grant_features_for_subscription();

-- Step 12: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_neobank_accounts_org ON public.neobank_accounts(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neobank_cards_org ON public.neobank_cards(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neobank_transactions_org ON public.neobank_transactions(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_w2_forms_org ON public.w2_forms(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_w2_filings_org ON public.w2_filings(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_form_941_org ON public.form_941_filings(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nec_1099_org ON public.nec_1099_filings(organization_id) WHERE organization_id IS NOT NULL;

-- Step 13: Update existing user profiles to trigger feature grants
UPDATE public.user_profiles SET updated_at = NOW() WHERE updated_at IS NOT NULL OR updated_at IS NULL;

-- Done!
SELECT 'User relationships setup complete!' AS status;
