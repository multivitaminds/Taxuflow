-- Migration script to add missing columns to user_profiles table
-- Run this if you're getting "column does not exist" errors

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add filing_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'filing_status'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN filing_status TEXT;
  END IF;

  -- Add income_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'income_type'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN income_type TEXT;
  END IF;

  -- Add avatar_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN avatar_url TEXT;
  END IF;

  -- Add preferred_agent column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'preferred_agent'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN preferred_agent TEXT DEFAULT 'Sophie';
  END IF;

  -- Add tone_preference column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'tone_preference'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN tone_preference TEXT DEFAULT 'Friendly';
  END IF;

  -- Add subscription_tier column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_tier TEXT DEFAULT 'Free';
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Update existing rows to have default values
UPDATE user_profiles 
SET 
  preferred_agent = COALESCE(preferred_agent, 'Sophie'),
  tone_preference = COALESCE(tone_preference, 'Friendly'),
  subscription_tier = COALESCE(subscription_tier, 'Free'),
  updated_at = COALESCE(updated_at, NOW())
WHERE preferred_agent IS NULL 
   OR tone_preference IS NULL 
   OR subscription_tier IS NULL 
   OR updated_at IS NULL;
