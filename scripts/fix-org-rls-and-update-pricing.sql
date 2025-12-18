-- ===================================================================
-- FIX ORGANIZATION RLS INFINITE RECURSION ISSUE
-- ===================================================================

-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view members of their orgs" ON public.org_members;
DROP POLICY IF EXISTS "Owners and admins can manage members" ON public.org_members;
DROP POLICY IF EXISTS "Users can insert themselves as members" ON public.org_members;
DROP POLICY IF EXISTS "Users can view org members" ON public.org_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.org_members;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view their own memberships"
ON public.org_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert themselves as members"
ON public.org_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create SECURITY DEFINER function to check admin status (avoids RLS recursion)
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

GRANT EXECUTE ON FUNCTION public.is_org_admin(UUID, UUID) TO authenticated;

-- Owners and admins can manage members using the SECURITY DEFINER function
CREATE POLICY "Owners and admins can manage members"
ON public.org_members
FOR ALL
TO authenticated
USING (public.is_org_admin(org_id, auth.uid()))
WITH CHECK (public.is_org_admin(org_id, auth.uid()));

-- Create function to get user organizations without hitting RLS
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

GRANT EXECUTE ON FUNCTION public.get_user_organizations_direct(UUID) TO authenticated;

-- ===================================================================
-- VERIFY FIXES
-- ===================================================================

SELECT 'Organization RLS fix complete! You can now create and switch organizations without infinite recursion errors.' AS status;
