-- Populate user_profiles table with test data

BEGIN;

-- First, let's see what users exist in auth.users
-- (This is just for reference, comment out if needed)
-- SELECT id, email FROM auth.users LIMIT 5;

-- Insert test user profiles
-- Replace the UUIDs with actual user IDs from your auth.users table

-- Method 1: If you know specific user IDs
INSERT INTO user_profiles (user_id, full_name, email) VALUES 
('00000000-0000-0000-0000-000000000001', 'John Doe', 'john@example.com'),
('00000000-0000-0000-0000-000000000002', 'Jane Smith', 'jane@example.com')
ON CONFLICT (user_id) DO NOTHING;

-- Method 2: Auto-populate from existing auth users (if they exist)
-- Uncomment this if you have actual users in auth.users:
/*
INSERT INTO user_profiles (user_id, full_name, email)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', 'User ' || substring(au.id::text, 1, 8)),
  au.email
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE up.user_id IS NULL;
*/

COMMIT;

-- Verify the data
SELECT * FROM user_profiles;