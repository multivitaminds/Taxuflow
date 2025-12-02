-- Add user_type and role columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'regular' CHECK (user_type IN ('regular', 'business', 'developer', 'admin')),
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"banking": true, "wallet": true, "tax_filing": true}'::jsonb,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS company_size TEXT CHECK (company_size IN ('solo', 'small', 'medium', 'large', NULL)),
ADD COLUMN IF NOT EXISTS industry TEXT;

-- Create user_roles table for more complex role management
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

-- Create feature_access table to track what features each user can access
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

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- RLS Policies for feature_access
CREATE POLICY "Users can view their own feature access"
  ON public.feature_access FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own feature access"
  ON public.feature_access FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_name ON public.user_roles(role_name);
CREATE INDEX IF NOT EXISTS idx_feature_access_user_id ON public.feature_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON public.user_profiles(user_type);

-- Function to grant features based on subscription tier
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
        (NEW.id, 'refund_tracking', 'read', true);
        
    WHEN 'premium' THEN
      INSERT INTO public.feature_access (user_id, feature_name, access_level, granted_by_subscription)
      VALUES 
        (NEW.id, 'w2_filing', 'write', true),
        (NEW.id, 'itemized_deductions', 'write', true),
        (NEW.id, '1099_filing', 'write', true),
        (NEW.id, 'state_filing', 'write', true),
        (NEW.id, 'investment_income', 'write', true);
        
    WHEN 'ai-copilot' THEN
      INSERT INTO public.feature_access (user_id, feature_name, access_level, granted_by_subscription)
      VALUES 
        (NEW.id, 'w2_filing', 'write', true),
        (NEW.id, 'itemized_deductions', 'write', true),
        (NEW.id, '1099_filing', 'write', true),
        (NEW.id, 'state_filing', 'write', true),
        (NEW.id, 'ai_assistant', 'write', true),
        (NEW.id, 'receipt_scanning', 'write', true),
        (NEW.id, 'quarterly_estimates', 'write', true);
        
    WHEN 'business-filing' THEN
      INSERT INTO public.feature_access (user_id, feature_name, access_level, granted_by_subscription)
      VALUES 
        (NEW.id, 'schedule_c', 'write', true),
        (NEW.id, '1099_management', 'write', true),
        (NEW.id, 'quarterly_estimates', 'write', true),
        (NEW.id, 'expense_tracking', 'write', true),
        (NEW.id, 'accounting', 'write', true),
        (NEW.id, 'banking', 'write', true),
        (NEW.id, 'wallet', 'write', true);
        
    WHEN 'audit-shield-pro' THEN
      INSERT INTO public.feature_access (user_id, feature_name, access_level, granted_by_subscription)
      VALUES 
        (NEW.id, 'audit_protection', 'write', true),
        (NEW.id, 'tax_professional_support', 'write', true),
        (NEW.id, 'irs_representation', 'write', true),
        (NEW.id, 'accounting', 'write', true),
        (NEW.id, 'banking', 'write', true);
    ELSE
      -- Default features for unknown tiers
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

-- Create trigger
DROP TRIGGER IF EXISTS on_subscription_change ON public.user_profiles;
CREATE TRIGGER on_subscription_change
  AFTER INSERT OR UPDATE OF subscription_tier, user_type ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION grant_features_for_subscription();

-- Update existing user profiles to trigger feature grants
UPDATE public.user_profiles SET updated_at = NOW();
