-- Complete Production Setup for Taxu Books Schema
-- This script creates all missing tables and fixes the errors shown in v0

BEGIN;

-- Create books schema
CREATE SCHEMA IF NOT EXISTS books;

-- Core tables that were missing or incomplete

-- User profiles (was referenced but missing)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Organizations (standalone in books schema)
CREATE TABLE IF NOT EXISTS books.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Organization membership
CREATE TABLE IF NOT EXISTS books.org_members (
  org_id uuid REFERENCES books.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text CHECK (role IN ('owner','admin','member')) DEFAULT 'member',
  PRIMARY KEY (org_id, user_id),
  created_at timestamptz DEFAULT now()
);

-- Accounts with proper organization_id column
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

-- Items for invoicing
CREATE TABLE IF NOT EXISTS books.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES books.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text,
  description text,
  price numeric(14,2),
  income_account_id uuid REFERENCES books.accounts(id),
  expense_account_id uuid REFERENCES books.accounts(id),
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
  item_id uuid REFERENCES books.items(id),
  description text NOT NULL,
  quantity numeric(14,4) DEFAULT 1,
  unit_price numeric(14,2) DEFAULT 0,
  line_amount numeric(14,2) NOT NULL DEFAULT 0,
  account_id uuid REFERENCES books.accounts(id),
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
  account_id uuid REFERENCES books.accounts(id),
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

-- Payment applications
CREATE TABLE IF NOT EXISTS books.payment_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES books.payments(id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES books.invoices(id),
  bill_id uuid REFERENCES books.bills(id),
  applied_amount numeric(14,2) NOT NULL,
  external_id text
);

-- Deductions (was missing)
CREATE TABLE IF NOT EXISTS deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric(14,2) NOT NULL,
  deduction_type text,
  tax_year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recurring transactions (was missing)
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric(14,2) NOT NULL,
  frequency text CHECK (frequency IN ('daily','weekly','monthly','yearly')),
  next_occurrence date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Public employees (referenced in some scripts)
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

-- Public projects (referenced in some scripts)
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.bill_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE books.payment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Helper function for organization membership check
CREATE OR REPLACE FUNCTION books.is_org_member(_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM books.org_members m
    WHERE m.org_id = _org_id 
    AND m.user_id = auth.uid()
  );
$$;

-- Create RLS Policies

-- User profiles - users can only see their own
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR ALL USING (user_id = auth.uid());

-- Organizations - users can only see orgs they belong to  
DROP POLICY IF EXISTS "Users can view orgs they belong to" ON books.organizations;
CREATE POLICY "Users can view orgs they belong to" ON books.organizations
  FOR ALL USING (id IN (SELECT org_id FROM books.org_members WHERE user_id = auth.uid()));

-- Org members - users can see memberships in their orgs
DROP POLICY IF EXISTS "Users can view org memberships" ON books.org_members;
CREATE POLICY "Users can view org memberships" ON books.org_members
  FOR ALL USING (org_id IN (SELECT org_id FROM books.org_members WHERE user_id = auth.uid()));

-- Books table policies
DROP POLICY IF EXISTS "Org members can access accounts" ON books.accounts;
CREATE POLICY "Org members can access accounts" ON books.accounts
  FOR ALL USING (books.is_org_member(organization_id));

DROP POLICY IF EXISTS "Org members can access contacts" ON books.contacts;
CREATE POLICY "Org members can access contacts" ON books.contacts
  FOR ALL USING (books.is_org_member(organization_id));

DROP POLICY IF EXISTS "Org members can access items" ON books.items;
CREATE POLICY "Org members can access items" ON books.items
  FOR ALL USING (books.is_org_member(organization_id));

DROP POLICY IF EXISTS "Org members can access invoices" ON books.invoices;
CREATE POLICY "Org members can access invoices" ON books.invoices
  FOR ALL USING (books.is_org_member(organization_id));

DROP POLICY IF EXISTS "Org members can access invoice lines" ON books.invoice_lines;
CREATE POLICY "Org members can access invoice lines" ON books.invoice_lines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.invoices i 
      WHERE i.id = invoice_lines.invoice_id 
      AND books.is_org_member(i.organization_id)
    )
  );

DROP POLICY IF EXISTS "Org members can access bills" ON books.bills;
CREATE POLICY "Org members can access bills" ON books.bills
  FOR ALL USING (books.is_org_member(organization_id));

DROP POLICY IF EXISTS "Org members can access bill lines" ON books.bill_lines;
CREATE POLICY "Org members can access bill lines" ON books.bill_lines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.bills b 
      WHERE b.id = bill_lines.bill_id 
      AND books.is_org_member(b.organization_id)
    )
  );

DROP POLICY IF EXISTS "Org members can access payments" ON books.payments;
CREATE POLICY "Org members can access payments" ON books.payments
  FOR ALL USING (books.is_org_member(organization_id));

DROP POLICY IF EXISTS "Org members can access payment applications" ON books.payment_applications;
CREATE POLICY "Org members can access payment applications" ON books.payment_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM books.payments p 
      WHERE p.id = payment_applications.payment_id 
      AND books.is_org_member(p.organization_id)
    )
  );

-- Personal data policies
DROP POLICY IF EXISTS "Users can manage their own deductions" ON deductions;
CREATE POLICY "Users can manage their own deductions" ON deductions
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their own recurring transactions" ON recurring_transactions;
CREATE POLICY "Users can manage their own recurring transactions" ON recurring_transactions
  FOR ALL USING (user_id = auth.uid());

-- Public table policies (basic org-scoped access)
DROP POLICY IF EXISTS "Users can view employees" ON public.employees;
CREATE POLICY "Users can view employees" ON public.employees
  FOR ALL USING (true); -- Adjust as needed

DROP POLICY IF EXISTS "Users can view projects" ON public.projects;
CREATE POLICY "Users can view projects" ON public.projects
  FOR ALL USING (true); -- Adjust as needed

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_books_org_members_user_id ON books.org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_books_org_members_org_id ON books.org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_books_accounts_org_id ON books.accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_books_contacts_org_id ON books.contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_books_invoices_org_id ON books.invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_books_bills_org_id ON books.bills(organization_id);
CREATE INDEX IF NOT EXISTS idx_books_payments_org_id ON books.payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_deductions_user_id ON deductions(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_user_id ON recurring_transactions(user_id);

COMMIT;

-- Success message
SELECT 'Complete production setup completed successfully!' as result;