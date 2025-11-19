-- Create function to get user organizations without RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_organizations(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  role TEXT
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Use SECURITY DEFINER to bypass RLS and prevent recursion
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    o.description,
    om.role
  FROM books.organizations o
  INNER JOIN books.org_members om ON o.id = om.org_id
  WHERE om.user_id = user_id_param;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_organizations(UUID) TO authenticated;
