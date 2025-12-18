-- AI and Analytics Schema
-- Run after previous schemas

-- AI Processing Jobs
CREATE TABLE IF NOT EXISTS public.ai_processing_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  job_type TEXT NOT NULL CHECK (job_type IN ('ocr', 'categorization', 'prediction', 'anomaly_detection', 'recommendation')),
  input_data JSONB NOT NULL,
  output_data JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Insights
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('cash_flow', 'expense_pattern', 'revenue_forecast', 'anomaly', 'recommendation')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
  confidence_score DECIMAL(5,2),
  data JSONB,
  action_items TEXT[],
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Metrics
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('api_response', 'database_query', 'cache_hit', 'error_rate')),
  metric_name TEXT NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  unit TEXT,
  tags JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_ai_jobs_org_id ON public.ai_processing_jobs(organization_id);
CREATE INDEX idx_ai_jobs_status ON public.ai_processing_jobs(status);
CREATE INDEX idx_ai_insights_org_id ON public.ai_insights(organization_id);
CREATE INDEX idx_ai_insights_created_at ON public.ai_insights(created_at DESC);
CREATE INDEX idx_analytics_events_org_id ON public.analytics_events(organization_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX idx_performance_metrics_recorded_at ON public.performance_metrics(recorded_at DESC);

-- Enable RLS
ALTER TABLE public.ai_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Org members access AI jobs" ON public.ai_processing_jobs
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.org_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org members access insights" ON public.ai_insights
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.org_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );
