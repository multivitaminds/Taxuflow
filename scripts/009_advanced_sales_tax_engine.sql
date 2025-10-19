-- Advanced Sales Tax Engine (QuickBooks Premium API Parity)
-- Automated tax calculation, nexus tracking, multi-jurisdiction support

-- Sales Tax Nexus Table (where business has tax obligations)
CREATE TABLE IF NOT EXISTS public.sales_tax_nexus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Jurisdiction Info
  country VARCHAR(2) DEFAULT 'US',
  state VARCHAR(2) NOT NULL,
  county VARCHAR(100),
  city VARCHAR(100),
  
  -- Nexus Details
  nexus_type VARCHAR(50) NOT NULL, -- physical, economic, marketplace
  established_date DATE NOT NULL,
  registration_number VARCHAR(100),
  
  -- Thresholds
  economic_threshold_amount NUMERIC(12, 2),
  economic_threshold_transactions INTEGER,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Sales Tax Rates Table (already exists, adding more fields)
ALTER TABLE public.sales_tax_rates ADD COLUMN IF NOT EXISTS rate_type VARCHAR(50) DEFAULT 'standard';
ALTER TABLE public.sales_tax_rates ADD COLUMN IF NOT EXISTS applies_to_shipping BOOLEAN DEFAULT false;
ALTER TABLE public.sales_tax_rates ADD COLUMN IF NOT EXISTS applies_to_services BOOLEAN DEFAULT true;
ALTER TABLE public.sales_tax_rates ADD COLUMN IF NOT EXISTS minimum_taxable_amount NUMERIC(10, 2);
ALTER TABLE public.sales_tax_rates ADD COLUMN IF NOT EXISTS maximum_taxable_amount NUMERIC(10, 2);

-- Tax Categories Table
CREATE TABLE IF NOT EXISTS public.tax_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Category Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(50),
  
  -- Tax Treatment
  is_taxable BOOLEAN DEFAULT true,
  default_tax_rate_id UUID REFERENCES public.sales_tax_rates(id),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Tax Classifications
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tax_category_id UUID REFERENCES public.tax_categories(id);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tax_code VARCHAR(50);

-- Sales Tax Calculations Table (audit trail)
CREATE TABLE IF NOT EXISTS public.sales_tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction Reference
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  estimate_id UUID REFERENCES public.estimates(id) ON DELETE CASCADE,
  
  -- Location
  ship_to_country VARCHAR(2),
  ship_to_state VARCHAR(2),
  ship_to_county VARCHAR(100),
  ship_to_city VARCHAR(100),
  ship_to_zip VARCHAR(20),
  
  -- Calculation Details
  subtotal NUMERIC(12, 2) NOT NULL,
  shipping_amount NUMERIC(12, 2) DEFAULT 0,
  taxable_amount NUMERIC(12, 2) NOT NULL,
  
  -- Tax Breakdown
  state_tax NUMERIC(10, 2) DEFAULT 0,
  county_tax NUMERIC(10, 2) DEFAULT 0,
  city_tax NUMERIC(10, 2) DEFAULT 0,
  special_district_tax NUMERIC(10, 2) DEFAULT 0,
  total_tax NUMERIC(10, 2) NOT NULL,
  
  -- Rates Applied
  effective_tax_rate NUMERIC(8, 5),
  tax_rates_applied JSONB, -- detailed breakdown of all rates
  
  -- Calculation Method
  calculation_method VARCHAR(50), -- manual, automated, api
  calculation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax Compliance Reports Table
CREATE TABLE IF NOT EXISTS public.tax_compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Report Period
  report_type VARCHAR(50) NOT NULL, -- monthly, quarterly, annual
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Jurisdiction
  state VARCHAR(2) NOT NULL,
  county VARCHAR(100),
  city VARCHAR(100),
  
  -- Totals
  total_sales NUMERIC(12, 2) DEFAULT 0,
  taxable_sales NUMERIC(12, 2) DEFAULT 0,
  exempt_sales NUMERIC(12, 2) DEFAULT 0,
  total_tax_collected NUMERIC(12, 2) DEFAULT 0,
  
  -- Breakdown
  sales_by_category JSONB,
  tax_by_jurisdiction JSONB,
  
  -- Filing
  due_date DATE,
  filed_date DATE,
  filing_reference VARCHAR(100),
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, ready, filed, paid
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax Exemption Certificates (already exists, enhancing)
ALTER TABLE public.tax_exemptions ADD COLUMN IF NOT EXISTS exemption_reason TEXT;
ALTER TABLE public.tax_exemptions ADD COLUMN IF NOT EXISTS verified_date DATE;
ALTER TABLE public.tax_exemptions ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id);

-- Tax Rules Engine Table
CREATE TABLE IF NOT EXISTS public.tax_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Rule Info
  rule_name VARCHAR(255) NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  
  -- Conditions
  conditions JSONB NOT NULL, -- complex rule conditions
  
  -- Actions
  tax_rate_override NUMERIC(8, 5),
  tax_exempt BOOLEAN DEFAULT false,
  apply_to_shipping BOOLEAN,
  
  -- Applicability
  applies_to_states TEXT[],
  applies_to_products TEXT[],
  applies_to_customers TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  effective_date DATE,
  expiration_date DATE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax Audit Trail
CREATE TABLE IF NOT EXISTS public.tax_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Event
  event_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sales_tax_nexus_user ON public.sales_tax_nexus(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_tax_nexus_state ON public.sales_tax_nexus(state);
CREATE INDEX IF NOT EXISTS idx_sales_tax_nexus_active ON public.sales_tax_nexus(is_active);

CREATE INDEX IF NOT EXISTS idx_tax_categories_user ON public.tax_categories(user_id);

CREATE INDEX IF NOT EXISTS idx_sales_tax_calcs_user ON public.sales_tax_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_tax_calcs_invoice ON public.sales_tax_calculations(invoice_id);
CREATE INDEX IF NOT EXISTS idx_sales_tax_calcs_timestamp ON public.sales_tax_calculations(calculation_timestamp);

CREATE INDEX IF NOT EXISTS idx_tax_compliance_user ON public.tax_compliance_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_compliance_period ON public.tax_compliance_reports(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_tax_compliance_status ON public.tax_compliance_reports(status);

CREATE INDEX IF NOT EXISTS idx_tax_rules_user ON public.tax_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_rules_active ON public.tax_rules(is_active);

CREATE INDEX IF NOT EXISTS idx_tax_audit_user ON public.tax_audit_trail(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_audit_created ON public.tax_audit_trail(created_at);

-- Enable Row Level Security
ALTER TABLE public.sales_tax_nexus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_audit_trail ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own nexus"
  ON public.sales_tax_nexus FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tax categories"
  ON public.tax_categories FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own tax calculations"
  ON public.sales_tax_calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tax calculations"
  ON public.sales_tax_calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own compliance reports"
  ON public.tax_compliance_reports FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tax rules"
  ON public.tax_rules FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own audit trail"
  ON public.tax_audit_trail FOR SELECT
  USING (auth.uid() = user_id);

-- Function to calculate sales tax
CREATE OR REPLACE FUNCTION calculate_sales_tax(
  p_subtotal NUMERIC,
  p_shipping NUMERIC,
  p_state VARCHAR,
  p_county VARCHAR,
  p_city VARCHAR,
  p_zip VARCHAR,
  p_user_id UUID
)
RETURNS TABLE (
  state_tax NUMERIC,
  county_tax NUMERIC,
  city_tax NUMERIC,
  total_tax NUMERIC,
  effective_rate NUMERIC
) AS $$
DECLARE
  v_state_rate NUMERIC := 0;
  v_county_rate NUMERIC := 0;
  v_city_rate NUMERIC := 0;
  v_total_rate NUMERIC := 0;
  v_taxable_amount NUMERIC;
BEGIN
  v_taxable_amount := p_subtotal + p_shipping;
  
  -- Get state rate
  SELECT COALESCE(tax_rate, 0) INTO v_state_rate
  FROM public.sales_tax_rates
  WHERE user_id = p_user_id
    AND state = p_state
    AND jurisdiction = 'state'
    AND is_active = true
  LIMIT 1;
  
  -- Get county rate
  IF p_county IS NOT NULL THEN
    SELECT COALESCE(tax_rate, 0) INTO v_county_rate
    FROM public.sales_tax_rates
    WHERE user_id = p_user_id
      AND state = p_state
      AND county = p_county
      AND jurisdiction = 'county'
      AND is_active = true
    LIMIT 1;
  END IF;
  
  -- Get city rate
  IF p_city IS NOT NULL THEN
    SELECT COALESCE(tax_rate, 0) INTO v_city_rate
    FROM public.sales_tax_rates
    WHERE user_id = p_user_id
      AND state = p_state
      AND city = p_city
      AND jurisdiction = 'city'
      AND is_active = true
    LIMIT 1;
  END IF;
  
  v_total_rate := v_state_rate + v_county_rate + v_city_rate;
  
  RETURN QUERY SELECT
    ROUND(v_taxable_amount * v_state_rate / 100, 2) as state_tax,
    ROUND(v_taxable_amount * v_county_rate / 100, 2) as county_tax,
    ROUND(v_taxable_amount * v_city_rate / 100, 2) as city_tax,
    ROUND(v_taxable_amount * v_total_rate / 100, 2) as total_tax,
    v_total_rate as effective_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
