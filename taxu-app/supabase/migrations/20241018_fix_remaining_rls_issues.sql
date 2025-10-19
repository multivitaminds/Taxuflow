-- Fix remaining RLS security issues
-- Migration: 20241018_fix_remaining_rls_issues.sql

-- =====================================================
-- ENABLE RLS AND CREATE POLICIES FOR MISSING TABLES
-- =====================================================

-- Enable RLS for sales_tax_rates table
ALTER TABLE public.sales_tax_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sales_tax_rates (typically read-only reference data)
CREATE POLICY "Sales tax rates are viewable by all authenticated users" ON public.sales_tax_rates
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can modify sales tax rates" ON public.sales_tax_rates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );

-- Enable RLS for refund_transactions table
ALTER TABLE public.refund_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for refund_transactions
CREATE POLICY "Users can view own refund transactions" ON public.refund_transactions
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = refund_transactions.organization_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own refund transactions" ON public.refund_transactions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        (organization_id IS NULL OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = refund_transactions.organization_id 
            AND user_id = auth.uid()
        ))
    );

CREATE POLICY "Users can update own refund transactions" ON public.refund_transactions
    FOR UPDATE USING (
        auth.uid() = user_id AND
        (organization_id IS NULL OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = refund_transactions.organization_id 
            AND user_id = auth.uid()
        ))
    );

CREATE POLICY "Admins can delete refund transactions" ON public.refund_transactions
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = refund_transactions.organization_id 
            AND user_id = auth.uid() 
            AND role IN ('admin', 'owner')
        )
    );

-- Enable RLS for credit_applications table
ALTER TABLE public.credit_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credit_applications
CREATE POLICY "Users can view own credit applications" ON public.credit_applications
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = credit_applications.organization_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own credit applications" ON public.credit_applications
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        (organization_id IS NULL OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = credit_applications.organization_id 
            AND user_id = auth.uid()
        ))
    );

CREATE POLICY "Users can update own credit applications" ON public.credit_applications
    FOR UPDATE USING (
        auth.uid() = user_id AND
        (organization_id IS NULL OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = credit_applications.organization_id 
            AND user_id = auth.uid()
        ))
    );

CREATE POLICY "Admins can delete credit applications" ON public.credit_applications
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = credit_applications.organization_id 
            AND user_id = auth.uid() 
            AND role IN ('admin', 'owner')
        )
    );

-- Enable RLS for credit_memo_items table
ALTER TABLE public.credit_memo_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credit_memo_items
CREATE POLICY "Users can view credit memo items through parent credit memo" ON public.credit_memo_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.credit_memos cm
            WHERE cm.id = credit_memo_items.credit_memo_id
            AND (
                auth.uid() = cm.user_id OR
                EXISTS (
                    SELECT 1 FROM public.organization_members 
                    WHERE organization_id = cm.organization_id 
                    AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can manage credit memo items through parent credit memo" ON public.credit_memo_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.credit_memos cm
            WHERE cm.id = credit_memo_items.credit_memo_id
            AND (
                auth.uid() = cm.user_id OR
                EXISTS (
                    SELECT 1 FROM public.organization_members 
                    WHERE organization_id = cm.organization_id 
                    AND user_id = auth.uid()
                )
            )
        )
    );

-- Enable RLS for credit_memos table
ALTER TABLE public.credit_memos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credit_memos
CREATE POLICY "Users can view own credit memos" ON public.credit_memos
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = credit_memos.organization_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own credit memos" ON public.credit_memos
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        (organization_id IS NULL OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = credit_memos.organization_id 
            AND user_id = auth.uid()
        ))
    );

CREATE POLICY "Users can update own credit memos" ON public.credit_memos
    FOR UPDATE USING (
        auth.uid() = user_id AND
        (organization_id IS NULL OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = credit_memos.organization_id 
            AND user_id = auth.uid()
        ))
    );

CREATE POLICY "Admins can delete credit memos" ON public.credit_memos
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = credit_memos.organization_id 
            AND user_id = auth.uid() 
            AND role IN ('admin', 'owner')
        )
    );

-- Enable RLS for tax_liability_periods table
ALTER TABLE public.tax_liability_periods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tax_liability_periods
CREATE POLICY "Users can view tax liability periods for their taxpayers" ON public.tax_liability_periods
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.taxpayers t
            WHERE t.id = tax_liability_periods.taxpayer_id
            AND (
                auth.uid() = t.user_id OR
                EXISTS (
                    SELECT 1 FROM public.organization_members 
                    WHERE organization_id = t.organization_id 
                    AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can manage tax liability periods for their taxpayers" ON public.tax_liability_periods
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.taxpayers t
            WHERE t.id = tax_liability_periods.taxpayer_id
            AND (
                auth.uid() = t.user_id OR
                EXISTS (
                    SELECT 1 FROM public.organization_members 
                    WHERE organization_id = t.organization_id 
                    AND user_id = auth.uid()
                )
            )
        )
    );

-- =====================================================
-- ADD PERFORMANCE INDEXES FOR NEW TABLES
-- =====================================================

-- Indexes for sales_tax_rates
CREATE INDEX IF NOT EXISTS idx_sales_tax_rates_jurisdiction ON public.sales_tax_rates(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_sales_tax_rates_effective_date ON public.sales_tax_rates(effective_date);
CREATE INDEX IF NOT EXISTS idx_sales_tax_rates_active ON public.sales_tax_rates(is_active) WHERE is_active = true;

-- Indexes for refund_transactions
CREATE INDEX IF NOT EXISTS idx_refund_transactions_user_id ON public.refund_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_transactions_org_id ON public.refund_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_refund_transactions_status ON public.refund_transactions(status);
CREATE INDEX IF NOT EXISTS idx_refund_transactions_created_at ON public.refund_transactions(created_at DESC);

-- Indexes for credit_applications
CREATE INDEX IF NOT EXISTS idx_credit_applications_user_id ON public.credit_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_applications_org_id ON public.credit_applications(organization_id);
CREATE INDEX IF NOT EXISTS idx_credit_applications_status ON public.credit_applications(status);
CREATE INDEX IF NOT EXISTS idx_credit_applications_tax_year ON public.credit_applications(tax_year);

-- Indexes for credit_memos
CREATE INDEX IF NOT EXISTS idx_credit_memos_user_id ON public.credit_memos(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_memos_org_id ON public.credit_memos(organization_id);
CREATE INDEX IF NOT EXISTS idx_credit_memos_created_at ON public.credit_memos(created_at DESC);

-- Indexes for credit_memo_items
CREATE INDEX IF NOT EXISTS idx_credit_memo_items_memo_id ON public.credit_memo_items(credit_memo_id);
CREATE INDEX IF NOT EXISTS idx_credit_memo_items_item_type ON public.credit_memo_items(item_type);

-- Indexes for tax_liability_periods
CREATE INDEX IF NOT EXISTS idx_tax_liability_periods_taxpayer_id ON public.tax_liability_periods(taxpayer_id);
CREATE INDEX IF NOT EXISTS idx_tax_liability_periods_period ON public.tax_liability_periods(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_tax_liability_periods_due_date ON public.tax_liability_periods(due_date);

-- =====================================================
-- ADD MISSING COLUMNS IF NEEDED
-- =====================================================

-- Add common audit columns if they don't exist
DO $$ 
BEGIN
    -- Add user_id to refund_transactions if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refund_transactions' AND column_name = 'user_id') THEN
        ALTER TABLE public.refund_transactions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Add organization_id to refund_transactions if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refund_transactions' AND column_name = 'organization_id') THEN
        ALTER TABLE public.refund_transactions ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;
    
    -- Add user_id to credit_applications if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_applications' AND column_name = 'user_id') THEN
        ALTER TABLE public.credit_applications ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Add organization_id to credit_applications if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_applications' AND column_name = 'organization_id') THEN
        ALTER TABLE public.credit_applications ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;
    
    -- Add user_id to credit_memos if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_memos' AND column_name = 'user_id') THEN
        ALTER TABLE public.credit_memos ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Add organization_id to credit_memos if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_memos' AND column_name = 'organization_id') THEN
        ALTER TABLE public.credit_memos ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;
END $$;

-- =====================================================
-- ANALYZE TABLES FOR BETTER PERFORMANCE
-- =====================================================

ANALYZE public.sales_tax_rates;
ANALYZE public.refund_transactions;
ANALYZE public.credit_applications;
ANALYZE public.credit_memo_items;
ANALYZE public.credit_memos;
ANALYZE public.tax_liability_periods;

-- Add helpful comments
COMMENT ON TABLE public.sales_tax_rates IS 'Reference data for sales tax rates by jurisdiction';
COMMENT ON TABLE public.refund_transactions IS 'Tax refund transaction records';
COMMENT ON TABLE public.credit_applications IS 'Tax credit applications and claims';
COMMENT ON TABLE public.credit_memos IS 'Credit memo records for tax adjustments';
COMMENT ON TABLE public.credit_memo_items IS 'Line items for credit memos';
COMMENT ON TABLE public.tax_liability_periods IS 'Tax liability periods and due dates';