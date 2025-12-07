-- Tax Filing Schema
-- Run after 001_core_user_org_schema.sql

-- Tax Filings
CREATE TABLE IF NOT EXISTS public.tax_filings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  filing_type TEXT NOT NULL CHECK (filing_type IN ('w2', '1099-nec', '1099-misc', '941', '940', '1040')),
  tax_year INTEGER NOT NULL,
  quarter INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'filed', 'accepted', 'rejected', 'corrected')),
  filed_date DATE,
  due_date DATE NOT NULL,
  amount_owed DECIMAL(15,2),
  amount_paid DECIMAL(15,2),
  confirmation_number TEXT,
  provider TEXT,
  provider_response JSONB,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- W2 Forms
CREATE TABLE IF NOT EXISTS public.w2_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filing_id UUID REFERENCES public.tax_filings(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_ssn TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  employee_address JSONB,
  wages DECIMAL(15,2) DEFAULT 0,
  federal_tax_withheld DECIMAL(15,2) DEFAULT 0,
  social_security_wages DECIMAL(15,2) DEFAULT 0,
  social_security_tax DECIMAL(15,2) DEFAULT 0,
  medicare_wages DECIMAL(15,2) DEFAULT 0,
  medicare_tax DECIMAL(15,2) DEFAULT 0,
  state_wages DECIMAL(15,2) DEFAULT 0,
  state_tax_withheld DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1099 Forms
CREATE TABLE IF NOT EXISTS public.form_1099 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filing_id UUID REFERENCES public.tax_filings(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  contractor_tin TEXT NOT NULL,
  contractor_name TEXT NOT NULL,
  contractor_address JSONB,
  form_type TEXT NOT NULL CHECK (form_type IN ('1099-NEC', '1099-MISC')),
  box_1_amount DECIMAL(15,2) DEFAULT 0,
  box_2_amount DECIMAL(15,2) DEFAULT 0,
  box_3_amount DECIMAL(15,2) DEFAULT 0,
  federal_tax_withheld DECIMAL(15,2) DEFAULT 0,
  state_tax_withheld DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form 941 (Quarterly Payroll Tax)
CREATE TABLE IF NOT EXISTS public.form_941 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filing_id UUID REFERENCES public.tax_filings(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  tax_year INTEGER NOT NULL,
  number_of_employees INTEGER DEFAULT 0,
  wages_tips DECIMAL(15,2) DEFAULT 0,
  federal_income_tax DECIMAL(15,2) DEFAULT 0,
  social_security_tax DECIMAL(15,2) DEFAULT 0,
  medicare_tax DECIMAL(15,2) DEFAULT 0,
  total_tax DECIMAL(15,2) DEFAULT 0,
  deposits_made DECIMAL(15,2) DEFAULT 0,
  balance_due DECIMAL(15,2) DEFAULT 0,
  overpayment DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, tax_year, quarter)
);

-- Tax Documents
CREATE TABLE IF NOT EXISTS public.tax_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  filing_id UUID REFERENCES public.tax_filings(id),
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_tax_filings_org_id ON public.tax_filings(organization_id);
CREATE INDEX idx_tax_filings_type_year ON public.tax_filings(filing_type, tax_year);
CREATE INDEX idx_w2_forms_filing_id ON public.w2_forms(filing_id);
CREATE INDEX idx_form_1099_filing_id ON public.form_1099(filing_id);
CREATE INDEX idx_form_941_filing_id ON public.form_941(filing_id);
CREATE INDEX idx_tax_documents_org_id ON public.tax_documents(organization_id);

-- Enable RLS
ALTER TABLE public.tax_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.w2_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_1099 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_941 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Org members access tax filings" ON public.tax_filings
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.org_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );
