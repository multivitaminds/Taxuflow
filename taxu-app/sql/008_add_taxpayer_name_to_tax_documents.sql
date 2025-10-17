-- Add taxpayer_name column to tax_forms table
-- This enhances the tax_forms table with taxpayer information

ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS taxpayer_name VARCHAR(255);
ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS taxpayer_ssn VARCHAR(11);
ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS filing_status VARCHAR(50);

-- Update the table comment
COMMENT ON TABLE tax_forms IS 'Processed tax form data extracted from documents with taxpayer information';

-- Add index for taxpayer name searches
CREATE INDEX IF NOT EXISTS idx_tax_forms_taxpayer_name ON tax_forms(taxpayer_name);

-- Optional: Add a constraint to ensure SSN format (if provided)
-- ALTER TABLE tax_forms ADD CONSTRAINT chk_ssn_format CHECK (taxpayer_ssn ~ '^\d{3}-?\d{2}-?\d{4}$' OR taxpayer_ssn IS NULL);