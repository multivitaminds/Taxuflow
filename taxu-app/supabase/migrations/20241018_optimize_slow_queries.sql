-- Optimize slow queries identified in dashboard
-- Migration: 20241018_optimize_slow_queries.sql

-- =====================================================
-- OPTIMIZE SPECIFIC SLOW QUERIES FROM DASHBOARD
-- =====================================================

-- Based on the dashboard showing queries with "select c.oid::int8 as 'd'"
-- These appear to be introspection queries that can be optimized

-- Create materialized view for frequent table metadata queries
CREATE MATERIALIZED VIEW IF NOT EXISTS public.table_metadata AS
SELECT 
    schemaname,
    tablename,
    tableowner,
    tablespace,
    hasindexes,
    hasrules,
    hastriggers,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public';

CREATE UNIQUE INDEX IF NOT EXISTS idx_table_metadata_name ON public.table_metadata(tablename);

-- Refresh function for the materialized view
CREATE OR REPLACE FUNCTION public.refresh_table_metadata()
RETURNS void
LANGUAGE SQL
SECURITY DEFINER
AS $$
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.table_metadata;
$$;

-- =====================================================
-- OPTIMIZE COMMON DATA ACCESS PATTERNS
-- =====================================================

-- Create indexed views for common aggregations that might be causing slow queries
CREATE OR REPLACE VIEW public.user_document_stats AS
SELECT 
    user_id,
    COUNT(*) as total_documents,
    COUNT(CASE WHEN processed = true THEN 1 END) as processed_documents,
    COUNT(CASE WHEN processed = false THEN 1 END) as pending_documents,
    MAX(created_at) as last_upload,
    SUM(file_size) as total_size
FROM public.documents 
GROUP BY user_id;

-- Create indexed view for tax filing summaries
CREATE OR REPLACE VIEW public.user_tax_filing_summary AS
SELECT 
    user_id,
    taxpayer_id,
    COUNT(*) as total_filings,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_filings,
    COUNT(CASE WHEN status = 'filed' THEN 1 END) as filed_filings,
    MAX(tax_year) as latest_year,
    MAX(created_at) as last_activity
FROM public.tax_filings
GROUP BY user_id, taxpayer_id;

-- =====================================================
-- IMPROVE QUERY PERFORMANCE WITH BETTER INDEXES
-- =====================================================

-- Add GIN indexes for JSONB columns that might be queried frequently
CREATE INDEX IF NOT EXISTS idx_documents_ai_analysis_gin ON public.documents USING gin(ai_analysis);
CREATE INDEX IF NOT EXISTS idx_tax_filings_data_gin ON public.tax_filings USING gin(data);
CREATE INDEX IF NOT EXISTS idx_tax_filings_calculations_gin ON public.tax_filings USING gin(calculations);
CREATE INDEX IF NOT EXISTS idx_taxpayers_address_gin ON public.taxpayers USING gin(address);
CREATE INDEX IF NOT EXISTS idx_taxpayers_dependents_gin ON public.taxpayers USING gin(dependents);

-- Add BRIN indexes for timestamp columns to optimize range queries
CREATE INDEX IF NOT EXISTS idx_documents_created_brin ON public.documents USING brin(created_at);
CREATE INDEX IF NOT EXISTS idx_tax_filings_created_brin ON public.tax_filings USING brin(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_created_brin ON public.ai_processing_jobs USING brin(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_brin ON public.audit_logs USING brin(created_at);

-- =====================================================
-- VACUUM AND ANALYZE OPTIMIZATIONS
-- =====================================================

-- Set up automatic statistics targets for better query planning
ALTER TABLE public.documents ALTER COLUMN user_id SET STATISTICS 1000;
ALTER TABLE public.documents ALTER COLUMN type SET STATISTICS 1000;
ALTER TABLE public.tax_filings ALTER COLUMN user_id SET STATISTICS 1000;
ALTER TABLE public.tax_filings ALTER COLUMN status SET STATISTICS 1000;
ALTER TABLE public.organization_members ALTER COLUMN organization_id SET STATISTICS 1000;

-- =====================================================
-- QUERY OPTIMIZATION FUNCTIONS
-- =====================================================

-- Function to get user documents with better performance
CREATE OR REPLACE FUNCTION public.get_user_documents(
    target_user_id UUID DEFAULT auth.uid(),
    limit_count INT DEFAULT 50,
    offset_count INT DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    type TEXT,
    file_size BIGINT,
    processed BOOLEAN,
    created_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        d.id,
        d.name,
        d.type,
        d.file_size,
        d.processed,
        d.created_at
    FROM public.documents d
    WHERE d.user_id = target_user_id
      AND (auth.uid() = target_user_id OR auth.uid() IS NOT NULL)
    ORDER BY d.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
$$;

-- Function to get tax filings efficiently
CREATE OR REPLACE FUNCTION public.get_user_tax_filings(
    target_user_id UUID DEFAULT auth.uid(),
    target_year INT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    tax_year INT,
    filing_status TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        tf.id,
        tf.tax_year,
        tf.filing_status,
        tf.status,
        tf.created_at,
        tf.updated_at
    FROM public.tax_filings tf
    WHERE tf.user_id = target_user_id
      AND (target_year IS NULL OR tf.tax_year = target_year)
      AND (auth.uid() = target_user_id OR auth.uid() IS NOT NULL)
    ORDER BY tf.tax_year DESC, tf.created_at DESC;
$$;

-- =====================================================
-- CONNECTION AND MEMORY OPTIMIZATIONS
-- =====================================================

-- Set work_mem for complex queries (this would typically be done at the database level)
-- Adding as a comment for reference:
-- ALTER DATABASE postgres SET work_mem = '256MB';
-- ALTER DATABASE postgres SET effective_cache_size = '4GB';
-- ALTER DATABASE postgres SET random_page_cost = 1.1;

-- Create indexes to support the RLS policies efficiently
CREATE INDEX IF NOT EXISTS idx_organization_members_fast_lookup ON public.organization_members(organization_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_rls_lookup ON public.documents(user_id, organization_id) WHERE organization_id IS NOT NULL;

-- =====================================================
-- CLEANUP AND MAINTENANCE
-- =====================================================

-- Create maintenance function to be run periodically
CREATE OR REPLACE FUNCTION public.maintain_database()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Refresh materialized views
    PERFORM public.refresh_table_metadata();
    
    -- Analyze important tables
    ANALYZE public.documents;
    ANALYZE public.tax_filings;
    ANALYZE public.taxpayers;
    ANALYZE public.organization_members;
    ANALYZE public.ai_processing_jobs;
    
    -- Log maintenance completion
    INSERT INTO public.audit_logs (action, table_name, new_values, created_at)
    VALUES ('maintenance', 'system', '{"action": "database_maintenance_completed"}'::jsonb, NOW());
END;
$$;

-- Add helpful comments
COMMENT ON FUNCTION public.get_user_documents IS 'Efficiently retrieves user documents with pagination support';
COMMENT ON FUNCTION public.get_user_tax_filings IS 'Efficiently retrieves user tax filings with optional year filtering';
COMMENT ON FUNCTION public.maintain_database IS 'Performs routine database maintenance tasks';
COMMENT ON MATERIALIZED VIEW public.table_metadata IS 'Cached table metadata to improve introspection query performance';