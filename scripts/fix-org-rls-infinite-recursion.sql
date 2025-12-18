-- Fix infinite recursion in org_members RLS policy
-- The issue: The policy checks org_members within a policy applied to org_members

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view members of their orgs" ON public.org_members;
DROP POLICY IF EXISTS "Owners and admins can manage members" ON public.org_members;
DROP POLICY IF EXISTS "Users can insert themselves as members" ON public.org_members;
DROP POLICY IF EXISTS "Users can view org members" ON public.org_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.org_members;

-- Create simple, non-recursive policies
-- Users can view org_members rows where they are the user_id (no self-reference)
CREATE POLICY "Users can view their own memberships"
ON public.org_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert themselves as members
CREATE POLICY "Users can insert themselves as members"
ON public.org_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create a SECURITY DEFINER function to check admin status
-- This avoids recursion by using SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.is_org_admin(org_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.is_org_admin(UUID, UUID) TO authenticated;

-- Owners and admins can manage members using the SECURITY DEFINER function
CREATE POLICY "Owners and admins can manage members"
ON public.org_members
FOR ALL
TO authenticated
USING (public.is_org_admin(org_id, auth.uid()))
WITH CHECK (public.is_org_admin(org_id, auth.uid()));

-- Create a function to get user organizations without hitting RLS
CREATE OR REPLACE FUNCTION public.get_user_organizations_direct(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    om.role
  FROM public.orgs o
  INNER JOIN public.org_members om ON o.id = om.org_id
  WHERE om.user_id = p_user_id
  ORDER BY om.created_at ASC;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_organizations_direct(UUID) TO authenticated;
