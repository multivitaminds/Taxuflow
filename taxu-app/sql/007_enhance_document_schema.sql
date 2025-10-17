-- Enhanced Document Schema for Taxu
-- This script adds tables for document management and tax processing

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processing_status VARCHAR(50) DEFAULT 'pending',
    document_type VARCHAR(50), -- 'w2', '1099', 'receipt', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tax_forms table for processed tax data
CREATE TABLE IF NOT EXISTS tax_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    form_type VARCHAR(50) NOT NULL, -- 'w2', '1099', etc.
    tax_year INTEGER NOT NULL,
    employer_name VARCHAR(255),
    employer_ein VARCHAR(20),
    wages DECIMAL(12,2),
    federal_tax_withheld DECIMAL(12,2),
    state_tax_withheld DECIMAL(12,2),
    social_security_wages DECIMAL(12,2),
    social_security_tax DECIMAL(12,2),
    medicare_wages DECIMAL(12,2),
    medicare_tax DECIMAL(12,2),
    processed_data JSONB, -- Store all extracted data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents" ON documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON documents
    FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for tax_forms
ALTER TABLE tax_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tax forms" ON tax_forms
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax forms" ON tax_forms
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tax forms" ON tax_forms
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tax forms" ON tax_forms
    FOR DELETE USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date);
CREATE INDEX IF NOT EXISTS idx_tax_forms_user_id ON tax_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_forms_tax_year ON tax_forms(tax_year);

-- Add comments
COMMENT ON TABLE documents IS 'User uploaded documents (W-2s, 1099s, etc.)';
COMMENT ON TABLE tax_forms IS 'Processed tax form data extracted from documents';