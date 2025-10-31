-- Add tables for tax filings and enhanced document tracking

-- Add columns to documents table for extraction and deductions
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS extracted_data JSONB,
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS deductions JSONB,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

-- Create tax_filings table
CREATE TABLE IF NOT EXISTS public.tax_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  filing_status TEXT NOT NULL,
  total_income DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_deductions DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax_liability DECIMAL(12, 2) NOT NULL DEFAULT 0,
  refund_or_owed DECIMAL(12, 2) NOT NULL DEFAULT 0,
  filed_at TIMESTAMPTZ,
  taxbandits_submission_id TEXT,
  taxbandits_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on tax_filings
ALTER TABLE public.tax_filings ENABLE ROW LEVEL SECURITY;

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
GRANT ALL ON public.tax_filings TO authenticated;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tax_filings_user_year ON public.tax_filings(user_id, tax_year);

-- Status check
SELECT 
  'TAX FILING TABLES CREATED' as status,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = 'documents' AND column_name = 'extracted_data') as documents_enhanced,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_name = 'tax_filings') as filings_table_exists;
