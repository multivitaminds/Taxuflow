-- Form 941 Priority Features: EFTPS Integration, Schedule B, Safe Harbor, Lookback Period

-- EFTPS (Electronic Federal Tax Payment System) deposits tracking
CREATE TABLE IF NOT EXISTS eftps_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  form_941_id UUID REFERENCES tax_filings(id) ON DELETE SET NULL,
  
  -- Deposit Information
  deposit_date DATE NOT NULL,
  deposit_amount NUMERIC(12, 2) NOT NULL,
  tax_period_start DATE NOT NULL,
  tax_period_end DATE NOT NULL,
  quarter INTEGER NOT NULL,
  tax_year INTEGER NOT NULL,
  
  -- EFTPS Details
  eftps_confirmation_number TEXT,
  eftps_trace_number TEXT,
  payment_method TEXT DEFAULT 'eftps', -- 'eftps', 'check', 'wire', 'ach'
  
  -- Tax Breakdown
  federal_income_tax NUMERIC(12, 2) DEFAULT 0,
  social_security_tax NUMERIC(12, 2) DEFAULT 0,
  medicare_tax NUMERIC(12, 2) DEFAULT 0,
  
  -- Status
  deposit_status TEXT DEFAULT 'scheduled', -- 'scheduled', 'pending', 'completed', 'failed', 'cancelled'
  scheduled_date DATE,
  completed_at TIMESTAMPTZ,
  failed_reason TEXT,
  
  -- Reconciliation
  applied_to_941 BOOLEAN DEFAULT false,
  reconciled_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule B (for semi-weekly depositors)
CREATE TABLE IF NOT EXISTS schedule_b_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  form_941_id UUID REFERENCES tax_filings(id) ON DELETE CASCADE,
  
  -- Payroll Information
  payroll_date DATE NOT NULL,
  tax_liability_date DATE NOT NULL, -- Date tax liability incurred (usually payroll date)
  deposit_due_date DATE NOT NULL, -- When deposit is due (Wed or Fri)
  
  -- Tax Liability
  tax_liability NUMERIC(12, 2) NOT NULL,
  federal_income_tax NUMERIC(12, 2) DEFAULT 0,
  social_security_tax NUMERIC(12, 2) DEFAULT 0,
  medicare_tax NUMERIC(12, 2) DEFAULT 0,
  
  -- Deposit Information
  deposit_date DATE,
  deposit_amount NUMERIC(12, 2),
  eftps_deposit_id UUID REFERENCES eftps_deposits(id),
  
  -- Status
  deposit_status TEXT DEFAULT 'pending', -- 'pending', 'deposited', 'overdue'
  is_overdue BOOLEAN DEFAULT false,
  days_overdue INTEGER DEFAULT 0,
  
  -- Payroll Source
  payroll_connection_id UUID REFERENCES payroll_connections(id),
  source TEXT DEFAULT 'manual', -- 'manual', 'payroll_sync', 'imported'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Harbor tracking
CREATE TABLE IF NOT EXISTS safe_harbor_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Period Information
  tax_year INTEGER NOT NULL,
  quarter INTEGER NOT NULL,
  quarter_start_date DATE NOT NULL,
  quarter_end_date DATE NOT NULL,
  
  -- Tax Liability
  total_tax_liability NUMERIC(12, 2) NOT NULL,
  federal_income_tax NUMERIC(12, 2) DEFAULT 0,
  social_security_tax NUMERIC(12, 2) DEFAULT 0,
  medicare_tax NUMERIC(12, 2) DEFAULT 0,
  
  -- Safe Harbor Calculations
  safe_harbor_100_percent NUMERIC(12, 2), -- 100% of current quarter liability
  safe_harbor_90_percent NUMERIC(12, 2), -- 90% of current quarter liability
  
  -- Actual Deposits
  total_deposits NUMERIC(12, 2) DEFAULT 0,
  deposit_count INTEGER DEFAULT 0,
  
  -- Safe Harbor Status
  meets_100_percent_safe_harbor BOOLEAN DEFAULT false,
  meets_90_percent_safe_harbor BOOLEAN DEFAULT false,
  shortfall_amount NUMERIC(12, 2) DEFAULT 0,
  
  -- Recommendations
  recommended_catch_up_deposit NUMERIC(12, 2),
  catch_up_deposit_due_date DATE,
  warning_sent BOOLEAN DEFAULT false,
  warning_sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, tax_year, quarter)
);

-- Lookback Period tracking (determines monthly vs semi-weekly depositor status)
CREATE TABLE IF NOT EXISTS lookback_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Lookback Period (July 1 - June 30 of prior year)
  lookback_start_date DATE NOT NULL,
  lookback_end_date DATE NOT NULL,
  lookback_year INTEGER NOT NULL, -- Year the lookback applies to
  
  -- Tax Liability During Lookback
  total_tax_liability NUMERIC(12, 2) NOT NULL,
  q3_prior_year NUMERIC(12, 2) DEFAULT 0, -- July-Sept
  q4_prior_year NUMERIC(12, 2) DEFAULT 0, -- Oct-Dec
  q1_current_year NUMERIC(12, 2) DEFAULT 0, -- Jan-Mar
  q2_current_year NUMERIC(12, 2) DEFAULT 0, -- Apr-Jun
  
  -- Deposit Schedule Determination
  deposit_schedule TEXT NOT NULL, -- 'monthly', 'semi-weekly'
  threshold_amount NUMERIC(12, 2) DEFAULT 50000.00, -- IRS threshold
  exceeds_threshold BOOLEAN DEFAULT false,
  
  -- Status Changes
  previous_deposit_schedule TEXT,
  schedule_changed BOOLEAN DEFAULT false,
  schedule_change_date DATE,
  
  -- Notifications
  threshold_warning_sent BOOLEAN DEFAULT false, -- Alert when approaching $50K
  threshold_warning_at NUMERIC(12, 2), -- Amount when warning was sent
  schedule_change_notification_sent BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, lookback_year)
);

-- Deposit schedule history (track changes over time)
CREATE TABLE IF NOT EXISTS deposit_schedule_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  lookback_period_id UUID REFERENCES lookback_periods(id) ON DELETE CASCADE,
  
  -- Schedule Change
  effective_date DATE NOT NULL,
  old_schedule TEXT,
  new_schedule TEXT NOT NULL,
  reason TEXT,
  
  -- Tax Liability at Change
  tax_liability_at_change NUMERIC(12, 2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE eftps_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_b_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE safe_harbor_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookback_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_schedule_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own EFTPS deposits"
  ON eftps_deposits FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own Schedule B entries"
  ON schedule_b_entries FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own safe harbor tracking"
  ON safe_harbor_tracking FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own lookback periods"
  ON lookback_periods FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own deposit schedule history"
  ON deposit_schedule_history FOR SELECT
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_eftps_deposits_user_quarter ON eftps_deposits(user_id, tax_year, quarter);
CREATE INDEX idx_eftps_deposits_status ON eftps_deposits(deposit_status);
CREATE INDEX idx_eftps_deposits_date ON eftps_deposits(deposit_date);
CREATE INDEX idx_schedule_b_user_941 ON schedule_b_entries(user_id, form_941_id);
CREATE INDEX idx_schedule_b_payroll_date ON schedule_b_entries(payroll_date);
CREATE INDEX idx_schedule_b_status ON schedule_b_entries(deposit_status);
CREATE INDEX idx_safe_harbor_user_quarter ON safe_harbor_tracking(user_id, tax_year, quarter);
CREATE INDEX idx_lookback_user_year ON lookback_periods(user_id, lookback_year);
CREATE INDEX idx_lookback_schedule ON lookback_periods(deposit_schedule);
