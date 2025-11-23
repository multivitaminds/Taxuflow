-- Create function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(admin_email TEXT, admin_password TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  role TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  password_hash TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.role,
    au.is_active,
    au.created_at,
    au.last_login_at,
    au.password_hash
  FROM admin_users au
  WHERE au.email = admin_email
    AND au.password_hash = crypt(admin_password, au.password_hash)
    AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
