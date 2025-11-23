-- Form 941 Enhancement Tables for Comprehensive Quarterly Tax Management

-- Form 941 filings with enhanced tracking
CREATE TABLE IF NOT EXISTS form_941_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Quarter Information
  tax_year INTEGER NOT NULL,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  filing_type TEXT DEFAULT 'original', -- 'original', 'amended'
  amendment_of UUID REFERENCES form_941_filings(id), -- If this is 941-X
  
  -- Business Information
  business_name TEXT NOT NULL,
  ein TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  
  -- Part 1: Employee and Wage Information
  number_of_employees INTEGER,
  wages_tips_compensation NUMERIC(12, 2),
  federal_income_tax_withheld NUMERIC(12, 2),
  
  -- Part 1: Social Security
  taxable_social_security_wages NUMERIC(12, 2),
  taxable_social_security_tips NUMERIC(12, 2),
  social_security_tax NUMERIC(12, 2),
  
  -- Part 1: Medicare
  taxable_medicare_wages_tips NUMERIC(12, 2),
  medicare_tax NUMERIC(12, 2),
  additional_medicare_tax NUMERIC(12, 2),
  
  -- Part 1: Tax Calculations
  total_taxes_before_adjustments NUMERIC(12, 2),
  current_quarter_sick_leave_wages NUMERIC(12, 2),
  current_quarter_family_leave_wages NUMERIC(12, 2),
  
  -- Part 2: Tax Deposits and Liability
  total_taxes_after_adjustments NUMERIC(12, 2),
  total_deposits_quarter NUMERIC(12, 2),
  balance_due NUMERIC(12, 2),
  overpayment NUMERIC(12, 2),
  
  -- Deposit Schedule
  deposit_schedule TEXT, -- 'monthly', 'semiweekly', 'next_day'
  schedule_b_required BOOLEAN DEFAULT false,
  schedule_b_data JSONB DEFAULT '[]', -- For semiweekly depositors
  
  -- Monthly deposit liability (for monthly depositors)
  month_1_liability NUMERIC(12, 2),
  month_2_liability NUMERIC(12, 2),
  month_3_liability NUMERIC(12, 2),
  
  -- Credits and Adjustments
  qualified_small_business_payroll_credit NUMERIC(12, 2),
  nonrefundable_portion_employee_retention_credit NUMERIC(12, 2),
  nonrefundable_portion_cobra_credit NUMERIC(12, 2),
  other_credits JSONB DEFAULT '[]',
  
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
  source TEXT DEFAULT 'manual', -- 'manual', 'payroll_sync', 'csv_import'
  payroll_connection_id UUID REFERENCES payroll_connections(id),
  
  -- Reconciliation
  reconciled_with_payroll BOOLEAN DEFAULT false,
  reconciled_at TIMESTAMPTZ,
  reconciliation_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, tax_year, quarter, filing_type)
);

-- 941-X corrections tracking
CREATE TABLE IF NOT EXISTS form_941x_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_941_id UUID NOT NULL REFERENCES form_941_filings(id) ON DELETE CASCADE,
  corrected_941_id UUID NOT NULL REFERENCES form_941_filings(id) ON DELETE CASCADE,
  
  correction_reason TEXT NOT NULL,
  correction_type TEXT NOT NULL, -- 'overreported', 'underreported', 'both'
  fields_corrected JSONB NOT NULL, -- {field_name: {original: value, corrected: value, difference: value}}
  
  -- Impact
  tax_difference NUMERIC(12, 2), -- Positive = owe more, Negative = overpaid
  interest_due NUMERIC(12, 2),
  penalty_due NUMERIC(12, 2),
  
  -- Filing
  filed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  irs_submission_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax deposits tracking (EFTPS)
CREATE TABLE IF NOT EXISTS tax_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  form_941_id UUID REFERENCES form_941_filings(id) ON DELETE SET NULL,
  
  -- Deposit Information
  deposit_date DATE NOT NULL,
  deposit_amount NUMERIC(12, 2) NOT NULL,
  deposit_method TEXT DEFAULT 'eftps', -- 'eftps', 'check', 'wire'
  confirmation_number TEXT,
  
  -- Tax Period
  tax_year INTEGER NOT NULL,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  tax_period_start DATE,
  tax_period_end DATE,
  
  -- Deposit Type
  deposit_type TEXT NOT NULL, -- 'monthly', 'semiweekly', 'next_day', 'quarterly'
  payroll_date DATE, -- For semiweekly/next-day depositors
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'failed', 'reversed'
  verified_at TIMESTAMPTZ,
  
  -- Reconciliation
  applied_to_941 BOOLEAN DEFAULT false,
  reconciled_at TIMESTAMPTZ,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deposit schedule tracking
CREATE TABLE IF NOT EXISTS deposit_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Schedule Information
  tax_year INTEGER NOT NULL,
  schedule_type TEXT NOT NULL, -- 'monthly', 'semiweekly'
  
  -- Lookback Period (determines schedule)
  lookback_period_start DATE,
  lookback_period_end DATE,
  lookback_total_taxes NUMERIC(12, 2),
  
  -- Thresholds
  monthly_threshold NUMERIC(12, 2) DEFAULT 50000.00, -- $50,000 or less = monthly
  next_day_threshold NUMERIC(12, 2) DEFAULT 100000.00, -- $100,000+ = next day
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  determined_at TIMESTAMPTZ DEFAULT NOW(),
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, tax_year)
);

-- Quarterly reconciliation (941 vs payroll)
CREATE TABLE IF NOT EXISTS quarterly_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  form_941_id UUID REFERENCES form_941_filings(id) ON DELETE CASCADE,
  
  tax_year INTEGER NOT NULL,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  
  -- 941 Totals
  form_941_wages NUMERIC(12, 2),
  form_941_federal_withholding NUMERIC(12, 2),
  form_941_ss_tax NUMERIC(12, 2),
  form_941_medicare_tax NUMERIC(12, 2),
  form_941_total_deposits NUMERIC(12, 2),
  
  -- Payroll System Totals
  payroll_wages NUMERIC(12, 2),
  payroll_federal_withholding NUMERIC(12, 2),
  payroll_ss_tax NUMERIC(12, 2),
  payroll_medicare_tax NUMERIC(12, 2),
  payroll_total_deposits NUMERIC(12, 2),
  
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
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, tax_year, quarter)
);

-- Penalty calculations
CREATE TABLE IF NOT EXISTS form_941_penalties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_941_id UUID REFERENCES form_941_filings(id) ON DELETE CASCADE,
  
  penalty_type TEXT NOT NULL, -- 'late_filing', 'late_deposit', 'failure_to_pay', 'accuracy'
  
  -- Calculation
  base_amount NUMERIC(12, 2),
  penalty_rate NUMERIC(5, 4), -- e.g., 0.05 for 5%
  days_late INTEGER,
  penalty_amount NUMERIC(12, 2),
  interest_amount NUMERIC(12, 2),
  total_amount NUMERIC(12, 2),
  
  -- Details
  due_date DATE,
  paid_date DATE,
  calculation_method TEXT,
  calculation_details JSONB,
  
  -- Abatement
  abatement_requested BOOLEAN DEFAULT false,
  abatement_reason TEXT,
  abatement_approved BOOLEAN,
  abatement_amount NUMERIC(12, 2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE form_941_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_941x_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarterly_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_941_penalties ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own 941 filings"
  ON form_941_filings FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own 941-X corrections"
  ON form_941x_corrections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tax deposits"
  ON tax_deposits FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own deposit schedules"
  ON deposit_schedules FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own quarterly reconciliations"
  ON quarterly_reconciliations FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 941 penalties"
  ON form_941_penalties FOR ALL
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_941_filings_user_year_quarter ON form_941_filings(user_id, tax_year, quarter);
CREATE INDEX idx_941_filings_status ON form_941_filings(filing_status);
CREATE INDEX idx_tax_deposits_user_year_quarter ON tax_deposits(user_id, tax_year, quarter);
CREATE INDEX idx_tax_deposits_date ON tax_deposits(deposit_date);
CREATE INDEX idx_quarterly_reconciliations_user_year_quarter ON quarterly_reconciliations(user_id, tax_year, quarter);
CREATE INDEX idx_deposit_schedules_user_year ON deposit_schedules(user_id, tax_year);
