-- Advanced AI Agent System for Taxu
-- This script creates tables for AI processing and agent workflows

-- Create AI processing jobs table
CREATE TABLE IF NOT EXISTS ai_processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL, -- 'ocr_extraction', 'data_validation', 'tax_calculation', 'form_generation'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'retry'
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    ai_model VARCHAR(100), -- 'gpt-4', 'claude-3', 'custom-ocr', etc.
    confidence_score DECIMAL(5,4), -- 0.0000 to 1.0000
    processing_time_ms INTEGER,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI training data table for continuous improvement
CREATE TABLE IF NOT EXISTS ai_training_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type VARCHAR(50) NOT NULL,
    input_text TEXT,
    expected_output JSONB,
    actual_output JSONB,
    user_correction JSONB,
    confidence_score DECIMAL(5,4),
    is_validated BOOLEAN DEFAULT FALSE,
    validation_source VARCHAR(50), -- 'user_feedback', 'expert_review', 'automated_check'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI agent workflows table
CREATE TABLE IF NOT EXISTS ai_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    workflow_steps JSONB NOT NULL, -- Array of processing steps
    is_active BOOLEAN DEFAULT TRUE,
    version VARCHAR(20) DEFAULT '1.0',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document analysis results table
CREATE TABLE IF NOT EXISTS document_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50) NOT NULL, -- 'text_extraction', 'field_detection', 'quality_check'
    extracted_text TEXT,
    detected_fields JSONB,
    quality_score DECIMAL(5,4),
    suggestions JSONB,
    processing_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add AI-related columns to existing tables
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ai_processing_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ai_confidence_score DECIMAL(5,4);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ai_suggestions JSONB;

ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS ai_extracted BOOLEAN DEFAULT FALSE;
ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS ai_confidence_score DECIMAL(5,4);
ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS needs_review BOOLEAN DEFAULT FALSE;
ALTER TABLE tax_forms ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Enable RLS for new tables
ALTER TABLE ai_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_analysis ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_processing_jobs
CREATE POLICY "Users can view own AI jobs" ON ai_processing_jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage AI jobs" ON ai_processing_jobs
    FOR ALL USING (auth.role() = 'service_role');

-- RLS policies for document_analysis
CREATE POLICY "Users can view own document analysis" ON document_analysis
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM documents WHERE documents.id = document_analysis.document_id));

CREATE POLICY "Service role can manage document analysis" ON document_analysis
    FOR ALL USING (auth.role() = 'service_role');

-- RLS policies for AI training data (service role only)
ALTER TABLE ai_training_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage training data" ON ai_training_data
    FOR ALL USING (auth.role() = 'service_role');

-- RLS policies for AI workflows (service role only)
ALTER TABLE ai_workflows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage workflows" ON ai_workflows
    FOR ALL USING (auth.role() = 'service_role');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_jobs_user_id ON ai_processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status ON ai_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_document_id ON ai_processing_jobs(document_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_created_at ON ai_processing_jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_document_analysis_document_id ON document_analysis(document_id);
CREATE INDEX IF NOT EXISTS idx_ai_training_document_type ON ai_training_data(document_type);
CREATE INDEX IF NOT EXISTS idx_ai_workflows_active ON ai_workflows(is_active);

-- Add comments
COMMENT ON TABLE ai_processing_jobs IS 'AI processing jobs for document analysis and tax calculations';
COMMENT ON TABLE ai_training_data IS 'Training data for improving AI model accuracy';
COMMENT ON TABLE ai_workflows IS 'Configurable AI processing workflows';
COMMENT ON TABLE document_analysis IS 'Detailed analysis results for uploaded documents';