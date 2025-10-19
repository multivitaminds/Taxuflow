-- Sales Tax Management System
-- Track sales tax rates, collection, and liability

CREATE TABLE IF NOT EXISTS sales_tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- e.g., "California State Tax", "Los Angeles County Tax"
  jurisdiction VARCHAR(100), -- state, county, city, combined
  state VARCHAR(2),
  county VARCHAR(100),
  city VARCHAR(100),
  zip_code VARCHAR(20),
  tax_rate NUMERIC(5, 3) NOT NULL, -- e.g., 8.500 for 8.5%
  effective_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  is_compound BOOLEAN DEFAULT false, -- Tax on tax
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track tax collected on each invoice item
CREATE TABLE IF NOT EXISTS sales_tax_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  invoice_item_id UUID REFERENCES invoice_items(id) ON DELETE CASCADE,
  tax_rate_id UUID REFERENCES sales_tax_rates(id),
  tax_jurisdiction VARCHAR(100),
  tax_rate NUMERIC(5, 3),
  taxable_amount NUMERIC(12, 2),
  tax_amount NUMERIC(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track tax liability by period
CREATE TABLE IF NOT EXISTS tax_liability_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  period_type VARCHAR(20) NOT NULL, -- monthly, quarterly, annually
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_sales NUMERIC(12, 2) DEFAULT 0,
  taxable_sales NUMERIC(12, 2) DEFAULT 0,
  total_tax_collected NUMERIC(12, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, filed, paid
  filing_date DATE,
  payment_date DATE,
  payment_reference VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax exemptions for customers
CREATE TABLE IF NOT EXISTS tax_exemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  exemption_type VARCHAR(100), -- resale, nonprofit, government, etc.
  exemption_certificate_number VARCHAR(100),
  issuing_state VARCHAR(2),
  effective_date DATE NOT NULL,
  expiration_date DATE,
  certificate_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_tax_rates_state ON sales_tax_rates(state);
CREATE INDEX IF NOT EXISTS idx_sales_tax_items_invoice ON sales_tax_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_tax_liability_periods_user ON tax_liability_periods(user_id);
