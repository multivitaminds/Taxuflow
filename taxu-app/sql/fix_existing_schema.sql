-- Fix existing schema - work with current structure
-- This assumes you already have books schema with org_id columns

BEGIN;

-- Create missing tables only (ones that caused errors in v0)

-- User profiles (if it doesn't exist)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Deductions (was missing)
CREATE TABLE IF NOT EXISTS deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  amount numeric(14,2) NOT NULL,
  deduction_type text,
  tax_year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recurring transactions (was missing)
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  amount numeric(14,2) NOT NULL,
  frequency text CHECK (frequency IN ('daily','weekly','monthly','yearly')),
  next_occurrence date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Public employees (referenced in some scripts)
CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  position text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Public projects (referenced in some scripts)
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns to existing tables if they don't exist

-- Add name column to accounts if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'books' 
    AND table_name = 'accounts' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE books.accounts ADD COLUMN name text;
  END IF;
END
$$;

-- Add organization_id column to accounts if missing (but only if org_id doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'books' 
    AND table_name = 'accounts' 
    AND column_name = 'organization_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'books' 
    AND table_name = 'accounts' 
    AND column_name = 'org_id'
  ) THEN
    ALTER TABLE books.accounts ADD COLUMN organization_id uuid;
  END IF;
END
$$;

COMMIT;

-- Success message
SELECT 'Schema fixes applied successfully!' as result;