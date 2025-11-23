-- Create your first admin user
-- Replace the email and password with your desired credentials

-- First, ensure the pgcrypto extension is enabled for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert your admin user
-- IMPORTANT: Replace 'your-email@taxu.io' and 'your-secure-password' with your actual credentials
INSERT INTO admin_users (
  email,
  full_name,
  role,
  password_hash,
  is_active,
  permissions
)
VALUES (
  'admin@taxu.io',  -- Replace with your email
  'Admin User',      -- Replace with your name
  'super_admin',     -- Role: super_admin, admin, or support
  crypt('ChangeThisPassword123!', gen_salt('bf')),  -- Replace with your secure password
  true,
  '{"users": true, "filings": true, "analytics": true, "settings": true}'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- Verify the admin user was created
SELECT id, email, role, is_active, created_at 
FROM admin_users 
WHERE email = 'admin@taxu.io';  -- Match the email you used above
