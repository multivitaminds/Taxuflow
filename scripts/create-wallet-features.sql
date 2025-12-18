-- Wallet Features for Neobank
-- This adds account management, external linking, and statements

-- 1. External Bank Connections (for ACH transfers)
CREATE TABLE IF NOT EXISTS public.neobank_external_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    account_number_last4 TEXT NOT NULL,
    routing_number TEXT NOT NULL,
    account_type TEXT NOT NULL, -- checking, savings
    plaid_account_id TEXT,
    plaid_access_token TEXT,
    status TEXT DEFAULT 'pending_verification', -- pending_verification, verified, failed
    verification_method TEXT, -- microdeposits, instant
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Account Statements
CREATE TABLE IF NOT EXISTS public.neobank_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.neobank_accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    statement_period_start DATE NOT NULL,
    statement_period_end DATE NOT NULL,
    opening_balance NUMERIC(19, 4) NOT NULL,
    closing_balance NUMERIC(19, 4) NOT NULL,
    total_deposits NUMERIC(19, 4) DEFAULT 0,
    total_withdrawals NUMERIC(19, 4) DEFAULT 0,
    total_fees NUMERIC(19, 4) DEFAULT 0,
    statement_pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Account Settings
CREATE TABLE IF NOT EXISTS public.neobank_account_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.neobank_accounts(id) ON DELETE CASCADE UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    overdraft_protection_enabled BOOLEAN DEFAULT FALSE,
    overdraft_limit NUMERIC(19, 4) DEFAULT 0,
    low_balance_alert_threshold NUMERIC(19, 4) DEFAULT 100,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    auto_save_percentage NUMERIC(5, 2) DEFAULT 0,
    auto_save_to_account_id UUID REFERENCES public.neobank_accounts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Transfer History (ACH, Internal)
CREATE TABLE IF NOT EXISTS public.neobank_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    from_account_id UUID REFERENCES public.neobank_accounts(id),
    to_account_id UUID REFERENCES public.neobank_accounts(id),
    external_account_id UUID REFERENCES public.neobank_external_accounts(id),
    amount NUMERIC(19, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    transfer_type TEXT NOT NULL, -- internal, ach_debit, ach_credit, wire
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    scheduled_date DATE,
    completed_date TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    reference_number TEXT,
    memo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Card Requests (for physical cards)
CREATE TABLE IF NOT EXISTS public.neobank_card_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES public.neobank_accounts(id) ON DELETE CASCADE,
    card_type TEXT NOT NULL, -- physical, virtual
    shipping_address JSONB,
    status TEXT DEFAULT 'pending', -- pending, approved, shipped, delivered, rejected
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    tracking_number TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Spending Limits
CREATE TABLE IF NOT EXISTS public.neobank_spending_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES public.neobank_cards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    limit_type TEXT NOT NULL, -- daily, weekly, monthly, per_transaction
    limit_amount NUMERIC(19, 4) NOT NULL,
    current_spent NUMERIC(19, 4) DEFAULT 0,
    reset_date DATE,
    merchant_category_code TEXT, -- optional: limit by category
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.neobank_external_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_account_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_card_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_spending_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own external accounts"
  ON public.neobank_external_accounts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own statements"
  ON public.neobank_statements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their account settings"
  ON public.neobank_account_settings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own transfers"
  ON public.neobank_transfers FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own card requests"
  ON public.neobank_card_requests FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own spending limits"
  ON public.neobank_spending_limits FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_external_accounts_user ON public.neobank_external_accounts(user_id);
CREATE INDEX idx_statements_account ON public.neobank_statements(account_id);
CREATE INDEX idx_statements_user ON public.neobank_statements(user_id);
CREATE INDEX idx_transfers_user ON public.neobank_transfers(user_id);
CREATE INDEX idx_transfers_from_account ON public.neobank_transfers(from_account_id);
CREATE INDEX idx_transfers_to_account ON public.neobank_transfers(to_account_id);
CREATE INDEX idx_card_requests_user ON public.neobank_card_requests(user_id);
CREATE INDEX idx_spending_limits_card ON public.neobank_spending_limits(card_id);
