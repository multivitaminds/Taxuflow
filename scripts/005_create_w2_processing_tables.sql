-- Create table for storing extracted W-2 data
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
  box_12_codes JSONB, -- For retirement contributions, etc.
  other_data JSONB, -- For any additional W-2 fields
  
  -- Processing metadata
  extraction_confidence DECIMAL(5, 2), -- 0-100 confidence score
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for tax calculations
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
  confidence_level TEXT, -- 'Low', 'Medium', 'High'
  confidence_percentage DECIMAL(5, 2),
  audit_risk_score TEXT, -- 'Low', 'Medium', 'High'
  
  -- Metadata
  tax_year INTEGER,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for deductions and credits
CREATE TABLE IF NOT EXISTS deductions_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL, -- 'deduction' or 'credit'
  category TEXT, -- 'standard', 'itemized', 'education', 'child', etc.
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12, 2),
  
  -- AI recommendation
  recommended_by TEXT, -- Which AI agent recommended this
  confidence DECIMAL(5, 2), -- 0-100 confidence score
  status TEXT DEFAULT 'suggested', -- 'suggested', 'accepted', 'rejected'
  
  -- Supporting data
  requirements JSONB, -- What's needed to claim this
  documentation_needed TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for AI agent activities
CREATE TABLE IF NOT EXISTS agent_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  agent_name TEXT NOT NULL, -- 'Sophie', 'Leo', 'Jordan', 'Kai', 'Riley'
  agent_role TEXT, -- 'Filing Assistant', 'Refund Analyst', etc.
  activity_type TEXT NOT NULL, -- 'analysis', 'calculation', 'recommendation', etc.
  
  title TEXT NOT NULL, -- Short description for activity feed
  description TEXT, -- Detailed description
  
  -- Related entities
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  w2_id UUID REFERENCES w2_data(id) ON DELETE SET NULL,
  
  -- Results
  result_data JSONB, -- Structured data from the activity
  impact_amount DECIMAL(12, 2), -- Financial impact (e.g., refund increase)
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE w2_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deductions_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for w2_data
CREATE POLICY "Users can view their own W-2 data"
  ON w2_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own W-2 data"
  ON w2_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own W-2 data"
  ON w2_data FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for tax_calculations
CREATE POLICY "Users can view their own tax calculations"
  ON tax_calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax calculations"
  ON tax_calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax calculations"
  ON tax_calculations FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for deductions_credits
CREATE POLICY "Users can view their own deductions/credits"
  ON deductions_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deductions/credits"
  ON deductions_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deductions/credits"
  ON deductions_credits FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for agent_activities
CREATE POLICY "Users can view their own agent activities"
  ON agent_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agent activities"
  ON agent_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_w2_data_user_id ON w2_data(user_id);
CREATE INDEX idx_w2_data_document_id ON w2_data(document_id);
CREATE INDEX idx_tax_calculations_user_id ON tax_calculations(user_id);
CREATE INDEX idx_deductions_credits_user_id ON deductions_credits(user_id);
CREATE INDEX idx_agent_activities_user_id ON agent_activities(user_id);
CREATE INDEX idx_agent_activities_created_at ON agent_activities(created_at DESC);
