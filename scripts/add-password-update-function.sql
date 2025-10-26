-- Function to update admin password
CREATE OR REPLACE FUNCTION update_admin_password(
  admin_email TEXT,
  new_password TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE admin_users
  SET password_hash = crypt(new_password, gen_salt('bf'))
  WHERE email = admin_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
