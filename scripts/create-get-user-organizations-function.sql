-- Drop the function first to ensure we are replacing it cleanly
DROP FUNCTION IF EXISTS get_user_organizations_direct(UUID);

-- Create the function using the correct 'public' schema
CREATE OR REPLACE FUNCTION get_user_organizations_direct(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    om.role
  FROM public.org_members om
  INNER JOIN public.orgs o ON o.id = om.org_id
  WHERE om.user_id = p_user_id;
END;
$$;
