-- Investment Platform Interactive Features
-- Drill-down capabilities, comparison tools, and interactive analytics

-- Comparison Sessions (for side-by-side analysis)
CREATE TABLE IF NOT EXISTS public.investment_comparison_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_name TEXT,
  comparison_type TEXT CHECK (comparison_type IN (
    'portfolio_vs_portfolio', 'holding_vs_holding', 'portfolio_vs_benchmark',
    'sector_comparison', 'strategy_comparison', 'time_period_comparison'
  )),
  entities JSONB NOT NULL, -- Array of IDs being compared
  metrics JSONB NOT NULL, -- Metrics to compare
  date_range JSONB, -- Start/end dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INTEGER DEFAULT 0
);

-- Drill-down Analytics Cache
CREATE TABLE IF NOT EXISTS public.investment_drill_down_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cache_key TEXT NOT NULL,
  drill_level INTEGER, -- 1=summary, 2=detailed, 3=granular
  entity_type TEXT, -- portfolio, holding, sector, etc.
  entity_id UUID,
  aggregated_data JSONB NOT NULL,
  filters_applied JSONB DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  hit_count INTEGER DEFAULT 0,
  UNIQUE(cache_key, user_id)
);

-- Interactive Chart Annotations
CREATE TABLE IF NOT EXISTS public.investment_chart_annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id),
  holding_id UUID REFERENCES public.investment_holdings(id),
  chart_type TEXT, -- performance, allocation, risk, etc.
  annotation_date DATE NOT NULL,
  annotation_type TEXT CHECK (annotation_type IN ('note', 'event', 'target', 'alert', 'insight')),
  title TEXT,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_visible BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Dashboard Layouts
CREATE TABLE IF NOT EXISTS public.investment_dashboard_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  layout_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  widgets JSONB NOT NULL, -- Widget configuration
  filters JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report Export Queue
CREATE TABLE IF NOT EXISTS public.investment_export_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES public.investment_custom_reports(id),
  export_type TEXT CHECK (export_type IN ('pdf', 'excel', 'csv', 'json')),
  export_config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  file_url TEXT,
  file_size_bytes INTEGER,
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Filters and Views
CREATE TABLE IF NOT EXISTS public.investment_saved_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  view_name TEXT NOT NULL,
  view_type TEXT CHECK (view_type IN ('portfolio', 'holdings', 'transactions', 'analytics', 'reports')),
  filters JSONB NOT NULL,
  sort_config JSONB,
  column_config JSONB,
  is_favorite BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_comparison_sessions_user ON public.investment_comparison_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drill_down_cache_key ON public.investment_drill_down_cache(cache_key, user_id);
CREATE INDEX IF NOT EXISTS idx_drill_down_cache_expires ON public.investment_drill_down_cache(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chart_annotations_user ON public.investment_chart_annotations(user_id, annotation_date DESC);
CREATE INDEX IF NOT EXISTS idx_chart_annotations_portfolio ON public.investment_chart_annotations(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_layouts_user ON public.investment_dashboard_layouts(user_id);
CREATE INDEX IF NOT EXISTS idx_export_queue_user ON public.investment_export_queue(user_id, status);
CREATE INDEX IF NOT EXISTS idx_export_queue_status ON public.investment_export_queue(status) WHERE status IN ('queued', 'processing');
CREATE INDEX IF NOT EXISTS idx_saved_views_user ON public.investment_saved_views(user_id);

-- Enable RLS
ALTER TABLE public.investment_comparison_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_drill_down_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_chart_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_dashboard_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_export_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_saved_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can manage their own comparison sessions" ON public.investment_comparison_sessions;
CREATE POLICY "Users can manage their own comparison sessions" ON public.investment_comparison_sessions
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own drill-down cache" ON public.investment_drill_down_cache;
CREATE POLICY "Users can manage their own drill-down cache" ON public.investment_drill_down_cache
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own chart annotations" ON public.investment_chart_annotations;
CREATE POLICY "Users can manage their own chart annotations" ON public.investment_chart_annotations
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own dashboard layouts" ON public.investment_dashboard_layouts;
CREATE POLICY "Users can manage their own dashboard layouts" ON public.investment_dashboard_layouts
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own export queue" ON public.investment_export_queue;
CREATE POLICY "Users can view their own export queue" ON public.investment_export_queue
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own saved views" ON public.investment_saved_views;
CREATE POLICY "Users can manage their own saved views" ON public.investment_saved_views
  FOR ALL USING (auth.uid() = user_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Investment Interactive Features completed successfully';
END $$;
