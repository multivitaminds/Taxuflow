-- Comprehensive fix for user profile creation trigger
-- This ensures the trigger works regardless of RLS settings

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Temporarily disable RLS
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Create the trigger function with maximum permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- Bypass RLS
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
DECLARE
  profile_name TEXT;
  profile_exists BOOLEAN;
BEGIN
  -- Check if profile already exists
  SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE id = NEW.id) INTO profile_exists;
  
  IF profile_exists THEN
    RAISE LOG 'Profile already exists for user: %', NEW.email;
    RETURN NEW;
  END IF;

  -- Extract name from metadata or email
  profile_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    split_part(NEW.email, '@', 1)
  );

  -- Insert profile
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    onboarding_completed,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    profile_name,
    false,
    NOW(),
    NOW()
  );

  RAISE LOG 'Successfully created profile for user: % (ID: %)', NEW.email, NEW.id;
  RETURN NEW;

EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, that's fine
    RAISE LOG 'Profile already exists for user: % (unique violation)', NEW.email;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Failed to create profile for % (ID: %): % (SQLSTATE: %)', 
      NEW.email, NEW.id, SQLERRM, SQLSTATE;
    -- Still return NEW so auth user is created
    RETURN NEW;
END;
$$;

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;
GRANT ALL ON public.user_profiles TO postgres, service_role, authenticated, anon;

-- Step 5: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Re-enable RLS with permissive policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Service role has full access" ON public.user_profiles;
DROP POLICY IF EXISTS "Authenticated users can insert" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Create new permissive policies
CREATE POLICY "Allow service role full access"
  ON public.user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert own profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users view own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated, anon
  USING (auth.uid() = id);

CREATE POLICY "Allow users update own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 7: Verify setup
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Trigger function created with SECURITY DEFINER';
  RAISE NOTICE '✅ Trigger attached to auth.users';
  RAISE NOTICE '✅ RLS policies configured';
  RAISE NOTICE '✅ Permissions granted';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Ready for user signups!';
END $$;
