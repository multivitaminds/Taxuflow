-- QuickBooks Desktop Sync System
-- Bidirectional sync between Taxu and QuickBooks Desktop

-- Sync Connections Table
CREATE TABLE IF NOT EXISTS public.qbd_sync_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Connection Info
  connection_name VARCHAR(255) NOT NULL,
  company_file_name VARCHAR(255),
  
  -- Authentication
  app_id VARCHAR(255),
  app_token TEXT,
  
  -- Sync Settings
  sync_direction VARCHAR(50) DEFAULT 'bidirectional', -- import, export, bidirectional
  auto_sync_enabled BOOLEAN DEFAULT false,
  sync_frequency VARCHAR(50), -- manual, hourly, daily, weekly
  
  -- Last Sync
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_sync_status VARCHAR(50),
  last_sync_message TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync Jobs Table
CREATE TABLE IF NOT EXISTS public.qbd_sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.qbd_sync_connections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Job Info
  job_type VARCHAR(50) NOT NULL, -- full-sync, incremental, entity-specific
  sync_direction VARCHAR(50) NOT NULL,
  
  -- Entities to Sync
  entities_to_sync TEXT[], -- customers, invoices, bills, products, etc.
  
  -- Progress
  status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed, cancelled
  progress_percentage INTEGER DEFAULT 0,
  
  -- Results
  records_processed INTEGER DEFAULT 0,
  records_succeeded INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  
  -- Error Handling
  error_message TEXT,
  error_details JSONB,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync Mappings Table (map Taxu entities to QBD entities)
CREATE TABLE IF NOT EXISTS public.qbd_sync_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.qbd_sync_connections(id) ON DELETE CASCADE,
  
  -- Entity Mapping
  entity_type VARCHAR(100) NOT NULL, -- customer, invoice, product, etc.
  taxu_id UUID NOT NULL,
  qbd_id VARCHAR(255) NOT NULL,
  qbd_edit_sequence VARCHAR(50), -- for optimistic locking
  
  -- Sync Info
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_direction VARCHAR(50),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique mappings
  UNIQUE(connection_id, entity_type, taxu_id)
);

-- Sync Conflicts Table
CREATE TABLE IF NOT EXISTS public.qbd_sync_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.qbd_sync_jobs(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES public.qbd_sync_connections(id) ON DELETE CASCADE,
  
  -- Conflict Info
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  conflict_type VARCHAR(50) NOT NULL, -- version-mismatch, duplicate, validation-error
  
  -- Data
  taxu_data JSONB,
  qbd_data JSONB,
  
  -- Resolution
  resolution_status VARCHAR(50) DEFAULT 'pending', -- pending, resolved-taxu, resolved-qbd, resolved-manual
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync Logs Table
CREATE TABLE IF NOT EXISTS public.qbd_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.qbd_sync_jobs(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES public.qbd_sync_connections(id) ON DELETE CASCADE,
  
  -- Log Entry
  log_level VARCHAR(20) NOT NULL, -- info, warning, error
  entity_type VARCHAR(100),
  entity_id UUID,
  message TEXT NOT NULL,
  details JSONB,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync Field Mappings (custom field mapping)
CREATE TABLE IF NOT EXISTS public.qbd_field_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.qbd_sync_connections(id) ON DELETE CASCADE,
  
  -- Field Mapping
  entity_type VARCHAR(100) NOT NULL,
  taxu_field VARCHAR(100) NOT NULL,
  qbd_field VARCHAR(100) NOT NULL,
  
  -- Transformation
  transform_function VARCHAR(100), -- for data type conversions
  default_value TEXT,
  
  -- Direction
  sync_direction VARCHAR(50) DEFAULT 'bidirectional',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync Statistics Table
CREATE TABLE IF NOT EXISTS public.qbd_sync_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.qbd_sync_connections(id) ON DELETE CASCADE,
  
  -- Period
  stat_date DATE NOT NULL,
  
  -- Counts
  total_syncs INTEGER DEFAULT 0,
  successful_syncs INTEGER DEFAULT 0,
  failed_syncs INTEGER DEFAULT 0,
  
  -- Records
  records_imported INTEGER DEFAULT 0,
  records_exported INTEGER DEFAULT 0,
  conflicts_detected INTEGER DEFAULT 0,
  conflicts_resolved INTEGER DEFAULT 0,
  
  -- Performance
  avg_sync_duration_seconds INTEGER,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(connection_id, stat_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_qbd_connections_user ON public.qbd_sync_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_qbd_connections_active ON public.qbd_sync_connections(is_active);

CREATE INDEX IF NOT EXISTS idx_qbd_jobs_connection ON public.qbd_sync_jobs(connection_id);
CREATE INDEX IF NOT EXISTS idx_qbd_jobs_status ON public.qbd_sync_jobs(status);
CREATE INDEX IF NOT EXISTS idx_qbd_jobs_created ON public.qbd_sync_jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_qbd_mappings_connection ON public.qbd_sync_mappings(connection_id);
CREATE INDEX IF NOT EXISTS idx_qbd_mappings_entity ON public.qbd_sync_mappings(entity_type, taxu_id);

CREATE INDEX IF NOT EXISTS idx_qbd_conflicts_job ON public.qbd_sync_conflicts(job_id);
CREATE INDEX IF NOT EXISTS idx_qbd_conflicts_status ON public.qbd_sync_conflicts(resolution_status);

CREATE INDEX IF NOT EXISTS idx_qbd_logs_job ON public.qbd_sync_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_qbd_logs_created ON public.qbd_sync_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_qbd_stats_connection ON public.qbd_sync_statistics(connection_id);
CREATE INDEX IF NOT EXISTS idx_qbd_stats_date ON public.qbd_sync_statistics(stat_date);

-- Enable Row Level Security
ALTER TABLE public.qbd_sync_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qbd_sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qbd_sync_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qbd_sync_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qbd_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qbd_field_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qbd_sync_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own sync connections"
  ON public.qbd_sync_connections FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sync jobs"
  ON public.qbd_sync_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sync jobs"
  ON public.qbd_sync_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view mappings for their connections"
  ON public.qbd_sync_mappings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.qbd_sync_connections
    WHERE qbd_sync_connections.id = qbd_sync_mappings.connection_id
    AND qbd_sync_connections.user_id = auth.uid()
  ));

CREATE POLICY "Users can view conflicts for their connections"
  ON public.qbd_sync_conflicts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.qbd_sync_connections
    WHERE qbd_sync_connections.id = qbd_sync_conflicts.connection_id
    AND qbd_sync_connections.user_id = auth.uid()
  ));

CREATE POLICY "Users can resolve their own conflicts"
  ON public.qbd_sync_conflicts FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.qbd_sync_connections
    WHERE qbd_sync_connections.id = qbd_sync_conflicts.connection_id
    AND qbd_sync_connections.user_id = auth.uid()
  ));

CREATE POLICY "Users can view logs for their connections"
  ON public.qbd_sync_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.qbd_sync_connections
    WHERE qbd_sync_connections.id = qbd_sync_logs.connection_id
    AND qbd_sync_connections.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage field mappings for their connections"
  ON public.qbd_field_mappings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.qbd_sync_connections
    WHERE qbd_sync_connections.id = qbd_field_mappings.connection_id
    AND qbd_sync_connections.user_id = auth.uid()
  ));

CREATE POLICY "Users can view statistics for their connections"
  ON public.qbd_sync_statistics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.qbd_sync_connections
    WHERE qbd_sync_connections.id = qbd_sync_statistics.connection_id
    AND qbd_sync_connections.user_id = auth.uid()
  ));
