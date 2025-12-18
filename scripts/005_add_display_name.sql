-- Add display_name column to contacts table
-- This column will be used for displaying customer/vendor names in the UI

ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS display_name TEXT GENERATED ALWAYS AS (
  COALESCE(
    CASE 
      WHEN company_name IS NOT NULL AND company_name != '' THEN company_name
      ELSE contact_name
    END,
    contact_name,
    email
  )
) STORED;

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_contacts_display_name ON public.contacts(display_name);
