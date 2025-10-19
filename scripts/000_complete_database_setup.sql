-- ============================================
-- TAXU COMPLETE DATABASE SETUP
-- ============================================
-- This script sets up all required tables, storage, and policies
-- Run this once to initialize the entire Taxu database
-- ============================================

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
-- Stores user profile information and preferences

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  preferred_agent TEXT DEFAULT 'Sophie',
  tone_preference TEXT DEFAULT 'Friendly',
  subscription_tier TEXT DEFAULT 'Free',
  filing_status TEXT,
  income_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. DOCUMENTS TABLE
-- ============================================
-- Stores metadata for uploaded tax documents (W-2s, 1099s, etc.)

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  file_type TEXT,
  document_type TEXT, -- 'w2', '1099', 'receipt', 'other'
  tax_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_select_own"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "documents_insert_own"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "documents_update_own"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "documents_delete_own"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS documents_user_id_idx ON documents(user_id);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);

-- ============================================
-- 3. STORAGE BUCKET
-- ============================================
-- Creates secure storage bucket for tax documents

INSERT INTO storage.buckets (id, name, public)
VALUES ('tax-documents', 'tax-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own tax documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tax-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own tax documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'tax-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own tax documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tax-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own tax documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'tax-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- 4. W-2 DATA TABLE
-- ============================================
-- Stores extracted W-2 information from uploaded documents

CREATE TABLE IF NOT EXISTS w2_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  
  -- Employer Information
  employer_name TEXT,
  employer_ein TEXT,
  employer_address TEXT,
  
  -- Employee Information
  employee_name TEXT,
  employee_ssn TEXT,
  employee_address TEXT,
  
  -- Income Information
  wages DECIMAL(12, 2),
  federal_tax_withheld DECIMAL(12, 2),
  social_security_wages DECIMAL(12, 2),
  social_security_tax_withheld DECIMAL(12, 2),
  medicare_wages DECIMAL(12, 2),
  medicare_tax_withheld DECIMAL(12, 2),
  
  -- State Information
  state TEXT,
  state_wages DECIMAL(12, 2),
  state_tax_withheld DECIMAL(12, 2),
  
  -- Additional fields
  box_12_codes JSONB,
  other_data JSONB,
  
  -- Processing metadata
  extraction_confidence DECIMAL(5, 2),
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE w2_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own W-2 data"
  ON w2_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own W-2 data"
  ON w2_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own W-2 data"
  ON w2_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX idx_w2_data_user_id ON w2_data(user_id);
CREATE INDEX idx_w2_data_document_id ON w2_data(document_id);

-- ============================================
-- 5. TAX CALCULATIONS TABLE
-- ============================================
-- Stores calculated tax liability and refund estimates

CREATE TABLE IF NOT EXISTS tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Income totals
  total_income DECIMAL(12, 2),
  adjusted_gross_income DECIMAL(12, 2),
  taxable_income DECIMAL(12, 2),
  
  -- Tax amounts
  federal_tax_liability DECIMAL(12, 2),
  state_tax_liability DECIMAL(12, 2),
  total_tax_withheld DECIMAL(12, 2),
  
  -- Refund/Owed
  estimated_refund DECIMAL(12, 2),
  amount_owed DECIMAL(12, 2),
  
  -- Confidence and risk
  confidence_level TEXT,
  confidence_percentage DECIMAL(5, 2),
  audit_risk_score TEXT,
  
  -- Metadata
  tax_year INTEGER,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tax calculations"
  ON tax_calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax calculations"
  ON tax_calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax calculations"
  ON tax_calculations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX idx_tax_calculations_user_id ON tax_calculations(user_id);

-- ============================================
-- 6. DEDUCTIONS & CREDITS TABLE
-- ============================================
-- Stores AI-recommended deductions and credits

CREATE TABLE IF NOT EXISTS deductions_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL,
  category TEXT,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12, 2),
  
  -- AI recommendation
  recommended_by TEXT,
  confidence DECIMAL(5, 2),
  status TEXT DEFAULT 'suggested',
  
  -- Supporting data
  requirements JSONB,
  documentation_needed TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deductions_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own deductions/credits"
  ON deductions_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deductions/credits"
  ON deductions_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deductions/credits"
  ON deductions_credits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX idx_deductions_credits_user_id ON deductions_credits(user_id);

-- ============================================
-- 7. AGENT ACTIVITIES TABLE
-- ============================================
-- Tracks AI agent actions and recommendations

CREATE TABLE IF NOT EXISTS agent_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  agent_name TEXT NOT NULL,
  agent_role TEXT,
  activity_type TEXT NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  
  -- Related entities
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  w2_id UUID REFERENCES w2_data(id) ON DELETE SET NULL,
  
  -- Results
  result_data JSONB,
  impact_amount DECIMAL(12, 2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE agent_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agent activities"
  ON agent_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agent activities"
  ON agent_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_agent_activities_user_id ON agent_activities(user_id);
CREATE INDEX idx_agent_activities_created_at ON agent_activities(created_at DESC);

-- ============================================
-- 8. TAX FILINGS TABLE
-- ============================================
-- Tracks filed tax returns and IRS confirmations

CREATE TABLE IF NOT EXISTS tax_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  filing_status TEXT NOT NULL,
  refund_amount DECIMAL(10, 2),
  bank_routing TEXT,
  bank_account TEXT,
  bank_account_type TEXT,
  filed_at TIMESTAMP WITH TIME ZONE,
  irs_confirmation TEXT,
  state_confirmation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tax_filings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own filings"
  ON tax_filings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own filings"
  ON tax_filings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own filings"
  ON tax_filings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX idx_tax_filings_user_id ON tax_filings(user_id);
CREATE INDEX idx_tax_filings_tax_year ON tax_filings(tax_year);

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- All tables, storage, and security policies have been created
-- You can now use the Taxu app to upload W-2s and file taxes!
