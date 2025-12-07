-- Investment AI Recommendation System
-- Advanced AI-powered recommendation and prediction engine

-- AI Recommendation Engine Config
CREATE TABLE IF NOT EXISTS public.investment_ai_recommendation_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive', 'very_aggressive')),
  investment_goals JSONB DEFAULT '[]', -- Array of goals
  time_horizon_years INTEGER,
  preferred_asset_classes TEXT[],
  excluded_sectors TEXT[],
  esg_preferences JSONB DEFAULT '{}',
  tax_optimization_enabled BOOLEAN DEFAULT true,
  auto_rebalance_enabled BOOLEAN DEFAULT false,
  rebalance_threshold_percent DECIMAL(5,2) DEFAULT 5.00,
  dividend_reinvestment BOOLEAN DEFAULT true,
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Recommendations
CREATE TABLE IF NOT EXISTS public.investment_ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id),
  recommendation_type TEXT CHECK (recommendation_type IN (
    'buy', 'sell', 'hold', 'reduce', 'increase', 
    'rebalance', 'tax_loss_harvest', 'dividend_capture',
    'sector_rotation', 'risk_adjustment'
  )),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  symbol TEXT,
  action_title TEXT NOT NULL,
  action_summary TEXT NOT NULL,
  detailed_reasoning TEXT,
  expected_outcome TEXT,
  potential_return_percent DECIMAL(8,4),
  potential_return_amount DECIMAL(15,2),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  confidence_score DECIMAL(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  supporting_data JSONB DEFAULT '{}',
  market_conditions JSONB DEFAULT '{}',
  technical_indicators JSONB DEFAULT '{}',
  fundamental_metrics JSONB DEFAULT '{}',
  suggested_quantity DECIMAL(15,8),
  suggested_price_range JSONB, -- {min, max, target}
  time_sensitivity TEXT CHECK (time_sensitivity IN ('immediate', 'this_week', 'this_month', 'flexible')),
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'executed', 'expired', 'dismissed')),
  executed_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  dismissal_reason TEXT,
  execution_notes TEXT,
  actual_outcome JSONB,
  created_by TEXT DEFAULT 'ai_engine',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Machine Learning Model Performance
CREATE TABLE IF NOT EXISTS public.investment_ml_model_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  model_type TEXT CHECK (model_type IN ('classification', 'regression', 'time_series', 'reinforcement_learning')),
  evaluation_date DATE NOT NULL,
  accuracy DECIMAL(5,4),
  precision_score DECIMAL(5,4),
  recall DECIMAL(5,4),
  f1_score DECIMAL(5,4),
  mae DECIMAL(15,4), -- Mean Absolute Error
  rmse DECIMAL(15,4), -- Root Mean Square Error
  r_squared DECIMAL(5,4),
  predictions_made INTEGER,
  correct_predictions INTEGER,
  total_return_predicted DECIMAL(15,2),
  total_return_actual DECIMAL(15,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_name, model_version, evaluation_date)
);

-- Predictive Analytics
CREATE TABLE IF NOT EXISTS public.investment_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id),
  holding_id UUID REFERENCES public.investment_holdings(id),
  symbol TEXT,
  prediction_type TEXT CHECK (prediction_type IN (
    'price_target', 'return_forecast', 'volatility_forecast',
    'drawdown_risk', 'upside_potential', 'earnings_surprise'
  )),
  prediction_horizon TEXT CHECK (prediction_horizon IN ('1_week', '1_month', '3_months', '6_months', '1_year')),
  predicted_value DECIMAL(15,4),
  predicted_low DECIMAL(15,4),
  predicted_high DECIMAL(15,4),
  confidence_interval DECIMAL(5,2),
  model_used TEXT,
  factors_considered JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  prediction_date DATE NOT NULL,
  actual_value DECIMAL(15,4),
  accuracy_score DECIMAL(5,4),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market Sentiment Analysis
CREATE TABLE IF NOT EXISTS public.investment_market_sentiment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL,
  sentiment_date DATE NOT NULL,
  overall_sentiment TEXT CHECK (overall_sentiment IN ('very_bearish', 'bearish', 'neutral', 'bullish', 'very_bullish')),
  sentiment_score DECIMAL(5,2) CHECK (sentiment_score BETWEEN -100 AND 100),
  news_sentiment DECIMAL(5,2),
  social_sentiment DECIMAL(5,2),
  analyst_sentiment DECIMAL(5,2),
  insider_sentiment DECIMAL(5,2),
  volume_sentiment DECIMAL(5,2),
  sources_analyzed INTEGER,
  positive_mentions INTEGER,
  negative_mentions INTEGER,
  neutral_mentions INTEGER,
  key_topics JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(symbol, sentiment_date)
);

-- Smart Alerts
CREATE TABLE IF NOT EXISTS public.investment_smart_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.investment_portfolios(id),
  holding_id UUID REFERENCES public.investment_holdings(id),
  symbol TEXT,
  alert_type TEXT CHECK (alert_type IN (
    'price_target', 'price_drop', 'volume_spike', 'news_alert',
    'dividend_announcement', 'earnings_release', 'analyst_upgrade',
    'analyst_downgrade', 'sector_rotation', 'volatility_spike'
  )),
  alert_condition JSONB NOT NULL,
  current_value DECIMAL(15,4),
  threshold_value DECIMAL(15,4),
  is_triggered BOOLEAN DEFAULT false,
  triggered_at TIMESTAMPTZ,
  notification_sent BOOLEAN DEFAULT false,
  notification_sent_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_ai_recs_user ON public.investment_ai_recommendations(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_recs_portfolio ON public.investment_ai_recommendations(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_ai_recs_symbol ON public.investment_ai_recommendations(symbol, status);
CREATE INDEX IF NOT EXISTS idx_ai_recs_active ON public.investment_ai_recommendations(user_id, status) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_predictions_user ON public.investment_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_symbol ON public.investment_predictions(symbol, prediction_date DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_holding ON public.investment_predictions(holding_id);

CREATE INDEX IF NOT EXISTS idx_market_sentiment_symbol ON public.investment_market_sentiment(symbol, sentiment_date DESC);
CREATE INDEX IF NOT EXISTS idx_market_sentiment_date ON public.investment_market_sentiment(sentiment_date DESC);

CREATE INDEX IF NOT EXISTS idx_smart_alerts_user ON public.investment_smart_alerts(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_smart_alerts_triggered ON public.investment_smart_alerts(is_triggered, notification_sent) WHERE is_triggered = true AND notification_sent = false;

-- Enable RLS
ALTER TABLE public.investment_ai_recommendation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_ml_model_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_market_sentiment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_smart_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can manage their own AI settings" ON public.investment_ai_recommendation_settings;
CREATE POLICY "Users can manage their own AI settings" ON public.investment_ai_recommendation_settings
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own AI recommendations" ON public.investment_ai_recommendations;
CREATE POLICY "Users can view their own AI recommendations" ON public.investment_ai_recommendations
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view ML model performance" ON public.investment_ml_model_performance;
CREATE POLICY "Anyone can view ML model performance" ON public.investment_ml_model_performance
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view their own predictions" ON public.investment_predictions;
CREATE POLICY "Users can view their own predictions" ON public.investment_predictions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view market sentiment" ON public.investment_market_sentiment;
CREATE POLICY "Anyone can view market sentiment" ON public.investment_market_sentiment
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own smart alerts" ON public.investment_smart_alerts;
CREATE POLICY "Users can manage their own smart alerts" ON public.investment_smart_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Investment AI Recommendation System completed successfully';
END $$;
