-- Add foreign key relationship between invoices and contacts
-- This allows Supabase to properly join these tables in queries

-- First, ensure there are no orphaned records
-- Update any invoices with invalid contact_id to NULL
UPDATE public.invoices
SET contact_id = NULL
WHERE contact_id IS NOT NULL 
AND contact_id NOT IN (SELECT id FROM public.contacts);

-- Add the foreign key constraint
ALTER TABLE public.invoices
ADD CONSTRAINT invoices_contact_id_fkey 
FOREIGN KEY (contact_id) 
REFERENCES public.contacts(id)
ON DELETE SET NULL;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_invoices_contact_id ON public.invoices(contact_id);
