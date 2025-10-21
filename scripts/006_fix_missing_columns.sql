-- Fix missing columns in existing tables
-- This script adds columns that may be missing if tables were created with an older schema

-- Add entry_type column to journal_entries if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'journal_entries' 
    AND column_name = 'entry_type'
  ) THEN
    ALTER TABLE public.journal_entries 
    ADD COLUMN entry_type TEXT NOT NULL DEFAULT 'expense';
    
    -- Add index for entry_type
    CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_type 
    ON public.journal_entries(entry_type);
  END IF;
END $$;

-- Add contact_type column to contacts if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'contacts' 
    AND column_name = 'contact_type'
  ) THEN
    ALTER TABLE public.contacts 
    ADD COLUMN contact_type TEXT DEFAULT 'customer';
  END IF;
END $$;

-- Add entry_date column to journal_entries if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'journal_entries' 
    AND column_name = 'entry_date'
  ) THEN
    ALTER TABLE public.journal_entries 
    ADD COLUMN entry_date DATE NOT NULL DEFAULT CURRENT_DATE;
    
    -- Add index for entry_date
    CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date 
    ON public.journal_entries(entry_date);
  END IF;
END $$;

-- Ensure all required columns exist in contacts table
DO $$ 
BEGIN
  -- Add contact_name if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'contacts' 
    AND column_name = 'contact_name'
  ) THEN
    ALTER TABLE public.contacts ADD COLUMN contact_name TEXT;
  END IF;

  -- Add company_name if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'contacts' 
    AND column_name = 'company_name'
  ) THEN
    ALTER TABLE public.contacts ADD COLUMN company_name TEXT;
  END IF;
END $$;
