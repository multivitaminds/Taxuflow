-- ============================================================================
-- Mercury-Style Registration Schema for Taxu
-- Run this script in Supabase SQL Editor
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. REGISTRATION APPLICATIONS TABLE
-- Main table tracking the complete registration process
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.registration_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Application metadata
  application_number TEXT UNIQUE NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step >= 1 AND current_step <= 10),
  completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'in_progress', 'submitted', 'under_review', 'approved', 'rejected', 'completed')
  ),
  
  -- Important dates
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Review information
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  admin_notes TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. OWNERSHIP DETAILS TABLE
-- Step 1: Business owner/representative information
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.application_ownership_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  job_title TEXT NOT NULL,
  ownership_percentage NUMERIC(5,2) CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
  
  -- Step completion
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. CITIZENSHIP & IDENTITY TABLE  
-- Step 2: Citizenship status, phone, DOB
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.application_citizenship_identity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Citizenship
  citizenship_status TEXT NOT NULL CHECK (
    citizenship_status IN ('us_citizen', 'permanent_resident', 'work_visa', 'other')
  ),
  country_of_citizenship TEXT,
  
  -- Contact
  phone TEXT NOT NULL,
  phone_verified BOOLEAN DEFAULT false,
  phone_verified_at TIMESTAMPTZ,
  
  -- Identity
  date_of_birth DATE NOT NULL,
  
  -- Step completion
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. RESIDENTIAL ADDRESSES TABLE
-- Step 3: Home address with validation warnings
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.application_residential_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Address fields
  street_address TEXT NOT NULL,
  apartment_unit TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  
  -- Validation flags
  is_po_box BOOLEAN DEFAULT false,
  is_mail_center BOOLEAN DEFAULT false,
  validation_warnings TEXT[],
  
  -- Step completion
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. IDENTITY VERIFICATION TABLE
-- Step 4: Socure-style identity verification
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.application_identity_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Verification status
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'in_progress', 'verified', 'failed', 'manual_review')
  ),
  
  -- Verification details
  verification_provider TEXT DEFAULT 'socure',
  verification_session_id TEXT,
  verification_score NUMERIC(5,2),
  
  -- Results
  identity_confirmed BOOLEAN DEFAULT false,
  fraud_signals JSONB DEFAULT '[]',
  verification_completed_at TIMESTAMPTZ,
  
  -- Step completion
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. PLATFORM SELECTIONS TABLE
-- Step 5: Choose which Taxu platforms to activate
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.application_platform_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Platform selections
  neobank_enabled BOOLEAN DEFAULT false,
  investment_enabled BOOLEAN DEFAULT false,
  accounting_enabled BOOLEAN DEFAULT false,
  tax_filing_enabled BOOLEAN DEFAULT false,
  
  -- Platform-specific configuration
  neobank_config JSONB DEFAULT '{}',
  investment_config JSONB DEFAULT '{}',
  accounting_config JSONB DEFAULT '{}',
  tax_filing_config JSONB DEFAULT '{}',
  
  -- Step completion
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. COMPANY INFORMATION TABLE
-- Step 6: Business details and EIN
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.application_company_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Company details
  company_name TEXT NOT NULL,
  legal_entity_type TEXT CHECK (
    legal_entity_type IN ('sole_proprietor', 'llc', 'c_corp', 's_corp', 'partnership', 'other')
  ),
  ein TEXT NOT NULL,
  ein_verified BOOLEAN DEFAULT false,
  
  -- Business information
  industry TEXT NOT NULL,
  industry_code TEXT,
  website_url TEXT,
  business_description TEXT,
  year_established INTEGER,
  employee_count_range TEXT,
  
  -- Step completion
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. COMPANY ADDRESSES TABLE
-- Step 7: Physical business address
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.application_company_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Business address
  street_address TEXT NOT NULL,
  apartment_suite TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  
  -- Same as residential flag
  same_as_residential BOOLEAN DEFAULT false,
  
  -- Validation
  is_po_box BOOLEAN DEFAULT false,
  is_virtual_office BOOLEAN DEFAULT false,
  validation_warnings TEXT[],
  
  -- Step completion
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. EXPECTED ACTIVITY TABLE
-- Step 8: Banking compliance and transaction estimates
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.application_expected_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Deposit sources (multi-select)
  deposit_sources TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Account usage purposes
  account_usage_purposes TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Financial projections
  expected_monthly_balance_range TEXT,
  expected_monthly_transactions_range TEXT,
  expected_monthly_volume_range TEXT,
  
  -- International activity
  operates_internationally BOOLEAN DEFAULT false,
  operating_countries TEXT[],
  
  -- Transaction details
  sends_receives_international BOOLEAN DEFAULT false,
  international_countries TEXT[],
  
  -- Step completion
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. DOCUMENTS TABLE
-- Step 9: Formation documents and EIN verification
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Document details
  document_type TEXT NOT NULL CHECK (
    document_type IN ('formation', 'ein_letter', 'operating_agreement', 'other')
  ),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER,
  mime_type TEXT,
  
  -- Verification
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'verified', 'rejected', 'needs_reupload')
  ),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 11. REVIEW NOTES TABLE
-- Step 10: Admin review and communication
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.application_review_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  
  -- Note details
  note_type TEXT NOT NULL CHECK (
    note_type IN ('admin_note', 'applicant_response', 'system_note', 'status_change')
  ),
  note_text TEXT NOT NULL,
  is_visible_to_applicant BOOLEAN DEFAULT false,
  
  -- Metadata
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Registration applications indexes
CREATE INDEX idx_registration_applications_user_id ON public.registration_applications(user_id);
CREATE INDEX idx_registration_applications_status ON public.registration_applications(status);
CREATE INDEX idx_registration_applications_created_at ON public.registration_applications(created_at DESC);
CREATE INDEX idx_registration_applications_application_number ON public.registration_applications(application_number);

-- Ownership details indexes
CREATE INDEX idx_ownership_details_application_id ON public.application_ownership_details(application_id);
CREATE INDEX idx_ownership_details_user_id ON public.application_ownership_details(user_id);

-- Citizenship identity indexes
CREATE INDEX idx_citizenship_identity_application_id ON public.application_citizenship_identity(application_id);

-- Residential addresses indexes
CREATE INDEX idx_residential_addresses_application_id ON public.application_residential_addresses(application_id);

-- Identity verifications indexes
CREATE INDEX idx_identity_verifications_application_id ON public.application_identity_verifications(application_id);
CREATE INDEX idx_identity_verifications_status ON public.application_identity_verifications(verification_status);

-- Platform selections indexes
CREATE INDEX idx_platform_selections_application_id ON public.application_platform_selections(application_id);

-- Company info indexes
CREATE INDEX idx_company_info_application_id ON public.application_company_info(application_id);
CREATE INDEX idx_company_info_ein ON public.application_company_info(ein);

-- Company addresses indexes
CREATE INDEX idx_company_addresses_application_id ON public.application_company_addresses(application_id);

-- Expected activity indexes
CREATE INDEX idx_expected_activity_application_id ON public.application_expected_activity(application_id);

-- Documents indexes
CREATE INDEX idx_documents_application_id ON public.application_documents(application_id);
CREATE INDEX idx_documents_type ON public.application_documents(document_type);
CREATE INDEX idx_documents_verification_status ON public.application_documents(verification_status);

-- Review notes indexes
CREATE INDEX idx_review_notes_application_id ON public.application_review_notes(application_id);
CREATE INDEX idx_review_notes_created_at ON public.application_review_notes(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.registration_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_ownership_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_citizenship_identity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_residential_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_platform_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_company_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_expected_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_review_notes ENABLE ROW LEVEL SECURITY;

-- Registration applications policies
CREATE POLICY "Users can view own applications"
  ON public.registration_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON public.registration_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON public.registration_applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Ownership details policies
CREATE POLICY "Users can manage own ownership details"
  ON public.application_ownership_details FOR ALL
  USING (auth.uid() = user_id);

-- Citizenship identity policies
CREATE POLICY "Users can manage own citizenship identity"
  ON public.application_citizenship_identity FOR ALL
  USING (auth.uid() = user_id);

-- Residential addresses policies
CREATE POLICY "Users can manage own residential addresses"
  ON public.application_residential_addresses FOR ALL
  USING (auth.uid() = user_id);

-- Identity verifications policies
CREATE POLICY "Users can manage own identity verifications"
  ON public.application_identity_verifications FOR ALL
  USING (auth.uid() = user_id);

-- Platform selections policies
CREATE POLICY "Users can manage own platform selections"
  ON public.application_platform_selections FOR ALL
  USING (auth.uid() = user_id);

-- Company info policies
CREATE POLICY "Users can manage own company info"
  ON public.application_company_info FOR ALL
  USING (auth.uid() = user_id);

-- Company addresses policies
CREATE POLICY "Users can manage own company addresses"
  ON public.application_company_addresses FOR ALL
  USING (auth.uid() = user_id);

-- Expected activity policies
CREATE POLICY "Users can manage own expected activity"
  ON public.application_expected_activity FOR ALL
  USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can manage own documents"
  ON public.application_documents FOR ALL
  USING (auth.uid() = user_id);

-- Review notes policies
CREATE POLICY "Users can view notes for their applications"
  ON public.application_review_notes FOR SELECT
  USING (
    application_id IN (
      SELECT id FROM public.registration_applications
      WHERE user_id = auth.uid()
    ) AND (is_visible_to_applicant = true OR created_by = auth.uid())
  );

CREATE POLICY "Users can insert notes on their applications"
  ON public.application_review_notes FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    application_id IN (
      SELECT id FROM public.registration_applications
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to generate unique application number
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    new_number := 'TAXU-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((FLOOR(RANDOM() * 10000))::TEXT, 4, '0');
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.registration_applications
      WHERE application_number = new_number
    );
    counter := counter + 1;
    IF counter > 100 THEN
      RAISE EXCEPTION 'Could not generate unique application number';
    END IF;
  END LOOP;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate application progress percentage
CREATE OR REPLACE FUNCTION calculate_application_progress(app_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_steps INTEGER := 10;
  completed INTEGER := 0;
BEGIN
  -- Count completed steps
  SELECT COALESCE(array_length(completed_steps, 1), 0)
  INTO completed
  FROM public.registration_applications
  WHERE id = app_id;
  
  RETURN (completed * 100 / total_steps);
END;
$$ LANGUAGE plpgsql;

-- Function to check if application is ready for submission
CREATE OR REPLACE FUNCTION is_application_ready_for_submission(app_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  all_steps_complete BOOLEAN;
BEGIN
  SELECT
    od.is_complete AND
    ci.is_complete AND
    ra.is_complete AND
    iv.is_complete AND
    ps.is_complete AND
    co.is_complete AND
    ca.is_complete AND
    ea.is_complete AND
    EXISTS (
      SELECT 1 FROM public.application_documents
      WHERE application_id = app_id
      AND document_type = 'formation'
      AND verification_status IN ('pending', 'verified')
    )
  INTO all_steps_complete
  FROM public.registration_applications app
  LEFT JOIN public.application_ownership_details od ON od.application_id = app.id
  LEFT JOIN public.application_citizenship_identity ci ON ci.application_id = app.id
  LEFT JOIN public.application_residential_addresses ra ON ra.application_id = app.id
  LEFT JOIN public.application_identity_verifications iv ON iv.application_id = app.id
  LEFT JOIN public.application_platform_selections ps ON ps.application_id = app.id
  LEFT JOIN public.application_company_info co ON co.application_id = app.id
  LEFT JOIN public.application_company_addresses ca ON ca.application_id = app.id
  LEFT JOIN public.application_expected_activity ea ON ea.application_id = app.id
  WHERE app.id = app_id;
  
  RETURN COALESCE(all_steps_complete, false);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_registration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER registration_applications_updated_at
  BEFORE UPDATE ON public.registration_applications
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER ownership_details_updated_at
  BEFORE UPDATE ON public.application_ownership_details
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER citizenship_identity_updated_at
  BEFORE UPDATE ON public.application_citizenship_identity
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER residential_addresses_updated_at
  BEFORE UPDATE ON public.application_residential_addresses
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER identity_verifications_updated_at
  BEFORE UPDATE ON public.application_identity_verifications
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER platform_selections_updated_at
  BEFORE UPDATE ON public.application_platform_selections
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER company_info_updated_at
  BEFORE UPDATE ON public.application_company_info
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER company_addresses_updated_at
  BEFORE UPDATE ON public.application_company_addresses
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER expected_activity_updated_at
  BEFORE UPDATE ON public.application_expected_activity
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON public.application_documents
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

-- Trigger to auto-generate application number
CREATE OR REPLACE FUNCTION set_application_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_number IS NULL THEN
    NEW.application_number := generate_application_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_application_number_trigger
  BEFORE INSERT ON public.registration_applications
  FOR EACH ROW EXECUTE FUNCTION set_application_number();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$ 
BEGIN
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'Mercury-Style Registration Schema Created Successfully!';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'Tables created: 11';
  RAISE NOTICE 'Indexes created: 20+';
  RAISE NOTICE 'RLS policies: Enabled on all tables';
  RAISE NOTICE 'Helper functions: 3';
  RAISE NOTICE 'Triggers: 12';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Test the schema with sample data';
  RAISE NOTICE '2. Update your frontend registration flow';
  RAISE NOTICE '3. Configure document upload with Vercel Blob';
  RAISE NOTICE '==========================================================';
END $$;
