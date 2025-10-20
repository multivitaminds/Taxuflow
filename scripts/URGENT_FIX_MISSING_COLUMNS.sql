-- URGENT FIX: Add missing columns to w2_data and user_profiles tables
-- Run this script immediately to fix the "column does not exist" errors

-- Add missing columns to w2_data table
ALTER TABLE w2_data 
ADD COLUMN IF NOT EXISTS filing_status TEXT,
ADD COLUMN IF NOT EXISTS tax_year INTEGER,
ADD COLUMN IF NOT EXISTS spouse_name TEXT;

-- Add missing columns to user_profiles table  
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS filing_status TEXT DEFAULT 'single',
ADD COLUMN IF NOT EXISTS income_type TEXT DEFAULT 'w2',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS ssn_last_four TEXT,
ADD COLUMN IF NOT EXISTS spouse_name TEXT,
ADD COLUMN IF NOT EXISTS dependents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_income DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_w2_data_tax_year ON w2_data(tax_year);
CREATE INDEX IF NOT EXISTS idx_w2_data_filing_status ON w2_data(filing_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_filing_status ON user_profiles(filing_status);

-- Update existing records to have default values
UPDATE w2_data SET filing_status = 'single' WHERE filing_status IS NULL;
UPDATE w2_data SET tax_year = 2024 WHERE tax_year IS NULL;
UPDATE user_profiles SET filing_status = 'single' WHERE filing_status IS NULL;
UPDATE user_profiles SET income_type = 'w2' WHERE income_type IS NULL;

COMMENT ON COLUMN w2_data.filing_status IS 'Tax filing status: single, married_joint, married_separate, head_of_household';
COMMENT ON COLUMN w2_data.tax_year IS 'Tax year for this W-2 (e.g., 2024)';
COMMENT ON COLUMN w2_data.spouse_name IS 'Spouse name if filing jointly';
COMMENT ON COLUMN user_profiles.filing_status IS 'User tax filing status';
COMMENT ON COLUMN user_profiles.income_type IS 'Primary income type: w2, 1099, business, mixed';
