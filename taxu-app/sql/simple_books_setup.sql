-- Simple Books Schema Setup (no auth dependencies)
-- Run this first to create the basic structure

BEGIN;

-- Create books schema
CREATE SCHEMA IF NOT EXISTS books;

-- Organizations
CREATE TABLE IF NOT EXISTS books.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Accounts with organization_id
CREATE TABLE IF NOT EXISTS books.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  type text NOT NULL,
  subtype text,
  currency text DEFAULT 'USD',
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contacts
CREATE TABLE IF NOT EXISTS books.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  kind text CHECK (kind IN ('customer','vendor')) NOT NULL,
  display_name text NOT NULL,
  email text,
  phone text,
  tax_id text,
  billing_address jsonb,
  shipping_address jsonb,
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS books.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES books.contacts(id),
  number text,
  status text CHECK (status IN ('draft','open','paid','void','overdue')) DEFAULT 'open',
  issue_date date NOT NULL,
  due_date date,
  currency text DEFAULT 'USD',
  subtotal numeric(14,2) DEFAULT 0,
  tax_amount numeric(14,2) DEFAULT 0,
  total_amount numeric(14,2) DEFAULT 0,
  balance numeric(14,2) DEFAULT 0,
  memo text,
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoice lines
CREATE TABLE IF NOT EXISTS books.invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES books.invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(14,4) DEFAULT 1,
  unit_price numeric(14,2) DEFAULT 0,
  line_amount numeric(14,2) NOT NULL DEFAULT 0,
  external_id text
);

-- Bills
CREATE TABLE IF NOT EXISTS books.bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES books.contacts(id),
  number text,
  status text CHECK (status IN ('open','paid','void','overdue')) DEFAULT 'open',
  issue_date date NOT NULL,
  due_date date,
  currency text DEFAULT 'USD',
  subtotal numeric(14,2) DEFAULT 0,
  tax_amount numeric(14,2) DEFAULT 0,
  total_amount numeric(14,2) DEFAULT 0,
  balance numeric(14,2) DEFAULT 0,
  memo text,
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bill lines
CREATE TABLE IF NOT EXISTS books.bill_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id uuid NOT NULL REFERENCES books.bills(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(14,4) DEFAULT 1,
  unit_price numeric(14,2) DEFAULT 0,
  line_amount numeric(14,2) NOT NULL DEFAULT 0,
  external_id text
);

-- Payments
CREATE TABLE IF NOT EXISTS books.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  direction text CHECK (direction IN ('in','out')) NOT NULL,
  method text,
  amount numeric(14,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_date date NOT NULL,
  reference text,
  contact_id uuid REFERENCES books.contacts(id),
  memo text,
  external_id text,
  external_rev text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Missing tables from your v0 errors
CREATE TABLE IF NOT EXISTS deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  amount numeric(14,2) NOT NULL,
  deduction_type text,
  tax_year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recurring_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  amount numeric(14,2) NOT NULL,
  frequency text CHECK (frequency IN ('daily','weekly','monthly','yearly')),
  next_occurrence date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  position text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_books_accounts_org_id ON books.accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_books_contacts_org_id ON books.contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_books_invoices_org_id ON books.invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_books_bills_org_id ON books.bills(organization_id);
CREATE INDEX IF NOT EXISTS idx_books_payments_org_id ON books.payments(organization_id);

COMMIT;

-- Success message
SELECT 'Simple books schema created successfully!' as result;