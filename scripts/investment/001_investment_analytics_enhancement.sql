-- Investment Platform Analytics Enhancement
-- Comprehensive analytics and reporting infrastructure

-- Investment Performance Snapshots (Historical tracking)
CREATE TABLE IF NOT EXISTS public.investment_performance_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id) ON DELETE CASCADE,
  holding_id UUID REFERENCES public.investment_holdings(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  snapshot_time TIMESTAMPTZ DEFAULT NOW(),
  market_value DECIMAL(15,2) NOT NULL,
  cost_basis DECIMAL(15,2) NOT NULL,
  unrealized_gain_loss DECIMAL(15,2) NOT NULL,
  unrealized_gain_loss_percent DECIMAL(8,4) NOT NULL,
  day_change DECIMAL(15,2),
  day_change_percent DECIMAL(8,4),
  week_change DECIMAL(15,2),
  week_change_percent DECIMAL(8,4),
  month_change DECIMAL(15,2),
  month_change_percent DECIMAL(8,4),
  ytd_change DECIMAL(15,2),
  ytd_change_percent DECIMAL(8,4),
  one_year_change DECIMAL(15,2),
  one_year_change_percent DECIMAL(8,4),
  all_time_change DECIMAL(15,2),
  all_time_change_percent DECIMAL(8,4),
  volatility_30d DECIMAL(8,4),
  sharpe_ratio DECIMAL(8,4),
  alpha DECIMAL(8,4),
  beta DECIMAL(8,4),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investment Benchmarks for Comparison
CREATE TABLE IF NOT EXISTS public.investment_benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  benchmark_symbol TEXT NOT NULL,
  benchmark_name TEXT NOT NULL,
  benchmark_type TEXT CHECK (benchmark_type IN ('index', 'etf', 'mutual_fund', 'custom')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Benchmark Performance Data
CREATE TABLE IF NOT EXISTS public.benchmark_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  benchmark_id UUID REFERENCES public.investment_benchmarks(id) ON DELETE CASCADE,
  performance_date DATE NOT NULL,
  closing_price DECIMAL(15,4) NOT NULL,
  day_return DECIMAL(8,4),
  ytd_return DECIMAL(8,4),
  one_year_return DECIMAL(8,4),
  three_year_return DECIMAL(8,4),
  five_year_return DECIMAL(8,4),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(benchmark_id, performance_date)
);

-- Custom Reports Configuration
CREATE TABLE IF NOT EXISTS public.investment_custom_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_name TEXT NOT NULL,
  report_type TEXT CHECK (report_type IN ('performance', 'holdings', 'transactions', 'tax', 'dividend', 'sector_analysis', 'risk_analysis', 'custom')),
  description TEXT,
  metrics JSONB DEFAULT '[]', -- Selected metrics
  filters JSONB DEFAULT '{}', -- Date ranges, portfolios, holdings
  grouping JSONB DEFAULT '{}', -- Group by options
  sorting JSONB DEFAULT '{}', -- Sort preferences
  visualization_config JSONB DEFAULT '{}', -- Chart types, colors
  schedule_config JSONB DEFAULT '{}', -- Auto-generation schedule
  is_scheduled BOOLEAN DEFAULT false,
  next_generation_date TIMESTAMPTZ,
  export_format TEXT[] DEFAULT ARRAY['pdf', 'excel'],
  recipients TEXT[], -- Email recipients
  is_template BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  last_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report Generation History
CREATE TABLE IF NOT EXISTS public.investment_report_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES public.investment_custom_reports(id) ON DELETE CASCADE,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  generation_time_ms INTEGER,
  report_data JSONB,
  file_url TEXT,
  file_size_bytes INTEGER,
  export_format TEXT,
  parameters_used JSONB,
  error_message TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-Powered Insights
CREATE TABLE IF NOT EXISTS public.investment_ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id),
  holding_id UUID REFERENCES public.investment_holdings(id),
  insight_type TEXT CHECK (insight_type IN (
    'performance_trend', 'rebalance_recommendation', 'tax_optimization',
    'risk_alert', 'opportunity', 'market_timing', 'diversification',
    'cost_reduction', 'dividend_optimization', 'sector_rotation'
  )),
  insight_category TEXT CHECK (insight_category IN ('positive', 'negative', 'neutral', 'action_required')),
  priority_level TEXT CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  detailed_analysis TEXT,
  actionable_steps JSONB DEFAULT '[]',
  impact_score INTEGER CHECK (impact_score BETWEEN 0 AND 100),
  confidence_score DECIMAL(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  potential_value DECIMAL(15,2),
  supporting_data JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  is_acted_upon BOOLEAN DEFAULT false,
  acted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by TEXT DEFAULT 'ai_engine',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sector Allocation Tracking
CREATE TABLE IF NOT EXISTS public.investment_sector_allocation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id) ON DELETE CASCADE,
  allocation_date DATE NOT NULL,
  sector_name TEXT NOT NULL,
  market_value DECIMAL(15,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  target_percentage DECIMAL(5,2),
  deviation_from_target DECIMAL(5,2),
  holding_count INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, allocation_date, sector_name)
);

-- Asset Class Allocation
CREATE TABLE IF NOT EXISTS public.investment_asset_allocation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id) ON DELETE CASCADE,
  allocation_date DATE NOT NULL,
  asset_class TEXT NOT NULL,
  market_value DECIMAL(15,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  target_percentage DECIMAL(5,2),
  deviation_from_target DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, allocation_date, asset_class)
);

-- Dividend Tracking
CREATE TABLE IF NOT EXISTS public.investment_dividends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  holding_id UUID REFERENCES public.investment_holdings(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id),
  symbol TEXT NOT NULL,
  dividend_type TEXT CHECK (dividend_type IN ('qualified', 'ordinary', 'capital_gain', 'return_of_capital')),
  ex_dividend_date DATE NOT NULL,
  payment_date DATE NOT NULL,
  record_date DATE,
  shares DECIMAL(15,8) NOT NULL,
  dividend_per_share DECIMAL(10,4) NOT NULL,
  total_dividend DECIMAL(15,2) NOT NULL,
  tax_withheld DECIMAL(15,2) DEFAULT 0,
  reinvested BOOLEAN DEFAULT false,
  reinvestment_transaction_id UUID,
  status TEXT DEFAULT 'projected' CHECK (status IN ('projected', 'declared', 'paid')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Rebalancing History
CREATE TABLE IF NOT EXISTS public.investment_rebalancing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id) ON DELETE CASCADE,
  rebalance_date DATE NOT NULL,
  rebalance_type TEXT CHECK (rebalance_type IN ('manual', 'automated', 'threshold_triggered', 'scheduled')),
  trigger_reason TEXT,
  actions_taken JSONB NOT NULL, -- Array of buy/sell actions
  total_transactions INTEGER,
  total_value_moved DECIMAL(15,2),
  portfolio_value_before DECIMAL(15,2),
  portfolio_value_after DECIMAL(15,2),
  cost_of_rebalancing DECIMAL(15,2), -- Fees + spreads
  tax_impact DECIMAL(15,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Metrics
CREATE TABLE IF NOT EXISTS public.investment_risk_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id) ON DELETE CASCADE,
  holding_id UUID REFERENCES public.investment_holdings(id),
  metric_date DATE NOT NULL,
  volatility_daily DECIMAL(8,4),
  volatility_monthly DECIMAL(8,4),
  volatility_annual DECIMAL(8,4),
  beta DECIMAL(8,4),
  alpha DECIMAL(8,4),
  sharpe_ratio DECIMAL(8,4),
  sortino_ratio DECIMAL(8,4),
  max_drawdown DECIMAL(8,4),
  value_at_risk_95 DECIMAL(15,2),
  value_at_risk_99 DECIMAL(15,2),
  correlation_to_market DECIMAL(6,4),
  r_squared DECIMAL(6,4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, holding_id, metric_date)
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_perf_snapshots_user_portfolio ON public.investment_performance_snapshots(user_id, portfolio_id);
CREATE INDEX IF NOT EXISTS idx_perf_snapshots_date ON public.investment_performance_snapshots(snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_perf_snapshots_holding ON public.investment_performance_snapshots(holding_id, snapshot_date DESC);

CREATE INDEX IF NOT EXISTS idx_custom_reports_user ON public.investment_custom_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_reports_type ON public.investment_custom_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_custom_reports_scheduled ON public.investment_custom_reports(is_scheduled, next_generation_date) WHERE is_scheduled = true;

CREATE INDEX IF NOT EXISTS idx_ai_insights_user ON public.investment_ai_insights(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_portfolio ON public.investment_ai_insights(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_unread ON public.investment_ai_insights(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_ai_insights_priority ON public.investment_ai_insights(priority_level, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_dividends_user ON public.investment_dividends(user_id);
CREATE INDEX IF NOT EXISTS idx_dividends_holding ON public.investment_dividends(holding_id);
CREATE INDEX IF NOT EXISTS idx_dividends_payment_date ON public.investment_dividends(payment_date DESC);

CREATE INDEX IF NOT EXISTS idx_sector_allocation_portfolio ON public.investment_sector_allocation(portfolio_id, allocation_date DESC);
CREATE INDEX IF NOT EXISTS idx_asset_allocation_portfolio ON public.investment_asset_allocation(portfolio_id, allocation_date DESC);

CREATE INDEX IF NOT EXISTS idx_risk_metrics_portfolio ON public.investment_risk_metrics(portfolio_id, metric_date DESC);

-- Enable RLS
ALTER TABLE public.investment_performance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmark_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_report_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_sector_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_asset_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_dividends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_rebalancing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_risk_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can manage their own performance snapshots" ON public.investment_performance_snapshots;
CREATE POLICY "Users can manage their own performance snapshots" ON public.investment_performance_snapshots
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view benchmarks" ON public.investment_benchmarks;
CREATE POLICY "Anyone can view benchmarks" ON public.investment_benchmarks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view benchmark performance" ON public.benchmark_performance;
CREATE POLICY "Anyone can view benchmark performance" ON public.benchmark_performance
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own custom reports" ON public.investment_custom_reports;
CREATE POLICY "Users can manage their own custom reports" ON public.investment_custom_reports
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own report history" ON public.investment_report_history;
CREATE POLICY "Users can view their own report history" ON public.investment_report_history
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own AI insights" ON public.investment_ai_insights;
CREATE POLICY "Users can manage their own AI insights" ON public.investment_ai_insights
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own sector allocation" ON public.investment_sector_allocation;
CREATE POLICY "Users can view their own sector allocation" ON public.investment_sector_allocation
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own asset allocation" ON public.investment_asset_allocation;
CREATE POLICY "Users can view their own asset allocation" ON public.investment_asset_allocation
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own dividends" ON public.investment_dividends;
CREATE POLICY "Users can manage their own dividends" ON public.investment_dividends
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own rebalancing events" ON public.investment_rebalancing_events;
CREATE POLICY "Users can view their own rebalancing events" ON public.investment_rebalancing_events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own risk metrics" ON public.investment_risk_metrics;
CREATE POLICY "Users can view their own risk metrics" ON public.investment_risk_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Investment Analytics Enhancement completed successfully';
END $$;
