-- Add org_id column to public.contacts table to support organization-level customers
-- This fixes the "Unauthorized" error when creating customers

-- Add org_id column to contacts table
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_contacts_org_id ON public.contacts(org_id);

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can insert their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can update their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete their own contacts" ON public.contacts;

-- Create new RLS policies that support both personal and organization contexts
-- Users can view contacts they own directly OR contacts in their organizations
CREATE POLICY "Users can view own or org contacts"
ON public.contacts
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  (
    org_id IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = contacts.org_id
      AND org_members.user_id = auth.uid()
    )
  )
);

-- Users can insert contacts with their user_id, or with an org_id if they're a member
CREATE POLICY "Users can insert own or org contacts"
ON public.contacts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    org_id IS NULL 
    OR EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = contacts.org_id
      AND org_members.user_id = auth.uid()
    )
  )
);

-- Users can update contacts they own or contacts in their organizations
CREATE POLICY "Users can update own or org contacts"
ON public.contacts
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  OR
  (
    org_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = contacts.org_id
      AND org_members.user_id = auth.uid()
    )
  )
);

-- Users can delete contacts they own or contacts in their organizations (if they're admin/owner)
CREATE POLICY "Users can delete own or org contacts"
ON public.contacts
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
  OR
  (
    org_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = contacts.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
    )
  )
);

-- Success message
SELECT 'Contacts table updated with org_id column and new RLS policies!' AS status;
