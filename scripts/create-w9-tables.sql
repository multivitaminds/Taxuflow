-- Create W-9 forms table for storing contractor W-9 information
CREATE TABLE IF NOT EXISTS w9_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES recipients(id) ON DELETE CASCADE,
  
  -- W-9 Information
  name TEXT NOT NULL,
  business_name TEXT,
  tax_classification TEXT, -- Individual, C Corp, S Corp, Partnership, Trust/Estate, LLC, Other
  other_classification TEXT,
  exempt_payee_code TEXT,
  exemption_from_fatca_code TEXT,
  
  -- TIN Information
  ssn_encrypted TEXT,
  ein_encrypted TEXT,
  
  -- Address
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  
  -- Document Storage
  document_url TEXT, -- Blob storage URL for uploaded W-9 PDF
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, verified, expired, rejected
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Request tracking
  requested_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- AI Extraction
  ai_extracted BOOLEAN DEFAULT FALSE,
  ai_confidence_score NUMERIC(5,2),
  extraction_metadata JSONB
);

-- Create contractor payments tracking table
CREATE TABLE IF NOT EXISTS contractor_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES recipients(id) ON DELETE CASCADE,
  
  -- Payment Information
  payment_date DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  category TEXT, -- services, rent, royalties, prizes, medical, etc.
  
  -- Source tracking
  source TEXT, -- manual, stripe, quickbooks, csv_import
  external_id TEXT, -- ID from payment processor or accounting system
  
  -- Tax Year
  tax_year INTEGER NOT NULL,
  
  -- 1099 Filing
  included_in_1099 BOOLEAN DEFAULT FALSE,
  filing_id UUID REFERENCES tax_filings(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contractor threshold alerts table
CREATE TABLE IF NOT EXISTS contractor_threshold_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES recipients(id) ON DELETE CASCADE,
  
  tax_year INTEGER NOT NULL,
  threshold_amount NUMERIC(12,2) DEFAULT 600.00,
  current_amount NUMERIC(12,2) DEFAULT 0.00,
  
  -- Alert status
  alert_triggered BOOLEAN DEFAULT FALSE,
  alert_sent_at TIMESTAMP WITH TIME ZONE,
  threshold_reached_at TIMESTAMP WITH TIME ZONE,
  
  -- W-9 status
  w9_collected BOOLEAN DEFAULT FALSE,
  w9_requested_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, recipient_id, tax_year)
);

-- Enable RLS
ALTER TABLE w9_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_threshold_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for w9_forms
CREATE POLICY "Users can view their own W-9 forms"
  ON w9_forms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own W-9 forms"
  ON w9_forms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own W-9 forms"
  ON w9_forms FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own W-9 forms"
  ON w9_forms FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for contractor_payments
CREATE POLICY "Users can view their own contractor payments"
  ON contractor_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contractor payments"
  ON contractor_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contractor payments"
  ON contractor_payments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contractor payments"
  ON contractor_payments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for contractor_threshold_alerts
CREATE POLICY "Users can view their own threshold alerts"
  ON contractor_threshold_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own threshold alerts"
  ON contractor_threshold_alerts FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_w9_forms_user_id ON w9_forms(user_id);
CREATE INDEX idx_w9_forms_recipient_id ON w9_forms(recipient_id);
CREATE INDEX idx_w9_forms_status ON w9_forms(status);
CREATE INDEX idx_contractor_payments_user_id ON contractor_payments(user_id);
CREATE INDEX idx_contractor_payments_recipient_id ON contractor_payments(recipient_id);
CREATE INDEX idx_contractor_payments_tax_year ON contractor_payments(tax_year);
CREATE INDEX idx_contractor_threshold_alerts_user_id ON contractor_threshold_alerts(user_id);
CREATE INDEX idx_contractor_threshold_alerts_tax_year ON contractor_threshold_alerts(tax_year);
