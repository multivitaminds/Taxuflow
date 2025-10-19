-- Fix security and performance issues
-- Migration: 20241018_fix_security_performance_issues.sql

-- =====================================================
-- SECURITY FIXES - Add missing RLS policies
-- =====================================================

-- Fix user_profiles table (if it exists separately from profiles)
-- Create user_profiles table if it doesn't exist and differs from profiles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        -- If user_profiles doesn't exist, create it as an alias/view or rename profiles
        -- This handles the discrepancy between schema (profiles) and dashboard (user_profiles)
        CREATE TABLE public.user_profiles AS SELECT * FROM public.profiles WHERE false;
        ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);
        ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Add comprehensive RLS policies for user_profiles
DROP POLICY IF EXISTS "Public user profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own user profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own user profile" ON public.user_profiles;

CREATE POLICY "Public user profiles are viewable by everyone" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own user profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own user profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Add missing RLS policies for enterprise tables that were missed

-- Enhanced policies for documents with organization support
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;

CREATE POLICY "Users can view own documents or org documents" ON public.documents
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (organization_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = documents.organization_id AND user_id = auth.uid()
        ))
    );

CREATE POLICY "Users can insert own documents or org documents" ON public.documents
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND 
        (organization_id IS NULL OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = documents.organization_id AND user_id = auth.uid()
        ))
    );

CREATE POLICY "Users can update own documents or org documents" ON public.documents
    FOR UPDATE USING (
        auth.uid() = user_id AND 
        (organization_id IS NULL OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = documents.organization_id AND user_id = auth.uid()
        ))
    );

CREATE POLICY "Users can delete own documents or org documents with permission" ON public.documents
    FOR DELETE USING (
        auth.uid() = user_id AND 
        (organization_id IS NULL OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = documents.organization_id 
            AND user_id = auth.uid() 
            AND role IN ('admin', 'owner')
        ))
    );

-- =====================================================
-- PERFORMANCE FIXES - Add missing indexes and optimize queries
-- =====================================================

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_documents_user_org ON public.documents(user_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at_desc ON public.documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_processed_status ON public.documents(processed) WHERE processed = false;

-- Add indexes for slow queries identified in dashboard
CREATE INDEX IF NOT EXISTS idx_tax_filings_status_year ON public.tax_filings(status, tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_filings_user_status ON public.tax_filings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_taxpayers_user_created ON public.taxpayers(user_id, created_at DESC);

-- Add partial indexes for common filtered queries
CREATE INDEX IF NOT EXISTS idx_ai_jobs_pending ON public.ai_processing_jobs(created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_ai_jobs_failed ON public.ai_processing_jobs(created_at) WHERE status = 'failed';

-- Add covering indexes for common SELECT queries
CREATE INDEX IF NOT EXISTS idx_organization_members_lookup ON public.organization_members(organization_id, user_id) INCLUDE (role, permissions);

-- =====================================================
-- SECURITY ENHANCEMENTS
-- =====================================================

-- Add DELETE policies that were missing
CREATE POLICY "Users can delete own profiles" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

CREATE POLICY "Users can delete own user profiles" ON public.user_profiles
    FOR DELETE USING (auth.uid() = id);

-- Add missing INSERT policy for organizations (for creating new orgs)
CREATE POLICY "Authenticated users can create organizations" ON public.organizations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Add policy for users to see their own memberships
CREATE POLICY "Users can view their own memberships" ON public.organization_members
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- DATA INTEGRITY CONSTRAINTS
-- =====================================================

-- Add constraints that might be missing
ALTER TABLE public.documents ADD CONSTRAINT valid_file_size CHECK (file_size >= 0);
ALTER TABLE public.documents ADD CONSTRAINT valid_mime_type CHECK (mime_type IS NOT NULL AND length(mime_type) > 0);

-- Add check constraints for better data integrity
ALTER TABLE public.tax_filings ADD CONSTRAINT valid_tax_year CHECK (tax_year >= 1900 AND tax_year <= EXTRACT(YEAR FROM NOW()) + 1);
ALTER TABLE public.tax_filings ADD CONSTRAINT valid_status CHECK (status IN ('draft', 'filed', 'accepted', 'rejected', 'amended'));

-- =====================================================
-- PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Analyze tables to update statistics
ANALYZE public.documents;
ANALYZE public.tax_filings;
ANALYZE public.taxpayers;
ANALYZE public.ai_processing_jobs;
ANALYZE public.organization_members;

-- Create function for efficient organization membership check
CREATE OR REPLACE FUNCTION public.user_is_org_member(org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_id = org_id AND user_id = auth.uid()
    );
$$;

-- Create function for efficient organization admin check
CREATE OR REPLACE FUNCTION public.user_is_org_admin(org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_id = org_id 
        AND user_id = auth.uid() 
        AND role IN ('admin', 'owner')
    );
$$;

-- Add comments for documentation
COMMENT ON FUNCTION public.user_is_org_member IS 'Efficiently checks if current user is a member of the specified organization';
COMMENT ON FUNCTION public.user_is_org_admin IS 'Efficiently checks if current user is an admin of the specified organization';