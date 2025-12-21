-- Fix infinite recursion in api_keys and organization_memberships RLS policies
-- This addresses the error: infinite recursion detected in policy for relation "organization_memberships"

-- Step 1: Drop problematic policies on organization_memberships
DROP POLICY IF EXISTS "Users can view memberships in their organizations" ON public.organization_memberships;
DROP POLICY IF EXISTS "Users can view org member list" ON public.organization_memberships;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.organization_memberships;
DROP POLICY IF EXISTS "Users can view org members" ON public.org_members;

-- Step 2: Create simple, non-recursive policies for organization_memberships
-- Users can view their own memberships directly
CREATE POLICY "Users can view their own membership records"
ON public.organization_memberships
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own memberships
CREATE POLICY "Users can create their own memberships"
ON public.organization_memberships
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Step 3: Fix org_members table policies (used interchangeably)
-- Drop existing problematic policies on org_members if they exist
DROP POLICY IF EXISTS "Users can view members of their orgs" ON public.org_members;
DROP POLICY IF EXISTS "Owners and admins can manage members" ON public.org_members;

-- Create simple policy for org_members
CREATE POLICY "Users can view their own org memberships"
ON public.org_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Step 4: Create SECURITY DEFINER function to check org membership safely
CREATE OR REPLACE FUNCTION public.user_is_org_member(check_org_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.organization_memberships
    WHERE organization_id = check_org_id
    AND user_id = check_user_id
  );
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.user_is_org_member(UUID, UUID) TO authenticated;

-- Step 5: Ensure api_keys policies are simple and don't reference organization_memberships
DROP POLICY IF EXISTS "Users can view their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can manage their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can update their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can create their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can delete their own API keys" ON public.api_keys;

-- Create clean, simple policies for api_keys that only check user_id
CREATE POLICY "Users can view their API keys"
ON public.api_keys
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their API keys"
ON public.api_keys
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their API keys"
ON public.api_keys
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their API keys"
ON public.api_keys
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Step 6: Add comment explaining the fix
COMMENT ON TABLE public.api_keys IS 'API keys for developer authentication. RLS policies use direct user_id checks to avoid recursion.';
COMMENT ON TABLE public.organization_memberships IS 'Organization memberships. RLS policies avoid self-referential queries to prevent infinite recursion.';
