-- Neobank Platform Schema
-- Run after 001_core_user_org_schema.sql

-- Neobank Accounts
CREATE TABLE IF NOT EXISTS public.neobank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id),
  account_number TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'business', 'investment')),
  name TEXT NOT NULL,
  currency TEXT DEFAULT 'USD',
  balance DECIMAL(15,2) DEFAULT 0,
  available_balance DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
  interest_rate DECIMAL(5,4) DEFAULT 0,
  overdraft_limit DECIMAL(15,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Neobank Transactions
CREATE TABLE IF NOT EXISTS public.neobank_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES public.neobank_accounts(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('debit', 'credit', 'transfer', 'fee', 'interest')),
  category TEXT,
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2),
  description TEXT,
  merchant_name TEXT,
  merchant_category TEXT,
  reference TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
  transaction_date TIMESTAMPTZ NOT NULL,
  posted_date TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Virtual Cards
CREATE TABLE IF NOT EXISTS public.neobank_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES public.neobank_accounts(id) ON DELETE CASCADE,
  card_number TEXT NOT NULL,
  card_type TEXT DEFAULT 'virtual' CHECK (card_type IN ('virtual', 'physical')),
  name_on_card TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  cvv TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'cancelled')),
  spending_limit DECIMAL(15,2),
  merchant_restrictions TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  spent DECIMAL(15,2) DEFAULT 0,
  period TEXT DEFAULT 'monthly' CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  alert_threshold DECIMAL(5,2) DEFAULT 0.80,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Savings Goals
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.neobank_accounts(id),
  name TEXT NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0,
  target_date DATE,
  category TEXT,
  auto_save_enabled BOOLEAN DEFAULT false,
  auto_save_amount DECIMAL(15,2),
  auto_save_frequency TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investments
CREATE TABLE IF NOT EXISTS public.investment_portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('stocks', 'crypto', 'etf', 'mutual_fund', 'bonds', 'mixed')),
  total_value DECIMAL(15,2) DEFAULT 0,
  total_cost DECIMAL(15,2) DEFAULT 0,
  total_gain_loss DECIMAL(15,2) DEFAULT 0,
  gain_loss_percentage DECIMAL(5,2) DEFAULT 0,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.investment_holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.investment_portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity DECIMAL(15,8) NOT NULL,
  average_cost DECIMAL(15,2) NOT NULL,
  current_price DECIMAL(15,2) NOT NULL,
  current_value DECIMAL(15,2) NOT NULL,
  gain_loss DECIMAL(15,2) DEFAULT 0,
  gain_loss_percentage DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loans
CREATE TABLE IF NOT EXISTS public.loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  loan_type TEXT NOT NULL CHECK (loan_type IN ('personal', 'auto', 'mortgage', 'business', 'student')),
  lender TEXT NOT NULL,
  principal_amount DECIMAL(15,2) NOT NULL,
  remaining_balance DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  term_months INTEGER NOT NULL,
  monthly_payment DECIMAL(15,2) NOT NULL,
  next_payment_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paid', 'defaulted')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_neobank_accounts_user_id ON public.neobank_accounts(user_id);
CREATE INDEX idx_neobank_transactions_account_id ON public.neobank_transactions(account_id);
CREATE INDEX idx_neobank_transactions_date ON public.neobank_transactions(transaction_date DESC);
CREATE INDEX idx_neobank_cards_account_id ON public.neobank_cards(account_id);
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_savings_goals_user_id ON public.savings_goals(user_id);
CREATE INDEX idx_investment_portfolios_user_id ON public.investment_portfolios(user_id);
CREATE INDEX idx_loans_user_id ON public.loans(user_id);

-- Enable RLS
ALTER TABLE public.neobank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users access own accounts" ON public.neobank_accounts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own transactions" ON public.neobank_transactions
  FOR ALL USING (
    account_id IN (SELECT id FROM public.neobank_accounts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users access own budgets" ON public.budgets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own goals" ON public.savings_goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own portfolios" ON public.investment_portfolios
  FOR ALL USING (auth.uid() = user_id);
