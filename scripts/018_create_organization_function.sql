-- Create function to create organization and add owner as member
CREATE OR REPLACE FUNCTION public.create_organization(
  org_name TEXT,
  org_description TEXT,
  owner_id UUID
)
RETURNS UUID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Insert organization
  INSERT INTO public.orgs (name, description)
  VALUES (org_name, org_description)
  RETURNING id INTO new_org_id;
  
  -- Add owner as member
  INSERT INTO public.org_members (org_id, user_id, role)
  VALUES (new_org_id, owner_id, 'owner');
  
  RETURN new_org_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_organization(TEXT, TEXT, UUID) TO authenticated;
