-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  document_type TEXT NOT NULL,
  ai_document_type TEXT,
  ai_description TEXT,
  extracted_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tax_calculations table
CREATE TABLE IF NOT EXISTS tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estimated_refund DECIMAL(10, 2),
  confidence_percentage DECIMAL(5, 2),
  audit_risk_score TEXT,
  calculation_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agent_activities table
CREATE TABLE IF NOT EXISTS agent_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activity_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create deductions_credits table
CREATE TABLE IF NOT EXISTS deductions_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'suggested',
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_user_id ON tax_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_created_at ON tax_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activities_user_id ON agent_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_activities_created_at ON agent_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deductions_credits_user_id ON deductions_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_deductions_credits_status ON deductions_credits(status);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE deductions_credits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents
CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for tax_calculations
CREATE POLICY "Users can view their own tax calculations"
  ON tax_calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax calculations"
  ON tax_calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax calculations"
  ON tax_calculations FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for agent_activities
CREATE POLICY "Users can view their own agent activities"
  ON agent_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agent activities"
  ON agent_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for deductions_credits
CREATE POLICY "Users can view their own deductions"
  ON deductions_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deductions"
  ON deductions_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deductions"
  ON deductions_credits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deductions"
  ON deductions_credits FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_calculations_updated_at
  BEFORE UPDATE ON tax_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deductions_credits_updated_at
  BEFORE UPDATE ON deductions_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
