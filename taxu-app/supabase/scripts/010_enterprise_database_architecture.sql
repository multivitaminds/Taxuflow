-- Create organizations table for multi-tenant support
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    subscription_tier TEXT DEFAULT 'basic',
    subscription_status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create organization_members table
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    permissions JSONB DEFAULT '{}'::jsonb,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Enable RLS on organization_members
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Create ai_processing_jobs table
CREATE TABLE IF NOT EXISTS public.ai_processing_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    job_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    processing_time INTEGER,
    ai_model TEXT,
    confidence_score DECIMAL(5,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on ai_processing_jobs
ALTER TABLE public.ai_processing_jobs ENABLE ROW LEVEL SECURITY;

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    record_id UUID,
    action TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit_logs  
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create webhooks table
CREATE TABLE IF NOT EXISTS public.webhooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL,
    headers JSONB DEFAULT '{}'::jsonb,
    secret_key TEXT,
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on webhooks
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Create webhook_deliveries table for tracking webhook calls
CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_id UUID REFERENCES public.webhooks(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    response_time INTEGER,
    attempt_number INTEGER DEFAULT 1,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_retry_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on webhook_deliveries
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- Add organization_id to existing tables for multi-tenant support
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.taxpayers ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.tax_filings ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_processing_jobs_user_id ON public.ai_processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_processing_jobs_status ON public.ai_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ai_processing_jobs_created_at ON public.ai_processing_jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhooks_org_id ON public.webhooks(organization_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON public.webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_documents_org_id ON public.documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_taxpayers_org_id ON public.taxpayers(organization_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_org_id ON public.tax_filings(organization_id);

-- Create RLS policies for organizations
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Organization admins can update organizations" ON public.organizations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = id AND user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for organization_members
CREATE POLICY "Users can view organization members where they belong" ON public.organization_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members om2
            WHERE om2.organization_id = organization_members.organization_id 
            AND om2.user_id = auth.uid()
        )
    );

CREATE POLICY "Organization admins can manage members" ON public.organization_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = organization_members.organization_id 
            AND user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for AI processing jobs
CREATE POLICY "Users can view own AI processing jobs" ON public.ai_processing_jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI processing jobs" ON public.ai_processing_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI processing jobs" ON public.ai_processing_jobs
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for audit logs
CREATE POLICY "Users can view audit logs for their organization" ON public.audit_logs
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = audit_logs.organization_id 
            AND user_id = auth.uid() 
            AND role IN ('admin', 'owner')
        )
    );

-- Create RLS policies for webhooks
CREATE POLICY "Organization members can view webhooks" ON public.webhooks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = webhooks.organization_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Organization admins can manage webhooks" ON public.webhooks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = webhooks.organization_id 
            AND user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );

-- Create RLS policies for webhook deliveries
CREATE POLICY "Organization members can view webhook deliveries" ON public.webhook_deliveries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.webhooks w
            JOIN public.organization_members om ON w.organization_id = om.organization_id
            WHERE w.id = webhook_deliveries.webhook_id AND om.user_id = auth.uid()
        )
    );

-- Add triggers for updated_at
CREATE TRIGGER handle_updated_at_organizations BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_ai_processing_jobs BEFORE UPDATE ON public.ai_processing_jobs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_webhooks BEFORE UPDATE ON public.webhooks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();