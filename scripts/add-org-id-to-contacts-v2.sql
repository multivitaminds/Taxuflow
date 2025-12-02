-- Add org_id column to public.contacts table for multi-tenant support
-- This script is safe to run multiple times

-- Add the org_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'contacts' 
    AND column_name = 'org_id'
  ) THEN
    ALTER TABLE public.contacts ADD COLUMN org_id uuid REFERENCES public.orgs(id);
    RAISE NOTICE 'Added org_id column to public.contacts';
  ELSE
    RAISE NOTICE 'Column org_id already exists in public.contacts';
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS contacts_org_id_idx ON public.contacts(org_id);
CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON public.contacts(user_id);

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can insert their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can view their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can update their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete their own contacts" ON public.contacts;

-- Create new RLS policies that support both personal and organization contacts
CREATE POLICY "Users can view personal and org contacts"
  ON public.contacts
  FOR SELECT
  USING (
    user_id = auth.uid() 
    OR 
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert personal and org contacts"
  ON public.contacts
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update personal and org contacts"
  ON public.contacts
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete personal and org contacts"
  ON public.contacts
  FOR DELETE
  USING (
    user_id = auth.uid()
    OR
    org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  );

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';

SELECT 'Contacts table updated with org_id column and RLS policies!' AS result;
