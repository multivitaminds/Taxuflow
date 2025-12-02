-- Investment Holdings Table
CREATE TABLE IF NOT EXISTS public.investment_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Stock Information
  symbol VARCHAR(10) NOT NULL,
  name TEXT NOT NULL,
  asset_type VARCHAR(50) NOT NULL DEFAULT 'stock', -- stock, etf, mutual_fund, bond, crypto
  
  -- Position Details
  shares NUMERIC(20, 8) NOT NULL DEFAULT 0,
  average_cost_basis NUMERIC(15, 2) NOT NULL,
  current_price NUMERIC(15, 2),
  market_value NUMERIC(15, 2),
  
  -- Performance
  total_cost NUMERIC(15, 2) GENERATED ALWAYS AS (shares * average_cost_basis) STORED,
  unrealized_gain_loss NUMERIC(15, 2),
  unrealized_gain_loss_percent NUMERIC(10, 4),
  
  -- Tax Information
  purchase_date DATE NOT NULL,
  holding_period_days INTEGER,
  is_long_term_holding BOOLEAN DEFAULT FALSE,
  tax_lot_method VARCHAR(20) DEFAULT 'FIFO', -- FIFO, LIFO, SpecificID
  
  -- Metadata
  sector VARCHAR(100),
  industry VARCHAR(100),
  market_cap_category VARCHAR(20), -- large, mid, small, micro
  dividend_yield NUMERIC(10, 4),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_price_update TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment Transactions Table
CREATE TABLE IF NOT EXISTS public.investment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  holding_id UUID REFERENCES public.investment_holdings(id) ON DELETE SET NULL,
  
  -- Transaction Details
  transaction_type VARCHAR(20) NOT NULL, -- buy, sell, dividend, split, transfer
  symbol VARCHAR(10) NOT NULL,
  shares NUMERIC(20, 8),
  price_per_share NUMERIC(15, 2),
  total_amount NUMERIC(15, 2) NOT NULL,
  
  -- Fees and Costs
  commission NUMERIC(10, 2) DEFAULT 0,
  fees NUMERIC(10, 2) DEFAULT 0,
  
  -- Tax Information
  transaction_date DATE NOT NULL,
  settlement_date DATE,
  cost_basis NUMERIC(15, 2),
  realized_gain_loss NUMERIC(15, 2),
  is_wash_sale BOOLEAN DEFAULT FALSE,
  
  -- Reference
  external_transaction_id TEXT,
  broker_name TEXT,
  account_number TEXT,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment Watchlist Table
CREATE TABLE IF NOT EXISTS public.investment_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stock Information
  symbol VARCHAR(10) NOT NULL,
  name TEXT NOT NULL,
  asset_type VARCHAR(50) DEFAULT 'stock',
  
  -- Tracking
  added_price NUMERIC(15, 2),
  target_buy_price NUMERIC(15, 2),
  target_sell_price NUMERIC(15, 2),
  price_alert_enabled BOOLEAN DEFAULT FALSE,
  
  -- Notes
  notes TEXT,
  tags TEXT[],
  
  -- Alerts
  alert_type VARCHAR(20), -- price_above, price_below, percent_change
  alert_threshold NUMERIC(10, 2),
  alert_triggered BOOLEAN DEFAULT FALSE,
  last_alert_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, symbol)
);

-- Auto-Invest Strategies Table
CREATE TABLE IF NOT EXISTS public.investment_auto_invest_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Strategy Details
  strategy_name VARCHAR(100) NOT NULL,
  description TEXT,
  strategy_type VARCHAR(50) NOT NULL, -- recurring, threshold, dca, rebalance
  
  -- Investment Configuration
  investment_amount NUMERIC(15, 2) NOT NULL,
  allocation_method VARCHAR(50) NOT NULL, -- equal_weight, market_cap, custom
  
  -- Asset Allocation (JSONB for flexibility)
  allocations JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [{"symbol": "VTI", "allocation_percent": 60}, {"symbol": "BND", "allocation_percent": 40}]
  
  -- Schedule
  frequency VARCHAR(20) NOT NULL, -- daily, weekly, biweekly, monthly, quarterly
  recurring_day INTEGER, -- Day of week (1-7) or day of month (1-31)
  next_execution_date DATE,
  last_execution_date DATE,
  
  -- Risk Management
  max_single_position_percent NUMERIC(5, 2) DEFAULT 10.00,
  rebalance_threshold_percent NUMERIC(5, 2) DEFAULT 5.00,
  stop_loss_percent NUMERIC(5, 2),
  
  -- Tax Optimization
  tax_loss_harvesting_enabled BOOLEAN DEFAULT FALSE,
  prefer_long_term_gains BOOLEAN DEFAULT TRUE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_paused BOOLEAN DEFAULT FALSE,
  paused_until DATE,
  
  -- Funding
  funding_source VARCHAR(50), -- bank_account, neobank_account
  funding_account_id UUID,
  
  -- Performance Tracking
  total_invested NUMERIC(15, 2) DEFAULT 0,
  total_value NUMERIC(15, 2) DEFAULT 0,
  execution_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment Portfolios Table
CREATE TABLE IF NOT EXISTS public.investment_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Portfolio Details
  portfolio_name VARCHAR(100) NOT NULL,
  description TEXT,
  portfolio_type VARCHAR(50) DEFAULT 'taxable', -- taxable, ira, roth_ira, 401k
  
  -- Goals
  investment_goal VARCHAR(50), -- retirement, education, income, growth
  target_amount NUMERIC(15, 2),
  target_date DATE,
  risk_tolerance VARCHAR(20), -- conservative, moderate, aggressive
  
  -- Performance
  total_value NUMERIC(15, 2) DEFAULT 0,
  total_cost_basis NUMERIC(15, 2) DEFAULT 0,
  total_gain_loss NUMERIC(15, 2) DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_primary BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax Loss Harvesting Opportunities Table
CREATE TABLE IF NOT EXISTS public.investment_tax_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  holding_id UUID REFERENCES public.investment_holdings(id) ON DELETE CASCADE,
  
  -- Opportunity Details
  opportunity_type VARCHAR(50) NOT NULL, -- tax_loss_harvest, long_term_gain_harvest
  symbol VARCHAR(10) NOT NULL,
  
  -- Tax Impact
  potential_tax_savings NUMERIC(15, 2),
  current_loss_amount NUMERIC(15, 2),
  replacement_symbol VARCHAR(10), -- Alternative to avoid wash sale
  
  -- Timing
  wash_sale_safe_date DATE, -- 31 days after sell
  holding_period_days INTEGER,
  days_until_long_term INTEGER,
  
  -- Status
  status VARCHAR(20) DEFAULT 'identified', -- identified, executed, dismissed
  priority_score INTEGER DEFAULT 0,
  
  -- Actions
  executed_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  dismissal_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_investment_holdings_user_id ON public.investment_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_symbol ON public.investment_holdings(symbol);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_active ON public.investment_holdings(is_active);

CREATE INDEX IF NOT EXISTS idx_investment_transactions_user_id ON public.investment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_transactions_holding_id ON public.investment_transactions(holding_id);
CREATE INDEX IF NOT EXISTS idx_investment_transactions_date ON public.investment_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_investment_transactions_type ON public.investment_transactions(transaction_type);

CREATE INDEX IF NOT EXISTS idx_investment_watchlist_user_id ON public.investment_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_watchlist_symbol ON public.investment_watchlist(symbol);

CREATE INDEX IF NOT EXISTS idx_auto_invest_user_id ON public.investment_auto_invest_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_invest_active ON public.investment_auto_invest_strategies(is_active);
CREATE INDEX IF NOT EXISTS idx_auto_invest_next_execution ON public.investment_auto_invest_strategies(next_execution_date);

CREATE INDEX IF NOT EXISTS idx_investment_portfolios_user_id ON public.investment_portfolios(user_id);

CREATE INDEX IF NOT EXISTS idx_tax_opportunities_user_id ON public.investment_tax_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_opportunities_status ON public.investment_tax_opportunities(status);

-- Enable Row Level Security
ALTER TABLE public.investment_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_auto_invest_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_tax_opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for investment_holdings
CREATE POLICY "Users can view their own holdings"
  ON public.investment_holdings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own holdings"
  ON public.investment_holdings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings"
  ON public.investment_holdings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holdings"
  ON public.investment_holdings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for investment_transactions
CREATE POLICY "Users can view their own transactions"
  ON public.investment_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.investment_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.investment_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.investment_transactions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for investment_watchlist
CREATE POLICY "Users can manage their own watchlist"
  ON public.investment_watchlist FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for auto_invest_strategies
CREATE POLICY "Users can manage their own auto-invest strategies"
  ON public.investment_auto_invest_strategies FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for portfolios
CREATE POLICY "Users can manage their own portfolios"
  ON public.investment_portfolios FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for tax opportunities
CREATE POLICY "Users can manage their own tax opportunities"
  ON public.investment_tax_opportunities FOR ALL
  USING (auth.uid() = user_id);

-- Update Triggers
CREATE OR REPLACE FUNCTION update_investment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_investment_holdings_timestamp
  BEFORE UPDATE ON public.investment_holdings
  FOR EACH ROW
  EXECUTE FUNCTION update_investment_updated_at();

CREATE TRIGGER update_investment_transactions_timestamp
  BEFORE UPDATE ON public.investment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_investment_updated_at();

CREATE TRIGGER update_investment_watchlist_timestamp
  BEFORE UPDATE ON public.investment_watchlist
  FOR EACH ROW
  EXECUTE FUNCTION update_investment_updated_at();

CREATE TRIGGER update_auto_invest_strategies_timestamp
  BEFORE UPDATE ON public.investment_auto_invest_strategies
  FOR EACH ROW
  EXECUTE FUNCTION update_investment_updated_at();

CREATE TRIGGER update_investment_portfolios_timestamp
  BEFORE UPDATE ON public.investment_portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_investment_updated_at();

CREATE TRIGGER update_tax_opportunities_timestamp
  BEFORE UPDATE ON public.investment_tax_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_investment_updated_at();
