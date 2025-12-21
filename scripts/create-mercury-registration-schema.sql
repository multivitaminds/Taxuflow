-- =====================================================
-- TAXU REGISTRATION SCHEMA
-- Mercury-style comprehensive registration flow
-- Supports: Multi-step application, identity verification,
-- platform selection, document uploads, and approval workflow
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. REGISTRATION APPLICATIONS TABLE
-- Main table tracking the overall registration process
-- =====================================================

CREATE TABLE IF NOT EXISTS public.registration_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Application Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft',           -- User is filling out the application
    'submitted',       -- Application submitted, pending review
    'under_review',    -- Being reviewed by admin
    'approved',        -- Approved, account being created
    'completed',       -- Account created successfully
    'rejected',        -- Application rejected
    'more_info_needed' -- Additional information required
  )),
  
  -- Progress Tracking
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 10,
  completed_steps JSONB DEFAULT '[]',
  
  -- Application Type (can be individual or business)
  application_type TEXT DEFAULT 'business' CHECK (application_type IN ('individual', 'business')),
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Review Information
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  admin_notes TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. OWNERSHIP DETAILS TABLE
-- Stores information about business owners
-- =====================================================

CREATE TABLE IF NOT EXISTS public.application_ownership_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE,
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  job_title TEXT,
  ownership_percentage NUMERIC(5, 2) CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
  
  -- Identity Information
  date_of_birth DATE,
  ssn_last_4 TEXT,
  ssn_encrypted TEXT, -- Full SSN encrypted
  phone TEXT,
  
  -- Citizenship & Identity
  citizenship_status TEXT CHECK (citizenship_status IN (
    'us_citizen',
    'permanent_resident',
    'visa_holder',
    'other'
  )),
  passport_country TEXT,
  
  -- Is Primary Contact
  is_primary BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. RESIDENTIAL ADDRESS TABLE
-- Stores owner residential addresses
-- =====================================================

CREATE TABLE IF NOT EXISTS public.application_residential_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ownership_detail_id UUID NOT NULL REFERENCES public.application_ownership_details(id) ON DELETE CASCADE,
  
  -- Address Fields
  street_address TEXT NOT NULL,
  apartment_suite TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'United States',
  
  -- Validation Flags
  is_po_box BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. IDENTITY VERIFICATION TABLE
-- Tracks identity verification status (Socure-style)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.application_identity_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE,
  ownership_detail_id UUID REFERENCES public.application_ownership_details(id) ON DELETE CASCADE,
  
  -- Verification Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',       -- Verification not started
    'in_progress',   -- Verification in progress
    'verified',      -- Successfully verified
    'failed',        -- Verification failed
    'manual_review'  -- Needs manual review
  )),
  
  -- Verification Method
  verification_method TEXT CHECK (verification_method IN (
    'socure',
    'plaid',
    'manual',
    'document_upload'
  )),
  
  -- Verification Data
  verification_session_id TEXT,
  verification_score NUMERIC(5, 2), -- 0-100 confidence score
  verification_details JSONB DEFAULT '{}',
  
  -- Risk Assessment
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  fraud_flags JSONB DEFAULT '[]',
  
  -- Timestamps
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. PLATFORM SELECTIONS TABLE
-- Tracks which Taxu platforms user wants to access
-- =====================================================

CREATE TABLE IF NOT EXISTS public.application_platform_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE,
  
  -- Platform Selections (All four Taxu platforms)
  neobank_enabled BOOLEAN DEFAULT false,
  investment_enabled BOOLEAN DEFAULT false,
  accounting_enabled BOOLEAN DEFAULT false,
  tax_filing_enabled BOOLEAN DEFAULT false,
  
  -- Platform-Specific Settings
  neobank_account_types TEXT[], -- ['checking', 'savings', 'tax_bucket']
  investment_preferences JSONB DEFAULT '{}', -- risk tolerance, goals, etc.
  accounting_features TEXT[], -- ['invoicing', 'expenses', 'reports']
  tax_filing_types TEXT[], -- ['1099', 'W2', '941', 'W9']
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. COMPANY INFORMATION TABLE
-- Stores business details
-- =====================================================

CREATE TABLE IF NOT EXISTS public.application_company_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE,
  
  -- Basic Company Info
  legal_name TEXT NOT NULL,
  doing_business_as TEXT,
  ein TEXT NOT NULL,
  
  -- Business Details
  industry TEXT,
  business_type TEXT CHECK (business_type IN (
    'llc',
    'corporation',
    'partnership',
    's_corp',
    'c_corp',
    'sole_proprietorship',
    'nonprofit'
  )),
  formation_date DATE,
  formation_state TEXT,
  
  -- Contact Information
  website TEXT,
  phone TEXT,
  email TEXT,
  
  -- Business Description
  description TEXT,
  number_of_employees INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. COMPANY ADDRESS TABLE
-- Stores physical business address
-- =====================================================

CREATE TABLE IF NOT EXISTS public.application_company_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_info_id UUID NOT NULL REFERENCES public.application_company_info(id) ON DELETE CASCADE,
  
  -- Address Type
  address_type TEXT DEFAULT 'physical' CHECK (address_type IN ('physical', 'mailing', 'both')),
  
  -- Address Fields
  street_address TEXT NOT NULL,
  apartment_suite TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'United States',
  
  -- Validation Flags
  is_verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. EXPECTED ACTIVITY TABLE
-- Stores expected account usage patterns
-- =====================================================

CREATE TABLE IF NOT EXISTS public.application_expected_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE,
  
  -- Deposit Information
  deposit_sources TEXT[] DEFAULT '{}', -- ['investors', 'revenue', 'self']
  expected_monthly_deposits TEXT CHECK (expected_monthly_deposits IN (
    '0-10k',
    '10k-100k',
    '100k-1m',
    '1m-10m',
    '10m+'
  )),
  
  -- Account Usage
  account_purpose TEXT[] DEFAULT '{}', -- ['operating_expenses', 'receiving_funds', etc.]
  
  -- Transaction Volume
  expected_monthly_transactions TEXT CHECK (expected_monthly_transactions IN (
    '0-10k',
    '10k-100k',
    '100k-1m',
    '1m-10m',
    '10m+'
  )),
  
  -- International Operations
  operates_internationally BOOLEAN DEFAULT false,
  international_countries TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. DOCUMENT UPLOADS TABLE
-- Stores uploaded documents for verification
-- =====================================================

CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE,
  
  -- Document Type
  document_type TEXT NOT NULL CHECK (document_type IN (
    'formation_document',
    'ein_letter',
    'identity_document',
    'proof_of_address',
    'financial_statement',
    'business_license',
    'other'
  )),
  
  -- File Information
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL, -- Blob storage URL
  file_size INTEGER,
  mime_type TEXT,
  
  -- Verification Status
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN (
    'pending',
    'approved',
    'rejected',
    'more_info_needed'
  )),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  verification_notes TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. APPLICATION REVIEW NOTES TABLE
-- Admin notes and communication during review
-- =====================================================

CREATE TABLE IF NOT EXISTS public.application_review_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.registration_applications(id) ON DELETE CASCADE,
  
  -- Note Details
  note_type TEXT DEFAULT 'internal' CHECK (note_type IN (
    'internal',          -- Internal admin note
    'user_communication', -- Message to user
    'status_change'      -- Status change log
  )),
  
  content TEXT NOT NULL,
  
  -- Author
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Visibility
  visible_to_user BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Registration Applications
CREATE INDEX IF NOT EXISTS idx_reg_apps_user_id ON public.registration_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_reg_apps_status ON public.registration_applications(status);
CREATE INDEX IF NOT EXISTS idx_reg_apps_submitted_at ON public.registration_applications(submitted_at);

-- Ownership Details
CREATE INDEX IF NOT EXISTS idx_ownership_app_id ON public.application_ownership_details(application_id);
CREATE INDEX IF NOT EXISTS idx_ownership_email ON public.application_ownership_details(email);

-- Addresses
CREATE INDEX IF NOT EXISTS idx_res_addr_ownership_id ON public.application_residential_addresses(ownership_detail_id);
CREATE INDEX IF NOT EXISTS idx_company_addr_company_id ON public.application_company_addresses(company_info_id);

-- Identity Verifications
CREATE INDEX IF NOT EXISTS idx_identity_ver_app_id ON public.application_identity_verifications(application_id);
CREATE INDEX IF NOT EXISTS idx_identity_ver_status ON public.application_identity_verifications(status);

-- Platform Selections
CREATE INDEX IF NOT EXISTS idx_platform_sel_app_id ON public.application_platform_selections(application_id);

-- Company Information
CREATE INDEX IF NOT EXISTS idx_company_info_app_id ON public.application_company_info(application_id);
CREATE INDEX IF NOT EXISTS idx_company_info_ein ON public.application_company_info(ein);

-- Expected Activity
CREATE INDEX IF NOT EXISTS idx_expected_activity_app_id ON public.application_expected_activity(application_id);

-- Documents
CREATE INDEX IF NOT EXISTS idx_app_docs_app_id ON public.application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_app_docs_type ON public.application_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_app_docs_status ON public.application_documents(verification_status);

-- Review Notes
CREATE INDEX IF NOT EXISTS idx_review_notes_app_id ON public.application_review_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_review_notes_created_by ON public.application_review_notes(created_by);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.registration_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_ownership_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_residential_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_platform_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_company_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_expected_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_review_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for registration_applications
CREATE POLICY "Users can view own applications" 
  ON public.registration_applications
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" 
  ON public.registration_applications
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own draft applications" 
  ON public.registration_applications
  FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'draft');

CREATE POLICY "Admins can view all applications" 
  ON public.registration_applications
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all applications" 
  ON public.registration_applications
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for ownership_details (users access via application)
CREATE POLICY "Users can manage ownership details for their applications" 
  ON public.application_ownership_details
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.registration_applications
      WHERE registration_applications.id = application_ownership_details.application_id
      AND registration_applications.user_id = auth.uid()
    )
  );

-- RLS Policies for residential_addresses
CREATE POLICY "Users can manage addresses for their ownership details" 
  ON public.application_residential_addresses
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.application_ownership_details
      JOIN public.registration_applications ON registration_applications.id = application_ownership_details.application_id
      WHERE application_ownership_details.id = application_residential_addresses.ownership_detail_id
      AND registration_applications.user_id = auth.uid()
    )
  );

-- RLS Policies for identity_verifications
CREATE POLICY "Users can view their identity verifications" 
  ON public.application_identity_verifications
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.registration_applications
      WHERE registration_applications.id = application_identity_verifications.application_id
      AND registration_applications.user_id = auth.uid()
    )
  );

-- RLS Policies for platform_selections
CREATE POLICY "Users can manage platform selections" 
  ON public.application_platform_selections
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.registration_applications
      WHERE registration_applications.id = application_platform_selections.application_id
      AND registration_applications.user_id = auth.uid()
    )
  );

-- RLS Policies for company_info
CREATE POLICY "Users can manage company info" 
  ON public.application_company_info
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.registration_applications
      WHERE registration_applications.id = application_company_info.application_id
      AND registration_applications.user_id = auth.uid()
    )
  );

-- RLS Policies for company_addresses
CREATE POLICY "Users can manage company addresses" 
  ON public.application_company_addresses
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.application_company_info
      JOIN public.registration_applications ON registration_applications.id = application_company_info.application_id
      WHERE application_company_info.id = application_company_addresses.company_info_id
      AND registration_applications.user_id = auth.uid()
    )
  );

-- RLS Policies for expected_activity
CREATE POLICY "Users can manage expected activity" 
  ON public.application_expected_activity
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.registration_applications
      WHERE registration_applications.id = application_expected_activity.application_id
      AND registration_applications.user_id = auth.uid()
    )
  );

-- RLS Policies for documents
CREATE POLICY "Users can manage their documents" 
  ON public.application_documents
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.registration_applications
      WHERE registration_applications.id = application_documents.application_id
      AND registration_applications.user_id = auth.uid()
    )
  );

-- RLS Policies for review_notes
CREATE POLICY "Users can view user-visible notes" 
  ON public.application_review_notes
  FOR SELECT 
  USING (
    visible_to_user = true
    AND EXISTS (
      SELECT 1 FROM public.registration_applications
      WHERE registration_applications.id = application_review_notes.application_id
      AND registration_applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all review notes" 
  ON public.application_review_notes
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_registration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_reg_apps_updated_at
  BEFORE UPDATE ON public.registration_applications
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER update_ownership_details_updated_at
  BEFORE UPDATE ON public.application_ownership_details
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER update_res_addr_updated_at
  BEFORE UPDATE ON public.application_residential_addresses
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER update_identity_ver_updated_at
  BEFORE UPDATE ON public.application_identity_verifications
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER update_platform_sel_updated_at
  BEFORE UPDATE ON public.application_platform_selections
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER update_company_info_updated_at
  BEFORE UPDATE ON public.application_company_info
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER update_company_addr_updated_at
  BEFORE UPDATE ON public.application_company_addresses
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER update_expected_activity_updated_at
  BEFORE UPDATE ON public.application_expected_activity
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER update_app_docs_updated_at
  BEFORE UPDATE ON public.application_documents
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER update_review_notes_updated_at
  BEFORE UPDATE ON public.application_review_notes
  FOR EACH ROW EXECUTE FUNCTION update_registration_updated_at();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get application progress percentage
CREATE OR REPLACE FUNCTION get_application_progress(app_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completed INTEGER;
  total INTEGER;
BEGIN
  SELECT current_step, total_steps 
  INTO completed, total
  FROM public.registration_applications
  WHERE id = app_id;
  
  IF total = 0 OR total IS NULL THEN
    RETURN 0;
  END IF;
  
  RETURN (completed * 100 / total);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if application is complete
CREATE OR REPLACE FUNCTION is_application_complete(app_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_ownership BOOLEAN;
  has_address BOOLEAN;
  has_identity BOOLEAN;
  has_platform BOOLEAN;
  has_company BOOLEAN;
  has_activity BOOLEAN;
  has_documents BOOLEAN;
BEGIN
  -- Check if all required sections are filled
  SELECT 
    EXISTS(SELECT 1 FROM public.application_ownership_details WHERE application_id = app_id),
    EXISTS(SELECT 1 FROM public.application_residential_addresses ra 
           JOIN public.application_ownership_details od ON od.id = ra.ownership_detail_id
           WHERE od.application_id = app_id),
    EXISTS(SELECT 1 FROM public.application_identity_verifications WHERE application_id = app_id),
    EXISTS(SELECT 1 FROM public.application_platform_selections WHERE application_id = app_id),
    EXISTS(SELECT 1 FROM public.application_company_info WHERE application_id = app_id),
    EXISTS(SELECT 1 FROM public.application_expected_activity WHERE application_id = app_id),
    EXISTS(SELECT 1 FROM public.application_documents WHERE application_id = app_id 
           AND document_type IN ('formation_document', 'ein_letter'))
  INTO has_ownership, has_address, has_identity, has_platform, has_company, has_activity, has_documents;
  
  RETURN has_ownership AND has_address AND has_identity AND has_platform 
         AND has_company AND has_activity AND has_documents;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.registration_applications IS 'Main table tracking Mercury-style registration applications';
COMMENT ON TABLE public.application_ownership_details IS 'Stores business owner information for applications';
COMMENT ON TABLE public.application_identity_verifications IS 'Tracks Socure-style identity verification status';
COMMENT ON TABLE public.application_platform_selections IS 'Stores which Taxu platforms (Neobank, Investment, Accounting, Tax-filing) user wants';
COMMENT ON TABLE public.application_company_info IS 'Stores company/business information';
COMMENT ON TABLE public.application_expected_activity IS 'Stores expected account usage patterns for compliance';
COMMENT ON TABLE public.application_documents IS 'Stores uploaded verification documents';
