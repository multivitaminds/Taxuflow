-- Enable Row Level Security on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to read their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
USING (auth.uid()::text = user_id OR email = auth.jwt()->>'email');

-- Policy: Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid()::text = user_id OR email = auth.jwt()->>'email');

-- Policy: Allow users to insert their own profile (after authentication)
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid()::text = user_id OR email = auth.jwt()->>'email');

-- Note: Anonymous inserts during onboarding are handled via service role key in API route
-- This bypasses RLS policies securely on the server side
