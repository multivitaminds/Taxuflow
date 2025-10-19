-- Custom Fields API (QuickBooks Premium API Parity)
-- Allows users to add custom fields to any entity type

-- Custom Field Definitions Table
CREATE TABLE IF NOT EXISTS public.custom_field_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Field Configuration
  entity_type VARCHAR(100) NOT NULL, -- customer, invoice, project, product, etc.
  field_name VARCHAR(100) NOT NULL,
  field_label VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL, -- text, number, date, boolean, dropdown, multi-select
  
  -- Field Options
  field_options JSONB, -- for dropdown/multi-select: {"options": ["Option 1", "Option 2"]}
  default_value TEXT,
  
  -- Validation
  is_required BOOLEAN DEFAULT false,
  min_value NUMERIC,
  max_value NUMERIC,
  min_length INTEGER,
  max_length INTEGER,
  validation_regex TEXT,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  help_text TEXT,
  placeholder TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique field names per entity type per user
  UNIQUE(user_id, entity_type, field_name)
);

-- Custom Field Values Table
CREATE TABLE IF NOT EXISTS public.custom_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_definition_id UUID NOT NULL REFERENCES public.custom_field_definitions(id) ON DELETE CASCADE,
  
  -- Entity Reference
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Value Storage (polymorphic)
  text_value TEXT,
  number_value NUMERIC,
  date_value DATE,
  boolean_value BOOLEAN,
  json_value JSONB, -- for complex values like multi-select
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one value per field per entity
  UNIQUE(field_definition_id, entity_id)
);

-- Custom Field Templates Table (pre-built field sets)
CREATE TABLE IF NOT EXISTS public.custom_field_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Template Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  entity_type VARCHAR(100) NOT NULL,
  
  -- Template Data
  fields JSONB NOT NULL, -- array of field definitions
  
  -- Sharing
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom Field Groups (organize fields into sections)
CREATE TABLE IF NOT EXISTS public.custom_field_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Group Info
  entity_type VARCHAR(100) NOT NULL,
  group_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_collapsible BOOLEAN DEFAULT true,
  is_expanded_by_default BOOLEAN DEFAULT true,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link fields to groups
ALTER TABLE public.custom_field_definitions ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.custom_field_groups(id) ON DELETE SET NULL;

-- Custom Field Audit Log
CREATE TABLE IF NOT EXISTS public.custom_field_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_value_id UUID REFERENCES public.custom_field_values(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Change Tracking
  action VARCHAR(50) NOT NULL, -- created, updated, deleted
  old_value TEXT,
  new_value TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_custom_field_defs_user ON public.custom_field_definitions(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_defs_entity ON public.custom_field_definitions(entity_type);
CREATE INDEX IF NOT EXISTS idx_custom_field_defs_active ON public.custom_field_definitions(is_active);

CREATE INDEX IF NOT EXISTS idx_custom_field_values_def ON public.custom_field_values(field_definition_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_entity ON public.custom_field_values(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_custom_field_groups_user ON public.custom_field_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_groups_entity ON public.custom_field_groups(entity_type);

CREATE INDEX IF NOT EXISTS idx_custom_field_audit_value ON public.custom_field_audit_log(field_value_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_audit_created ON public.custom_field_audit_log(created_at);

-- Enable Row Level Security
ALTER TABLE public.custom_field_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_field_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_field_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_field_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_field_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_field_definitions
CREATE POLICY "Users can view their own field definitions"
  ON public.custom_field_definitions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own field definitions"
  ON public.custom_field_definitions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own field definitions"
  ON public.custom_field_definitions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own field definitions"
  ON public.custom_field_definitions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for custom_field_values
CREATE POLICY "Users can view field values for their entities"
  ON public.custom_field_values FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.custom_field_definitions
    WHERE custom_field_definitions.id = custom_field_values.field_definition_id
    AND custom_field_definitions.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage field values for their entities"
  ON public.custom_field_values FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.custom_field_definitions
    WHERE custom_field_definitions.id = custom_field_values.field_definition_id
    AND custom_field_definitions.user_id = auth.uid()
  ));

-- RLS Policies for custom_field_templates
CREATE POLICY "Users can view public templates or their own"
  ON public.custom_field_templates FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own templates"
  ON public.custom_field_templates FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for custom_field_groups
CREATE POLICY "Users can view their own field groups"
  ON public.custom_field_groups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own field groups"
  ON public.custom_field_groups FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for custom_field_audit_log
CREATE POLICY "Users can view audit logs for their fields"
  ON public.custom_field_audit_log FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.custom_field_values
    JOIN public.custom_field_definitions ON custom_field_definitions.id = custom_field_values.field_definition_id
    WHERE custom_field_values.id = custom_field_audit_log.field_value_id
    AND custom_field_definitions.user_id = auth.uid()
  ));

-- Function to get custom fields for an entity
CREATE OR REPLACE FUNCTION get_custom_fields(
  p_entity_type VARCHAR,
  p_entity_id UUID,
  p_user_id UUID
)
RETURNS TABLE (
  field_name VARCHAR,
  field_label VARCHAR,
  field_type VARCHAR,
  value TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cfd.field_name,
    cfd.field_label,
    cfd.field_type,
    COALESCE(
      cfv.text_value,
      cfv.number_value::TEXT,
      cfv.date_value::TEXT,
      cfv.boolean_value::TEXT,
      cfv.json_value::TEXT
    ) as value
  FROM public.custom_field_definitions cfd
  LEFT JOIN public.custom_field_values cfv 
    ON cfv.field_definition_id = cfd.id 
    AND cfv.entity_id = p_entity_id
  WHERE cfd.entity_type = p_entity_type
    AND cfd.user_id = p_user_id
    AND cfd.is_active = true
  ORDER BY cfd.display_order, cfd.field_label;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
