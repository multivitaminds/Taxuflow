-- AI and Analytics Schema (Compatible with existing structure)
-- This script safely adds missing indexes and updates RLS policies

-- Add missing indexes for ai_processing_jobs
CREATE INDEX IF NOT EXISTS idx_ai_jobs_user_id ON public.ai_processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_document_id ON public.ai_processing_jobs(document_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status ON public.ai_processing_jobs(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_jobs_type ON public.ai_processing_jobs(job_type) WHERE job_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_jobs_created ON public.ai_processing_jobs(created_at DESC);

-- Add missing indexes for intelligent_insights
CREATE INDEX IF NOT EXISTS idx_insights_user_id ON public.intelligent_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_type ON public.intelligent_insights(insight_type) WHERE insight_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_insights_created ON public.intelligent_insights(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_insights_actionable ON public.intelligent_insights(actionable) WHERE actionable = true;

-- Add missing indexes for ai_usage_logs  
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON public.ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_org_id ON public.ai_usage_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON public.ai_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_feature ON public.ai_usage_logs(feature) WHERE feature IS NOT NULL;

-- Ensure RLS is enabled (safe to run if already enabled)
ALTER TABLE public.ai_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligent_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;

-- Update/Create RLS policies for better security
DROP POLICY IF EXISTS "Users can view own AI jobs" ON public.ai_processing_jobs;
CREATE POLICY "Users can view own AI jobs" ON public.ai_processing_jobs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage AI jobs" ON public.ai_processing_jobs;
CREATE POLICY "Service role can manage AI jobs" ON public.ai_processing_jobs
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view their own insights" ON public.intelligent_insights;
CREATE POLICY "Users can view their own insights" ON public.intelligent_insights
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own insights" ON public.intelligent_insights;  
CREATE POLICY "Users can update their own insights" ON public.intelligent_insights
  FOR UPDATE USING (auth.uid() = user_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'AI and analytics schema verified and additional indexes created successfully';
END $$;
