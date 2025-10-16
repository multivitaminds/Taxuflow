-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE,
    ai_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
CREATE POLICY "Users can view own documents" ON public.documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);

-- Create taxpayers table
CREATE TABLE IF NOT EXISTS public.taxpayers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address JSONB,
    ssn_encrypted TEXT,
    date_of_birth DATE,
    filing_status TEXT,
    dependents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on taxpayers
ALTER TABLE public.taxpayers ENABLE ROW LEVEL SECURITY;

-- Create policies for taxpayers
CREATE POLICY "Users can view own taxpayers" ON public.taxpayers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own taxpayers" ON public.taxpayers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own taxpayers" ON public.taxpayers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own taxpayers" ON public.taxpayers
    FOR DELETE USING (auth.uid() = user_id);

-- Create tax_filings table
CREATE TABLE IF NOT EXISTS public.tax_filings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    taxpayer_id UUID REFERENCES public.taxpayers(id) ON DELETE CASCADE NOT NULL,
    tax_year INTEGER NOT NULL,
    filing_status TEXT NOT NULL,
    form_type TEXT NOT NULL DEFAULT '1040',
    status TEXT NOT NULL DEFAULT 'draft',
    data JSONB DEFAULT '{}'::jsonb,
    calculations JSONB DEFAULT '{}'::jsonb,
    documents UUID[] DEFAULT '{}',
    filed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(taxpayer_id, tax_year)
);

-- Enable RLS on tax_filings
ALTER TABLE public.tax_filings ENABLE ROW LEVEL SECURITY;

-- Create policies for tax_filings
CREATE POLICY "Users can view own tax filings" ON public.tax_filings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax filings" ON public.tax_filings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tax filings" ON public.tax_filings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tax filings" ON public.tax_filings
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON public.documents(upload_date);
CREATE INDEX IF NOT EXISTS idx_taxpayers_user_id ON public.taxpayers(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_user_id ON public.tax_filings(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_taxpayer_id ON public.tax_filings(taxpayer_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_tax_year ON public.tax_filings(tax_year);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_documents BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_taxpayers BEFORE UPDATE ON public.taxpayers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_tax_filings BEFORE UPDATE ON public.tax_filings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();