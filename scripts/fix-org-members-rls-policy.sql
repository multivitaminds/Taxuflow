-- Fix infinite recursion in org_members RLS policy
-- This replaces the self-referential policy with a simpler one

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view members of their orgs" ON public.org_members;

-- Create a simple policy that just checks if the user is querying their own membership
CREATE POLICY "Users can view their own memberships" ON public.org_members
  FOR SELECT USING (auth.uid() = user_id);

-- Create a SECURITY DEFINER function to get organizations for a user
-- This bypasses RLS and avoids recursion
CREATE OR REPLACE FUNCTION public.get_user_organizations_direct(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  role TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    om.role
  FROM public.orgs o
  INNER JOIN public.org_members om ON om.org_id = o.id
  WHERE om.user_id = p_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_organizations_direct(UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.get_user_organizations_direct IS 
  'Returns organizations that a user belongs to. Uses SECURITY DEFINER to bypass RLS and avoid recursion.';
