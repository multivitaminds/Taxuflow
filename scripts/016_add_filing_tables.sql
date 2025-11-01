-- Add tables for tax filings and enhanced document tracking

-- Add columns to documents table for extraction and deductions
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS extracted_data JSONB,
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS deductions JSONB,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ai_document_type TEXT,
ADD COLUMN IF NOT EXISTS ai_description TEXT,
ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(5,2);

-- Create tax_documents table for processed tax forms
CREATE TABLE IF NOT EXISTS public.tax_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  tax_year INTEGER NOT NULL,
  extracted_data JSONB NOT NULL,
  ai_summary TEXT,
  ai_confidence DECIMAL(5,2),
  key_findings TEXT[],
  taxpayer_name TEXT,
  spouse_name TEXT,
  filing_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tax_calculations table for refund/liability calculations
CREATE TABLE IF NOT EXISTS public.tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_document_id UUID REFERENCES public.tax_documents(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  total_income DECIMAL(12,2),
  adjusted_gross_income DECIMAL(12,2),
  taxable_income DECIMAL(12,2),
  standard_deduction DECIMAL(12,2),
  itemized_deductions DECIMAL(12,2),
  federal_tax_liability DECIMAL(12,2),
  state_tax_liability DECIMAL(12,2),
  total_tax_withheld DECIMAL(12,2),
  estimated_refund DECIMAL(12,2),
  amount_owed DECIMAL(12,2),
  confidence_level TEXT,
  confidence_percentage DECIMAL(5,2),
  calculated_by TEXT,
  calculation_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create deductions_credits table
CREATE TABLE IF NOT EXISTS public.deductions_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_document_id UUID REFERENCES public.tax_documents(id) ON DELETE CASCADE,
  tax_calculation_id UUID REFERENCES public.tax_calculations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  category TEXT,
  name TEXT NOT NULL,
  amount DECIMAL(12,2),
  recommended_by TEXT,
  confidence DECIMAL(5,2),
  documentation_needed TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tax_filings table
CREATE TABLE IF NOT EXISTS public.tax_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  form_type TEXT NOT NULL DEFAULT 'Auto-Filed',
  filing_status TEXT NOT NULL,
  total_income DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_deductions DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax_liability DECIMAL(12, 2) NOT NULL DEFAULT 0,
  refund_or_owed DECIMAL(12, 2) NOT NULL DEFAULT 0,
  form_data JSONB,
  provider_name TEXT DEFAULT 'taxbandits',
  submission_id TEXT,
  irs_status TEXT,
  rejection_reasons JSONB,
  filed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deductions_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_filings ENABLE ROW LEVEL SECURITY;

-- RLS policies for tax_documents
CREATE POLICY "Users can view own tax documents"
  ON public.tax_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax documents"
  ON public.tax_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for tax_calculations
CREATE POLICY "Users can view own tax calculations"
  ON public.tax_calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax calculations"
  ON public.tax_calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for deductions_credits
CREATE POLICY "Users can view own deductions"
  ON public.deductions_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deductions"
  ON public.deductions_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for tax_filings
CREATE POLICY "Users can view own filings"
  ON public.tax_filings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own filings"
  ON public.tax_filings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own filings"
  ON public.tax_filings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.tax_documents TO authenticated, service_role;
GRANT ALL ON public.tax_calculations TO authenticated, service_role;
GRANT ALL ON public.deductions_credits TO authenticated, service_role;
GRANT ALL ON public.tax_filings TO authenticated, service_role;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tax_filings_user_year ON public.tax_filings(user_id, tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_documents_user_id ON public.tax_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_documents_year ON public.tax_documents(tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_filings_submission ON public.tax_filings(submission_id);

-- Status check
SELECT 
  'TAX FILING TABLES CREATED' as status,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = 'documents' AND column_name = 'extracted_data') as documents_enhanced,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name IN ('tax_filings', 'tax_documents', 'tax_calculations', 'deductions_credits')) as tables_created;
