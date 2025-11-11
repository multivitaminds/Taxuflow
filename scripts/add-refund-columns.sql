-- Add refund amount columns to w2_filings table
ALTER TABLE public.w2_filings
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_refund NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_calculated_at TIMESTAMP WITH TIME ZONE;

-- Add comment explaining the columns
COMMENT ON COLUMN public.w2_filings.refund_amount IS 'Actual refund amount (positive) or amount owed (negative) based on W-2 data';
COMMENT ON COLUMN public.w2_filings.estimated_refund IS 'AI-estimated refund amount before filing';
COMMENT ON COLUMN public.w2_filings.refund_calculated_at IS 'Timestamp when refund was calculated';

-- Update existing records to calculate refunds based on wages and withholding
UPDATE public.w2_filings
SET 
  refund_amount = CASE
    WHEN irs_status = 'accepted' THEN 
      -- Calculate refund: total withheld - estimated tax liability
      (COALESCE(federal_tax_withheld, 0) + COALESCE(social_security_tax, 0) + COALESCE(medicare_tax, 0)) - 
      -- Estimated tax: (wages - standard deduction) * 10% tax rate
      (GREATEST(COALESCE(wages, 0) - 13850, 0) * 0.10)
    ELSE 0
  END,
  refund_calculated_at = CASE
    WHEN irs_status = 'accepted' THEN NOW()
    ELSE NULL
  END
WHERE refund_amount IS NULL;
