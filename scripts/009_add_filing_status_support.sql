-- Add filing status and spouse information to tax_documents table
ALTER TABLE tax_documents
ADD COLUMN IF NOT EXISTS filing_status TEXT CHECK (filing_status IN ('single', 'married_joint', 'married_separate', 'head_of_household')),
ADD COLUMN IF NOT EXISTS spouse_name TEXT;

-- Add filing status to tax_calculations table
ALTER TABLE tax_calculations
ADD COLUMN IF NOT EXISTS filing_status TEXT CHECK (filing_status IN ('single', 'married_joint', 'married_separate', 'head_of_household')) DEFAULT 'single';

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_tax_documents_filing_status ON tax_documents(filing_status);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_filing_status ON tax_calculations(filing_status);

-- Add comments
COMMENT ON COLUMN tax_documents.filing_status IS 'Tax filing status: single, married_joint, married_separate, or head_of_household';
COMMENT ON COLUMN tax_documents.spouse_name IS 'Spouse name for married filing jointly returns';
COMMENT ON COLUMN tax_calculations.filing_status IS 'Tax filing status used for calculations';
