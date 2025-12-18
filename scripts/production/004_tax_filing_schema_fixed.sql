-- Tax Filing Schema (Compatible with existing structure)
-- This script safely verifies existing tables and adds missing indexes/policies

-- The following tables already exist in your database:
-- - public.tax_filings (with filing_status, not filing_type)
-- - public.w2_forms, public.w2_filings
-- - public.form_1099 (as nec_1099_filings)
-- - public.form_941 (as form_941_filings)
-- - public.tax_documents

-- Add any missing indexes for tax_filings
CREATE INDEX IF NOT EXISTS idx_tax_filings_org_id ON public.tax_filings(organization_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_user_id ON public.tax_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_status ON public.tax_filings(filing_status) WHERE filing_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tax_filings_year ON public.tax_filings(tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_filings_form_type ON public.tax_filings(form_type) WHERE form_type IS NOT NULL;

-- Add missing indexes for W2 forms
CREATE INDEX IF NOT EXISTS idx_w2_forms_user_id ON public.w2_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_w2_forms_org_id ON public.w2_forms(organization_id);
CREATE INDEX IF NOT EXISTS idx_w2_forms_year ON public.w2_forms(tax_year);
CREATE INDEX IF NOT EXISTS idx_w2_forms_status ON public.w2_forms(filing_status) WHERE filing_status IS NOT NULL;

-- Add missing indexes for W2 filings
CREATE INDEX IF NOT EXISTS idx_w2_filings_user_id ON public.w2_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_w2_filings_org_id ON public.w2_filings(organization_id);
CREATE INDEX IF NOT EXISTS idx_w2_filings_year ON public.w2_filings(tax_year);
CREATE INDEX IF NOT EXISTS idx_w2_filings_status ON public.w2_filings(irs_status) WHERE irs_status IS NOT NULL;

-- Add missing indexes for 1099-NEC filings
CREATE INDEX IF NOT EXISTS idx_nec_1099_user_id ON public.nec_1099_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_nec_1099_org_id ON public.nec_1099_filings(organization_id);
CREATE INDEX IF NOT EXISTS idx_nec_1099_year ON public.nec_1099_filings(tax_year);
CREATE INDEX IF NOT EXISTS idx_nec_1099_status ON public.nec_1099_filings(irs_status) WHERE irs_status IS NOT NULL;

-- Add missing indexes for Form 941 filings
CREATE INDEX IF NOT EXISTS idx_form_941_user_id ON public.form_941_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_form_941_org_id ON public.form_941_filings(organization_id);
CREATE INDEX IF NOT EXISTS idx_form_941_year_quarter ON public.form_941_filings(tax_year, quarter);
CREATE INDEX IF NOT EXISTS idx_form_941_status ON public.form_941_filings(filing_status) WHERE filing_status IS NOT NULL;

-- Add missing indexes for tax documents
CREATE INDEX IF NOT EXISTS idx_tax_documents_user_id ON public.documents(user_id) WHERE document_type LIKE '%tax%';
CREATE INDEX IF NOT EXISTS idx_tax_documents_org_id ON public.documents(organization_id) WHERE document_type LIKE '%tax%';
CREATE INDEX IF NOT EXISTS idx_tax_documents_year ON public.documents(tax_year) WHERE tax_year IS NOT NULL;

-- Ensure RLS is enabled (already enabled, but safe to run)
ALTER TABLE public.tax_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.w2_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.w2_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nec_1099_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_941_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Update/Create RLS policies for tax_filings
DROP POLICY IF EXISTS "Users can view own tax filings" ON public.tax_filings;
CREATE POLICY "Users can view own tax filings" ON public.tax_filings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own tax filings" ON public.tax_filings;
CREATE POLICY "Users can manage own tax filings" ON public.tax_filings
  FOR ALL USING (auth.uid() = user_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Tax filing schema verified and additional indexes created successfully';
END $$;
