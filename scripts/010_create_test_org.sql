-- Create a test organization and add the current user as owner
-- This script is idempotent and safe to run multiple times

DO $$
DECLARE
  test_org_id uuid;
  current_user_id uuid;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'No authenticated user found. Please log in first.';
  END IF;

  -- Check if user already has an organization
  SELECT org_id INTO test_org_id
  FROM books.org_members
  WHERE user_id = current_user_id
  LIMIT 1;

  -- If no organization exists, create one
  IF test_org_id IS NULL THEN
    -- Create test organization
    INSERT INTO books.organizations (name)
    VALUES ('My Company')
    RETURNING id INTO test_org_id;

    -- Add current user as owner
    INSERT INTO books.org_members (org_id, user_id, role)
    VALUES (test_org_id, current_user_id, 'owner');

    RAISE NOTICE 'Created organization % and added user % as owner', test_org_id, current_user_id;
  ELSE
    RAISE NOTICE 'User % already belongs to organization %', current_user_id, test_org_id;
  END IF;
END $$;
