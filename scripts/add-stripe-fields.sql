-- Add Stripe fields to user_profiles table

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer 
ON public.user_profiles(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_subscription 
ON public.user_profiles(stripe_subscription_id);

-- Status check
SELECT 
  'STRIPE FIELDS ADDED' as status,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = 'user_profiles' AND column_name = 'stripe_customer_id') as stripe_customer_added,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = 'user_profiles' AND column_name = 'stripe_subscription_id') as stripe_subscription_added;
