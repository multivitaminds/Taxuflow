-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing admin_users table if it exists (to recreate with correct schema)
DROP TABLE IF EXISTS admin_activity_logs CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS platform_analytics CASCADE;

-- Create admin users table with password_hash and is_active columns
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'support')),
  permissions JSONB DEFAULT '{"users": true, "filings": true, "analytics": true, "settings": false}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin activity logs table
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create platform analytics table
CREATE TABLE platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_filings INTEGER DEFAULT 0,
  successful_filings INTEGER DEFAULT 0,
  failed_filings INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(admin_email TEXT, admin_password TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  permissions JSONB,
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
    au.full_name,
    au.role,
    au.permissions,
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

-- Create indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX idx_platform_analytics_date ON platform_analytics(date DESC);

-- Insert first admin user (change password before running!)
INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
VALUES (
  'admin@taxu.io',
  crypt('ChangeThisPassword123!', gen_salt('bf')),
  'System Administrator',
  'super_admin',
  true
);

-- Insert some sample analytics data
INSERT INTO platform_analytics (date, total_users, new_users, active_users, total_filings, successful_filings)
VALUES 
  (CURRENT_DATE, 150, 12, 89, 45, 42),
  (CURRENT_DATE - INTERVAL '1 day', 138, 8, 76, 38, 36),
  (CURRENT_DATE - INTERVAL '2 days', 130, 15, 82, 41, 39);
