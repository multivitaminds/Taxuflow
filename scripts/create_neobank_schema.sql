-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Neobank Accounts
CREATE TABLE IF NOT EXISTS public.neobank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id),
    account_number VARCHAR(20) NOT NULL UNIQUE,
    routing_number VARCHAR(20) NOT NULL,
    account_type VARCHAR(50) NOT NULL DEFAULT 'checking', -- checking, savings, tax_bucket
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, frozen, closed
    balance NUMERIC(19, 4) DEFAULT 0.0000,
    currency VARCHAR(3) DEFAULT 'USD',
    external_provider_id VARCHAR(100), -- ID from Unit, Stripe, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Neobank Cards
CREATE TABLE IF NOT EXISTS public.neobank_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES public.neobank_accounts(id) ON DELETE CASCADE,
    card_number_last4 VARCHAR(4) NOT NULL,
    card_type VARCHAR(20) NOT NULL DEFAULT 'virtual', -- virtual, physical
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, frozen, cancelled
    expiration_date DATE,
    cardholder_name VARCHAR(100),
    daily_limit NUMERIC(19, 4),
    external_card_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Neobank Transactions
CREATE TABLE IF NOT EXISTS public.neobank_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES public.neobank_accounts(id) ON DELETE CASCADE,
    card_id UUID REFERENCES public.neobank_cards(id),
    amount NUMERIC(19, 4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_type VARCHAR(50) NOT NULL, -- purchase, deposit, transfer, fee
    description TEXT,
    merchant_name VARCHAR(100),
    merchant_category_code VARCHAR(10),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, posted, failed
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    posted_date TIMESTAMPTZ,
    is_tax_deductible BOOLEAN DEFAULT FALSE,
    tax_category_id UUID REFERENCES public.tax_categories(id),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tax Buckets (Configuration)
CREATE TABLE IF NOT EXISTS public.tax_buckets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., "Federal Tax", "State Tax"
    percentage NUMERIC(5, 2) NOT NULL DEFAULT 0, -- Percentage of income to auto-allocate
    current_balance NUMERIC(19, 4) DEFAULT 0.0000,
    goal_amount NUMERIC(19, 4),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.neobank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neobank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_buckets ENABLE ROW LEVEL SECURITY;

-- Policies (Simple user-based access for now)
CREATE POLICY "Users can view their own neobank accounts" ON public.neobank_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own neobank cards" ON public.neobank_cards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own neobank transactions" ON public.neobank_transactions
    FOR SELECT USING (account_id IN (SELECT id FROM public.neobank_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own tax buckets" ON public.tax_buckets
    FOR ALL USING (auth.uid() = user_id);

-- Seed Data (Optional - helpful for initial dev)
-- Note: This assumes a user exists. In a real scenario, we'd create accounts on signup.
