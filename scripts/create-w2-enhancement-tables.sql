-- W-2 Enhancement Tables for Plaid Integration and Advanced Features

-- Payroll connections via Plaid
CREATE TABLE IF NOT EXISTS payroll_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL, -- 'gusto', 'adp', 'paychex', 'quickbooks_payroll', 'square_payroll'
  plaid_access_token TEXT,
  plaid_item_id TEXT,
  connection_status TEXT DEFAULT 'active', -- 'active', 'disconnected', 'error'
  last_synced_at TIMESTAMPTZ,
  sync_frequency TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'manual'
  auto_sync_enabled BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- W-2 forms with enhanced tracking
CREATE TABLE IF NOT EXISTS w2_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  tax_year INTEGER NOT NULL,
  form_type TEXT DEFAULT 'original', -- 'original', 'corrected'
  correction_of UUID REFERENCES w2_forms(id), -- If this is a W-2c, reference to original
  
  -- Employer Information
  employer_name TEXT NOT NULL,
  employer_ein TEXT NOT NULL,
  employer_address TEXT,
  employer_city TEXT,
  employer_state TEXT,
  employer_zip TEXT,
  
  -- Employee Information
  employee_first_name TEXT NOT NULL,
  employee_middle_initial TEXT,
  employee_last_name TEXT NOT NULL,
  employee_ssn_encrypted TEXT NOT NULL,
  employee_address TEXT,
  employee_city TEXT,
  employee_state TEXT,
  employee_zip TEXT,
  
  -- Wage Information (Box 1-20)
  wages NUMERIC(12, 2),
  federal_withholding NUMERIC(12, 2),
  social_security_wages NUMERIC(12, 2),
  social_security_withholding NUMERIC(12, 2),
  medicare_wages NUMERIC(12, 2),
  medicare_withholding NUMERIC(12, 2),
  social_security_tips NUMERIC(12, 2),
  allocated_tips NUMERIC(12, 2),
  dependent_care_benefits NUMERIC(12, 2),
  nonqualified_plans NUMERIC(12, 2),
  box_12_codes JSONB DEFAULT '[]', -- Array of {code, amount}
  box_14_other JSONB DEFAULT '[]',
  
  -- State Information
  state_wages NUMERIC(12, 2),
  state_withholding NUMERIC(12, 2),
  state_code TEXT,
  local_wages NUMERIC(12, 2),
  local_withholding NUMERIC(12, 2),
  locality_name TEXT,
  
  -- Multi-state support
  additional_states JSONB DEFAULT '[]', -- Array of state wage/tax info
  
  -- Filing Information
  filing_status TEXT DEFAULT 'draft', -- 'draft', 'validated', 'submitted', 'accepted', 'rejected'
  filed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  irs_submission_id TEXT,
  irs_status TEXT,
  
  -- Validation
  validation_errors JSONB DEFAULT '[]',
  validation_warnings JSONB DEFAULT '[]',
  validation_passed BOOLEAN DEFAULT false,
  last_validated_at TIMESTAMPTZ,
  
  -- Source tracking
  source TEXT DEFAULT 'manual', -- 'manual', 'upload', 'payroll_sync', 'quickbooks'
  payroll_connection_id UUID REFERENCES payroll_connections(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- W-2c corrections tracking
CREATE TABLE IF NOT EXISTS w2c_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_w2_id UUID NOT NULL REFERENCES w2_forms(id) ON DELETE CASCADE,
  corrected_w2_id UUID NOT NULL REFERENCES w2_forms(id) ON DELETE CASCADE,
  correction_reason TEXT NOT NULL,
  fields_corrected JSONB NOT NULL, -- {field_name: {original: value, corrected: value}}
  employee_notified BOOLEAN DEFAULT false,
  employee_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee portal access
CREATE TABLE IF NOT EXISTS employee_portal_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  access_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Year-end reconciliation
CREATE TABLE IF NOT EXISTS payroll_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  reconciliation_type TEXT NOT NULL, -- 'w2_vs_941', 'w2_vs_payroll', 'state_reconciliation'
  
  -- Totals
  w2_total_wages NUMERIC(12, 2),
  w2_total_federal_withholding NUMERIC(12, 2),
  w2_total_ss_wages NUMERIC(12, 2),
  w2_total_ss_tax NUMERIC(12, 2),
  w2_total_medicare_wages NUMERIC(12, 2),
  w2_total_medicare_tax NUMERIC(12, 2),
  
  form_941_total_wages NUMERIC(12, 2),
  form_941_total_federal_withholding NUMERIC(12, 2),
  form_941_total_ss_tax NUMERIC(12, 2),
  form_941_total_medicare_tax NUMERIC(12, 2),
  
  -- Discrepancies
  discrepancies JSONB DEFAULT '[]',
  discrepancy_count INTEGER DEFAULT 0,
  total_discrepancy_amount NUMERIC(12, 2),
  
  -- Status
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'needs_review'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Retirement contribution tracking
CREATE TABLE IF NOT EXISTS retirement_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  w2_form_id UUID REFERENCES w2_forms(id) ON DELETE SET NULL,
  tax_year INTEGER NOT NULL,
  
  -- Contribution details
  contribution_type TEXT NOT NULL, -- '401k', '403b', '457', 'simple_ira', 'sep_ira'
  employee_contribution NUMERIC(12, 2) DEFAULT 0,
  employer_match NUMERIC(12, 2) DEFAULT 0,
  employer_nonelective NUMERIC(12, 2) DEFAULT 0,
  total_contribution NUMERIC(12, 2) GENERATED ALWAYS AS (
    COALESCE(employee_contribution, 0) + 
    COALESCE(employer_match, 0) + 
    COALESCE(employer_nonelective, 0)
  ) STORED,
  
  -- Limits and validation
  annual_limit NUMERIC(12, 2), -- IRS limit for the year
  catch_up_contribution NUMERIC(12, 2) DEFAULT 0, -- For age 50+
  exceeds_limit BOOLEAN DEFAULT false,
  limit_warning_sent BOOLEAN DEFAULT false,
  
  -- Box 12 codes
  box_12_code TEXT, -- 'D', 'E', 'F', 'G', 'H', 'S', etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payroll_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE w2_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE w2c_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_portal_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE retirement_contributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own payroll connections"
  ON payroll_connections FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own W-2 forms"
  ON w2_forms FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own W-2c corrections"
  ON w2c_corrections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reconciliations"
  ON payroll_reconciliations FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage retirement contributions"
  ON retirement_contributions FOR ALL
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_w2_forms_user_year ON w2_forms(user_id, tax_year);
CREATE INDEX idx_w2_forms_employee ON w2_forms(employee_id);
CREATE INDEX idx_w2_forms_status ON w2_forms(filing_status);
CREATE INDEX idx_payroll_connections_user ON payroll_connections(user_id);
CREATE INDEX idx_reconciliations_user_year ON payroll_reconciliations(user_id, tax_year);
CREATE INDEX idx_retirement_contributions_employee_year ON retirement_contributions(employee_id, tax_year);
