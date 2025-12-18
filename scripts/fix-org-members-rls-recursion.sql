-- Fix infinite recursion in org_members RLS policy
-- The issue: The "Users can view members of their orgs" policy checks org_members
-- within a policy applied to org_members, creating infinite recursion

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view members of their orgs" ON public.org_members;
DROP POLICY IF EXISTS "Owners and admins can manage members" ON public.org_members;
DROP POLICY IF EXISTS "Users can insert themselves as members" ON public.org_members;

-- Create a simpler, non-recursive policy for viewing members
-- Users can view org_members rows where they are the user_id
CREATE POLICY "Users can view org members"
ON public.org_members
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

-- Users can insert themselves as members
CREATE POLICY "Users can insert themselves as members"
ON public.org_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create a helper function to check if a user is an owner or admin of an org
-- This avoids the recursion issue by using a function
CREATE OR REPLACE FUNCTION is_org_admin(org_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.org_members
    WHERE org_id = org_uuid
    AND user_id = user_uuid
    AND role IN ('owner', 'admin')
  );
END;
$$;

-- Owners and admins can manage members using the helper function
CREATE POLICY "Owners and admins can manage members"
ON public.org_members
FOR ALL
TO authenticated
USING (is_org_admin(org_id, auth.uid()))
WITH CHECK (is_org_admin(org_id, auth.uid()));
