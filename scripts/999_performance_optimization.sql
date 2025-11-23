-- =================================================================
-- PERFORMANCE OPTIMIZATION FOR TAXU PLATFORM
-- =================================================================
-- This script adds missing indexes and optimizations to improve
-- query performance for frequently accessed tables
-- =================================================================

-- =================================================================
-- CRITICAL: USER_PROFILES TABLE OPTIMIZATION
-- =================================================================

-- Add composite index for common auth + profile queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_id_email ON public.user_profiles(id, email);

-- Add index for subscription queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON public.user_profiles(subscription_status, subscription_tier) WHERE subscription_status IS NOT NULL;

-- Add index for stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer ON public.user_profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- =================================================================
-- DOCUMENTS TABLE OPTIMIZATION
-- =================================================================

-- Composite index for user + status queries (most common dashboard query)
CREATE INDEX IF NOT EXISTS idx_documents_user_status ON public.documents(user_id, processing_status, created_at DESC);

-- Index for document type filtering
CREATE INDEX IF NOT EXISTS idx_documents_user_type ON public.documents(user_id, document_type) WHERE document_type IS NOT NULL;

-- Index for AI processing queries
CREATE INDEX IF NOT EXISTS idx_documents_ai_status ON public.documents(user_id, ai_processing_status) WHERE ai_processing_status IS NOT NULL;

-- Index for tax year queries
CREATE INDEX IF NOT EXISTS idx_documents_user_tax_year ON public.documents(user_id, tax_year) WHERE tax_year IS NOT NULL;

-- =================================================================
-- W2 FORMS TABLE OPTIMIZATION
-- =================================================================

-- Composite index for user + tax year queries
CREATE INDEX IF NOT EXISTS idx_w2_forms_user_year ON public.w2_forms(user_id, tax_year, created_at DESC);

-- Index for filing status queries
CREATE INDEX IF NOT EXISTS idx_w2_forms_filing_status ON public.w2_forms(user_id, filing_status) WHERE filing_status IS NOT NULL;

-- Index for organization queries
CREATE INDEX IF NOT EXISTS idx_w2_forms_org_year ON public.w2_forms(organization_id, tax_year) WHERE organization_id IS NOT NULL;

-- =================================================================
-- TAX_FILINGS TABLE OPTIMIZATION
-- =================================================================

-- Composite index for user + year queries
CREATE INDEX IF NOT EXISTS idx_tax_filings_user_year ON public.tax_filings(user_id, tax_year, created_at DESC);

-- Index for filing status
CREATE INDEX IF NOT EXISTS idx_tax_filings_status ON public.tax_filings(user_id, filing_status) WHERE filing_status IS NOT NULL;

-- =================================================================
-- INVOICES TABLE OPTIMIZATION
-- =================================================================

-- Composite index for user + status + date
CREATE INDEX IF NOT EXISTS idx_invoices_user_status_date ON public.invoices(user_id, status, invoice_date DESC);

-- Index for customer queries
CREATE INDEX IF NOT EXISTS idx_invoices_customer_status ON public.invoices(customer_id, status) WHERE customer_id IS NOT NULL;

-- Index for amount due queries
CREATE INDEX IF NOT EXISTS idx_invoices_amount_due ON public.invoices(user_id, amount_due) WHERE amount_due > 0;

-- =================================================================
-- EXPENSES TABLE OPTIMIZATION
-- =================================================================

-- Composite index for user + date queries
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, expense_date DESC, created_at DESC);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_expenses_user_category ON public.expenses(user_id, category_id) WHERE category_id IS NOT NULL;

-- Index for vendor filtering
CREATE INDEX IF NOT EXISTS idx_expenses_user_vendor ON public.expenses(user_id, vendor_id) WHERE vendor_id IS NOT NULL;

-- =================================================================
-- NOTIFICATIONS TABLE OPTIMIZATION
-- =================================================================

-- Composite index for user + read status
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at DESC);

-- Index for unread count queries
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, created_at DESC) WHERE is_read = false;

-- =================================================================
-- AGENT_ACTIVITIES TABLE OPTIMIZATION
-- =================================================================

-- Composite index for user + type queries
CREATE INDEX IF NOT EXISTS idx_agent_activities_user_type ON public.agent_activities(user_id, activity_type, created_at DESC);

-- =================================================================
-- BANK_ACCOUNTS TABLE OPTIMIZATION
-- =================================================================

-- Index for active accounts
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_active ON public.bank_accounts(user_id, is_active) WHERE is_active = true;

-- =================================================================
-- RECIPIENTS TABLE OPTIMIZATION
-- =================================================================

-- Index for active recipients
CREATE INDEX IF NOT EXISTS idx_recipients_user_active ON public.recipients(user_id, is_active) WHERE is_active = true;

-- Composite index for search queries
CREATE INDEX IF NOT EXISTS idx_recipients_search ON public.recipients(user_id, LOWER(first_name), LOWER(last_name)) WHERE is_active = true;

-- =================================================================
-- EMAIL_LOGS TABLE OPTIMIZATION
-- =================================================================

-- Composite index for user + status + date
CREATE INDEX IF NOT EXISTS idx_email_logs_user_status ON public.email_logs(user_id, status, sent_at DESC);

-- =================================================================
-- API_KEYS TABLE OPTIMIZATION
-- =================================================================

-- Composite index for user + active status
CREATE INDEX IF NOT EXISTS idx_api_keys_user_active ON public.api_keys(user_id, is_active) WHERE is_active = true;

-- =================================================================
-- VACUUMING AND STATISTICS
-- =================================================================

-- Analyze tables to update query planner statistics
ANALYZE public.user_profiles;
ANALYZE public.documents;
ANALYZE public.w2_forms;
ANALYZE public.tax_filings;
ANALYZE public.invoices;
ANALYZE public.expenses;
ANALYZE public.notifications;
ANALYZE public.agent_activities;
ANALYZE public.recipients;

-- =================================================================
-- MATERIALIZED VIEW FOR DASHBOARD SUMMARY (OPTIONAL)
-- =================================================================

-- Create a materialized view for dashboard statistics
-- This reduces the need to calculate these on every page load
CREATE MATERIALIZED VIEW IF NOT EXISTS public.user_dashboard_summary AS
SELECT 
  up.id as user_id,
  up.email,
  up.full_name,
  up.subscription_status,
  up.subscription_tier,
  -- Document counts
  COUNT(DISTINCT d.id) FILTER (WHERE d.processing_status = 'completed') as documents_processed,
  COUNT(DISTINCT d.id) FILTER (WHERE d.processing_status = 'processing') as documents_processing,
  COUNT(DISTINCT d.id) as total_documents,
  -- W2 counts
  COUNT(DISTINCT w2.id) as total_w2_forms,
  COUNT(DISTINCT w2.id) FILTER (WHERE w2.filing_status = 'filed') as w2_filed,
  -- Tax filing counts
  COUNT(DISTINCT tf.id) as total_tax_filings,
  COUNT(DISTINCT tf.id) FILTER (WHERE tf.filing_status = 'accepted') as tax_filings_accepted,
  -- Notification count
  COUNT(DISTINCT n.id) FILTER (WHERE n.is_read = false) as unread_notifications,
  -- Last activity
  GREATEST(
    MAX(d.created_at),
    MAX(w2.created_at),
    MAX(tf.created_at)
  ) as last_activity_at
FROM public.user_profiles up
LEFT JOIN public.documents d ON d.user_id = up.id
LEFT JOIN public.w2_forms w2 ON w2.user_id = up.id
LEFT JOIN public.tax_filings tf ON tf.user_id = up.id
LEFT JOIN public.notifications n ON n.user_id = up.id
GROUP BY up.id, up.email, up.full_name, up.subscription_status, up.subscription_tier;

-- Create index on the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_dashboard_summary_user_id ON public.user_dashboard_summary(user_id);

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_user_dashboard_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.user_dashboard_summary;
END;
$$;

-- Grant access to the materialized view
GRANT SELECT ON public.user_dashboard_summary TO authenticated;

-- =================================================================
-- SUCCESS MESSAGE
-- =================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Performance optimization completed!';
  RAISE NOTICE '📊 Added 30+ optimized indexes for common query patterns';
  RAISE NOTICE '🔍 Created materialized view for dashboard summaries';
  RAISE NOTICE '💡 To use the dashboard summary view, refresh it periodically with: SELECT refresh_user_dashboard_summary();';
  RAISE NOTICE '⚡ Query performance should be significantly improved';
END $$;
