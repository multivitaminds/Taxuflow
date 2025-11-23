-- Disable the problematic trigger that's causing signup failures
-- We're now handling profile creation manually in the application code

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Ensure RLS policies allow users to create their own profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Ensure RLS policies allow users to read their own profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Ensure RLS policies allow users to update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Status check
SELECT 
  'TRIGGER DISABLED - MANUAL PROFILE CREATION' as status,
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM public.user_profiles) as total_profiles,
  (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'on_auth_user_created') as active_triggers,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_profiles') as rls_policies;
