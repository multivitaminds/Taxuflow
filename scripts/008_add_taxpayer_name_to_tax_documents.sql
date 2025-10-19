-- Add taxpayer_name column to tax_documents table for easier document identification
ALTER TABLE tax_documents
ADD COLUMN IF NOT EXISTS taxpayer_name TEXT;

-- Add index for faster lookups by taxpayer name
CREATE INDEX IF NOT EXISTS idx_tax_documents_taxpayer_name ON tax_documents(taxpayer_name);

-- Add comment explaining the column
COMMENT ON COLUMN tax_documents.taxpayer_name IS 'Full name of the taxpayer extracted from the document (employee_name for W-2, recipient_name for 1099, etc.)';
