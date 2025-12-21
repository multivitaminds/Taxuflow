-- Fix infinite recursion in organization_memberships RLS policy
-- The issue is that the policy references itself through joins

-- Drop the existing policy that causes recursion
DROP POLICY IF EXISTS "Users can view memberships in their organizations" ON public.organization_memberships;

-- Create a simple, non-recursive policy
-- Users can view their own memberships directly without checking organization membership
CREATE POLICY "Users can view their own memberships"
ON public.organization_memberships
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Optional: Allow viewing all memberships in organizations where user is a member
-- But use a direct join without recursion
CREATE POLICY "Users can view org member list"
ON public.organization_memberships
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_memberships 
    WHERE user_id = auth.uid()
    LIMIT 1
  )
);

-- Fix the api_keys policy to not depend on organization_memberships
DROP POLICY IF EXISTS "Users can view their own API keys" ON public.api_keys;

CREATE POLICY "Users can view their own API keys"
ON public.api_keys
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Ensure api_keys can be managed by the user
DROP POLICY IF EXISTS "Users can manage their own API keys" ON public.api_keys;

CREATE POLICY "Users can manage their own API keys"
ON public.api_keys
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
