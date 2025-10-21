-- Add tax return categorization fields to tax_interviews table
ALTER TABLE public.tax_interviews
ADD COLUMN IF NOT EXISTS tax_type TEXT DEFAULT 'individual_1040' CHECK (tax_type IN (
  'individual_1040',
  'business_1120',
  'partnership_1065',
  's_corp_1120s',
  'estate_1041',
  'trust_1041',
  'nonprofit_990',
  'amended_1040x'
)),
ADD COLUMN IF NOT EXISTS tax_category TEXT DEFAULT 'federal' CHECK (tax_category IN (
  'federal',
  'state',
  'local',
  'international'
)),
ADD COLUMN IF NOT EXISTS state_code TEXT,
ADD COLUMN IF NOT EXISTS return_name TEXT,
ADD COLUMN IF NOT EXISTS filing_status TEXT CHECK (filing_status IN (
  'single',
  'married_joint',
  'married_separate',
  'head_of_household',
  'qualifying_widow'
)),
ADD COLUMN IF NOT EXISTS is_amended BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_return_id UUID REFERENCES public.tax_interviews(id),
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create indexes for filtering and searching
CREATE INDEX IF NOT EXISTS idx_tax_interviews_tax_type ON public.tax_interviews(tax_type);
CREATE INDEX IF NOT EXISTS idx_tax_interviews_tax_category ON public.tax_interviews(tax_category);
CREATE INDEX IF NOT EXISTS idx_tax_interviews_filing_year ON public.tax_interviews(filing_year);
CREATE INDEX IF NOT EXISTS idx_tax_interviews_state_code ON public.tax_interviews(state_code);
CREATE INDEX IF NOT EXISTS idx_tax_interviews_tags ON public.tax_interviews USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tax_interviews_user_year_type ON public.tax_interviews(user_id, filing_year, tax_type);

-- Add a computed column for display name
ALTER TABLE public.tax_interviews
ADD COLUMN IF NOT EXISTS display_name TEXT GENERATED ALWAYS AS (
  COALESCE(
    return_name,
    CASE tax_type
      WHEN 'individual_1040' THEN filing_year::TEXT || ' Individual Tax Return (Form 1040)'
      WHEN 'business_1120' THEN filing_year::TEXT || ' Business Tax Return (Form 1120)'
      WHEN 'partnership_1065' THEN filing_year::TEXT || ' Partnership Tax Return (Form 1065)'
      WHEN 's_corp_1120s' THEN filing_year::TEXT || ' S-Corp Tax Return (Form 1120-S)'
      WHEN 'estate_1041' THEN filing_year::TEXT || ' Estate Tax Return (Form 1041)'
      WHEN 'trust_1041' THEN filing_year::TEXT || ' Trust Tax Return (Form 1041)'
      WHEN 'nonprofit_990' THEN filing_year::TEXT || ' Nonprofit Tax Return (Form 990)'
      WHEN 'amended_1040x' THEN filing_year::TEXT || ' Amended Tax Return (Form 1040-X)'
      ELSE filing_year::TEXT || ' Tax Return'
    END
  )
) STORED;

CREATE INDEX IF NOT EXISTS idx_tax_interviews_display_name ON public.tax_interviews(display_name);

-- Create a view for easy tax return management
CREATE OR REPLACE VIEW public.tax_returns_view AS
SELECT 
  ti.id,
  ti.user_id,
  ti.filing_year,
  ti.tax_type,
  ti.tax_category,
  ti.state_code,
  ti.return_name,
  ti.display_name,
  ti.filing_status,
  ti.status,
  ti.is_amended,
  ti.original_return_id,
  ti.tags,
  ti.estimated_refund,
  ti.total_income,
  ti.total_deductions,
  ti.total_credits,
  ti.tax_liability,
  ti.progress_percentage,
  ti.completed_at,
  ti.created_at,
  ti.updated_at,
  CASE 
    WHEN ti.tax_type = 'individual_1040' THEN 'Individual'
    WHEN ti.tax_type = 'business_1120' THEN 'Business'
    WHEN ti.tax_type = 'partnership_1065' THEN 'Partnership'
    WHEN ti.tax_type = 's_corp_1120s' THEN 'S-Corporation'
    WHEN ti.tax_type = 'estate_1041' THEN 'Estate'
    WHEN ti.tax_type = 'trust_1041' THEN 'Trust'
    WHEN ti.tax_type = 'nonprofit_990' THEN 'Nonprofit'
    WHEN ti.tax_type = 'amended_1040x' THEN 'Amended'
    ELSE 'Other'
  END as type_label,
  CASE 
    WHEN ti.tax_category = 'federal' THEN 'Federal'
    WHEN ti.tax_category = 'state' THEN 'State'
    WHEN ti.tax_category = 'local' THEN 'Local'
    WHEN ti.tax_category = 'international' THEN 'International'
    ELSE 'Other'
  END as category_label
FROM public.tax_interviews ti;

-- Grant access to the view
GRANT SELECT ON public.tax_returns_view TO authenticated;
