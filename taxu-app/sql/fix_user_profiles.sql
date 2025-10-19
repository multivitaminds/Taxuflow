-- Fix user_profiles table structure
BEGIN;

-- Drop the table and recreate it properly
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles with correct structure
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert your user profile
INSERT INTO user_profiles (user_id, full_name, email) VALUES 
('f7a837a9-2ef0-48bf-a5aa-bb29d4b34b43', 'Sam Lightson', 'saml@bhostd.com');

-- Verify it worked
SELECT * FROM user_profiles;

COMMIT;