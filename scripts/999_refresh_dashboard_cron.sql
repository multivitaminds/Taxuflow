-- =================================================================
-- OPTIONAL: AUTO-REFRESH DASHBOARD SUMMARY
-- =================================================================
-- This script sets up automatic refresh of the dashboard summary
-- materialized view using pg_cron (if available)
-- =================================================================

-- Note: pg_cron extension may not be available in all Supabase projects
-- Check with: SELECT * FROM pg_extension WHERE extname = 'pg_cron';

DO $$
BEGIN
  -- Check if pg_cron is available
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Refresh dashboard summary every 5 minutes
    PERFORM cron.schedule(
      'refresh-dashboard-summary',
      '*/5 * * * *',
      $$SELECT refresh_user_dashboard_summary();$$
    );
    RAISE NOTICE '✅ Scheduled automatic dashboard summary refresh every 5 minutes';
  ELSE
    RAISE NOTICE '⚠️ pg_cron extension not available. Manual refresh required.';
    RAISE NOTICE '💡 Refresh manually with: SELECT refresh_user_dashboard_summary();';
  END IF;
END $$;
