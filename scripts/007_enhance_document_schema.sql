-- Add document type and AI analysis fields to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS ai_document_type TEXT,
ADD COLUMN IF NOT EXISTS ai_description TEXT,
ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS extracted_data JSONB;

-- Create a more flexible tax_documents table for non-W2 documents
CREATE TABLE IF NOT EXISTS tax_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  
  -- Document classification
  document_type TEXT NOT NULL, -- 'w2', '1099', '1040', 'receipt', 'statement', etc.
  document_subtype TEXT, -- More specific classification
  tax_year INTEGER,
  
  -- AI-extracted data (flexible JSON structure)
  extracted_data JSONB NOT NULL,
  
  -- AI analysis
  ai_summary TEXT,
  ai_confidence DECIMAL(5, 2),
  key_findings TEXT[],
  
  -- Processing metadata
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tax_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tax documents"
  ON tax_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax documents"
  ON tax_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax documents"
  ON tax_documents FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_tax_documents_user_id ON tax_documents(user_id);
CREATE INDEX idx_tax_documents_document_id ON tax_documents(document_id);
CREATE INDEX idx_tax_documents_type ON tax_documents(document_type);
