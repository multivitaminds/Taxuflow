-- Drop existing trigger and function
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.create_user_profile();

-- Create a simple, bulletproof trigger function
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with ON CONFLICT to handle duplicates gracefully
  INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name,
    subscription_tier,
    subscription_status
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'free',
    'active'
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Always return NEW to allow signup to proceed
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block signup
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_profile();

-- Ensure RLS is enabled and policies allow profile creation
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_profiles;

-- Create permissive policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Status check
SELECT 
  'Profile trigger fixed!' as status,
  COUNT(*) as total_users,
  COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as users_with_profiles
FROM auth.users
LEFT JOIN public.user_profiles ON auth.users.id = public.user_profiles.user_id;
