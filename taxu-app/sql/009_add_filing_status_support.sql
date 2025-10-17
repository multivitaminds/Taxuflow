-- Add filing status support and tax return tracking
-- This script enhances the database with tax filing status tracking

-- Create a tax_returns table for tracking filed returns
CREATE TABLE IF NOT EXISTS tax_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tax_year INTEGER NOT NULL,
    filing_status VARCHAR(50) NOT NULL, -- 'single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household', 'qualifying_widow'
    return_status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'ready_to_file', 'filed', 'accepted', 'rejected'
    federal_agi DECIMAL(12,2), -- Adjusted Gross Income
    federal_tax_owed DECIMAL(12,2),
    federal_refund DECIMAL(12,2),
    state_tax_owed DECIMAL(12,2),
    state_refund DECIMAL(12,2),
    filed_date TIMESTAMP WITH TIME ZONE,
    accepted_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add relationship between tax_forms and tax_returns
ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS tax_return_id UUID REFERENCES tax_returns(id);

-- Add more detailed filing status options
ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS spouse_name VARCHAR(255);
ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS spouse_ssn VARCHAR(11);
ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS dependents_count INTEGER DEFAULT 0;

-- Enable RLS for tax_returns
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for tax_returns
CREATE POLICY "Users can view own tax returns" ON tax_returns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax returns" ON tax_returns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tax returns" ON tax_returns
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tax returns" ON tax_returns
    FOR DELETE USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tax_returns_user_id ON tax_returns(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_returns_tax_year ON tax_returns(tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_returns_status ON tax_returns(return_status);
CREATE INDEX IF NOT EXISTS idx_tax_forms_tax_return_id ON tax_forms(tax_return_id);

-- Add comments
COMMENT ON TABLE tax_returns IS 'Tax return filings and their status';
COMMENT ON COLUMN tax_returns.filing_status IS 'IRS filing status: single, married_filing_jointly, etc.';
COMMENT ON COLUMN tax_returns.return_status IS 'Current status of the tax return: draft, filed, accepted, etc.';