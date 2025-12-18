-- Demo Investment Data for Testing
-- This script creates sample investment holdings and transactions for demo mode

-- Insert demo holdings (assumes user exists)
INSERT INTO public.investment_holdings (
  user_id,
  symbol,
  name,
  asset_type,
  shares,
  average_cost_basis,
  current_price,
  market_value,
  unrealized_gain_loss,
  unrealized_gain_loss_percent,
  purchase_date,
  holding_period_days,
  is_long_term_holding,
  sector,
  industry,
  market_cap_category,
  dividend_yield
) VALUES
  -- Tech stocks with gains
  (
    (SELECT id FROM auth.users LIMIT 1),
    'AAPL',
    'Apple Inc.',
    'stock',
    50,
    150.00,
    185.00,
    9250.00,
    1750.00,
    23.33,
    '2023-01-15',
    680,
    true,
    'Technology',
    'Consumer Electronics',
    'large',
    0.52
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    'MSFT',
    'Microsoft Corporation',
    'stock',
    30,
    280.00,
    380.00,
    11400.00,
    3000.00,
    35.71,
    '2022-06-10',
    900,
    true,
    'Technology',
    'Software',
    'large',
    0.78
  ),
  -- ETF with moderate gain
  (
    (SELECT id FROM auth.users LIMIT 1),
    'VTI',
    'Vanguard Total Stock Market ETF',
    'etf',
    100,
    200.00,
    235.00,
    23500.00,
    3500.00,
    17.50,
    '2023-03-01',
    630,
    true,
    'Diversified',
    'Index Fund',
    'large',
    1.35
  ),
  -- Stock with loss (tax-loss harvesting opportunity)
  (
    (SELECT id FROM auth.users LIMIT 1),
    'ROKU',
    'Roku Inc.',
    'stock',
    75,
    95.00,
    65.00,
    4875.00,
    -2250.00,
    -31.58,
    '2024-02-15',
    290,
    false,
    'Technology',
    'Entertainment',
    'mid',
    0.00
  ),
  -- Bond ETF
  (
    (SELECT id FROM auth.users LIMIT 1),
    'BND',
    'Vanguard Total Bond Market ETF',
    'etf',
    150,
    78.00,
    74.50,
    11175.00,
    -525.00,
    -4.49,
    '2023-09-01',
    456,
    true,
    'Fixed Income',
    'Bond Fund',
    'large',
    3.85
  );

-- Insert demo transactions
INSERT INTO public.investment_transactions (
  user_id,
  transaction_type,
  symbol,
  shares,
  price_per_share,
  total_amount,
  commission,
  fees,
  transaction_date,
  settlement_date,
  cost_basis
) VALUES
  -- Initial AAPL purchase
  (
    (SELECT id FROM auth.users LIMIT 1),
    'buy',
    'AAPL',
    50,
    150.00,
    7500.00,
    0.00,
    1.00,
    '2023-01-15',
    '2023-01-17',
    7501.00
  ),
  -- MSFT purchase
  (
    (SELECT id FROM auth.users LIMIT 1),
    'buy',
    'MSFT',
    30,
    280.00,
    8400.00,
    0.00,
    1.00,
    '2022-06-10',
    '2022-06-12',
    8401.00
  ),
  -- VTI purchase
  (
    (SELECT id FROM auth.users LIMIT 1),
    'buy',
    'VTI',
    100,
    200.00,
    20000.00,
    0.00,
    2.00,
    '2023-03-01',
    '2023-03-03',
    20002.00
  ),
  -- ROKU purchase (at loss)
  (
    (SELECT id FROM auth.users LIMIT 1),
    'buy',
    'ROKU',
    75,
    95.00,
    7125.00,
    0.00,
    1.00,
    '2024-02-15',
    '2024-02-17',
    7126.00
  ),
  -- Dividend from AAPL
  (
    (SELECT id FROM auth.users LIMIT 1),
    'dividend',
    'AAPL',
    NULL,
    NULL,
    24.00,
    0.00,
    0.00,
    '2024-08-15',
    '2024-08-15',
    NULL
  );

-- Insert demo watchlist
INSERT INTO public.investment_watchlist (
  user_id,
  symbol,
  name,
  asset_type,
  added_price,
  target_buy_price,
  notes,
  tags
) VALUES
  (
    (SELECT id FROM auth.users LIMIT 1),
    'NVDA',
    'NVIDIA Corporation',
    'stock',
    475.00,
    450.00,
    'Waiting for pullback to add to position',
    ARRAY['tech', 'ai', 'growth']
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    'QQQ',
    'Invesco QQQ Trust',
    'etf',
    385.00,
    375.00,
    'Tech-heavy ETF for portfolio diversification',
    ARRAY['etf', 'tech', 'nasdaq']
  );

-- Insert demo auto-invest strategy
INSERT INTO public.investment_auto_invest_strategies (
  user_id,
  strategy_name,
  description,
  strategy_type,
  investment_amount,
  allocation_method,
  allocations,
  frequency,
  recurring_day,
  next_execution_date,
  tax_loss_harvesting_enabled,
  is_active
) VALUES
  (
    (SELECT id FROM auth.users LIMIT 1),
    'Monthly Index Fund Strategy',
    'Dollar-cost averaging into diversified index funds',
    'recurring',
    1000.00,
    'custom',
    '[
      {"symbol": "VTI", "allocation_percent": 60, "name": "Vanguard Total Stock Market ETF"},
      {"symbol": "VXUS", "allocation_percent": 30, "name": "Vanguard Total International Stock ETF"},
      {"symbol": "BND", "allocation_percent": 10, "name": "Vanguard Total Bond Market ETF"}
    ]'::jsonb,
    'monthly',
    1,
    (CURRENT_DATE + INTERVAL '1 month')::DATE,
    true,
    true
  );

-- Insert tax-loss harvesting opportunity for ROKU
INSERT INTO public.investment_tax_opportunities (
  user_id,
  holding_id,
  opportunity_type,
  symbol,
  potential_tax_savings,
  current_loss_amount,
  replacement_symbol,
  holding_period_days,
  status,
  priority_score
) VALUES
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM public.investment_holdings WHERE symbol = 'ROKU' LIMIT 1),
    'tax_loss_harvest',
    'ROKU',
    787.50, -- 35% tax bracket on $2,250 loss
    -2250.00,
    'GOOGL', -- Alternative streaming play
    290,
    'identified',
    85
  );
