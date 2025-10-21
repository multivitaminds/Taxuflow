-- Create tax_interviews table for storing tax interview wizard data
CREATE TABLE IF NOT EXISTS public.tax_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filing_year INTEGER NOT NULL,
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  progress_percentage INTEGER DEFAULT 0,
  personal_info JSONB DEFAULT '{}'::JSONB,
  income_info JSONB DEFAULT '{}'::JSONB,
  deductions_info JSONB DEFAULT '{}'::JSONB,
  credits_info JSONB DEFAULT '{}'::JSONB,
  life_events_info JSONB DEFAULT '{}'::JSONB,
  estimated_refund DECIMAL(10, 2) DEFAULT 0,
  total_income DECIMAL(10, 2) DEFAULT 0,
  total_deductions DECIMAL(10, 2) DEFAULT 0,
  total_credits DECIMAL(10, 2) DEFAULT 0,
  tax_liability DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'filed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, filing_year)
);

-- Enable RLS
ALTER TABLE public.tax_interviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own tax interviews"
  ON public.tax_interviews
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax interviews"
  ON public.tax_interviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax interviews"
  ON public.tax_interviews
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tax interviews"
  ON public.tax_interviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tax_interviews_user_year 
  ON public.tax_interviews(user_id, filing_year);

CREATE INDEX IF NOT EXISTS idx_tax_interviews_status 
  ON public.tax_interviews(status);
