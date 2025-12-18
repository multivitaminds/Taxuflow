-- Fix schema mismatches for AI document processing

-- Step 1: Ensure tax_calculations has all required columns from both versions
ALTER TABLE public.tax_calculations
ADD COLUMN IF NOT EXISTS tax_document_id UUID REFERENCES public.tax_documents(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS tax_year INTEGER,
ADD COLUMN IF NOT EXISTS total_income DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS adjusted_gross_income DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS taxable_income DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS standard_deduction DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS itemized_deductions DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS federal_tax_liability DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS state_tax_liability DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS total_tax_withheld DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS amount_owed DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS confidence_level TEXT,
ADD COLUMN IF NOT EXISTS calculated_by TEXT,
ADD COLUMN IF NOT EXISTS calculation_notes TEXT;

-- Step 2: Fix agent_activities foreign key - remove w2_id_fkey if it exists
-- and make it optional
ALTER TABLE public.agent_activities
DROP CONSTRAINT IF EXISTS agent_activities_w2_id_fkey;

ALTER TABLE public.agent_activities
ADD COLUMN IF NOT EXISTS w2_form_id UUID REFERENCES public.w2_forms(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS tax_document_id UUID REFERENCES public.tax_documents(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS activity_type TEXT;

-- Step 3: Ensure deductions_credits has all required columns
ALTER TABLE public.deductions_credits
ADD COLUMN IF NOT EXISTS tax_document_id UUID REFERENCES public.tax_documents(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS tax_calculation_id UUID REFERENCES public.tax_calculations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS recommended_by TEXT,
ADD COLUMN IF NOT EXISTS confidence DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS documentation_needed TEXT[],
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Step 4: Create w2_data table as a simple view/alias to w2_forms for backward compatibility
CREATE TABLE IF NOT EXISTS public.w2_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  tax_year INTEGER,
  
  -- Employer Information
  employer_name TEXT,
  employer_ein TEXT,
  employer_address TEXT,
  employer_city TEXT,
  employer_state TEXT,
  employer_zip TEXT,
  
  -- Employee Information
  employee_name TEXT,
  employee_ssn TEXT,
  employee_address TEXT,
  employee_city TEXT,
  employee_state TEXT,
  employee_zip TEXT,
  
  -- Box values
  state TEXT,
  wages NUMERIC(12, 2),
  federal_tax_withheld NUMERIC(12, 2),
  social_security_wages NUMERIC(12, 2),
  social_security_tax_withheld NUMERIC(12, 2),
  medicare_wages NUMERIC(12, 2),
  medicare_tax_withheld NUMERIC(12, 2),
  state_wages NUMERIC(12, 2),
  state_tax_withheld NUMERIC(12, 2),
  
  -- Additional fields
  box_12_codes JSONB,
  other_data JSONB,
  extraction_confidence DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 5: Enable RLS on w2_data
ALTER TABLE public.w2_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own w2 data"
  ON public.w2_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own w2 data"
  ON public.w2_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own w2 data"
  ON public.w2_data FOR UPDATE
  USING (auth.uid() = user_id);

-- Step 6: Create indexes
CREATE INDEX IF NOT EXISTS idx_w2_data_user_id ON public.w2_data(user_id);
CREATE INDEX IF NOT EXISTS idx_w2_data_document_id ON public.w2_data(document_id);
CREATE INDEX IF NOT EXISTS idx_agent_activities_w2_form ON public.agent_activities(w2_form_id) WHERE w2_form_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_agent_activities_tax_doc ON public.agent_activities(tax_document_id) WHERE tax_document_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_agent_activities_type ON public.agent_activities(activity_type) WHERE activity_type IS NOT NULL;

-- Step 7: Grant permissions
GRANT ALL ON public.w2_data TO authenticated, service_role;

-- Done!
SELECT 'Document processing schema fixed successfully!' AS status;
