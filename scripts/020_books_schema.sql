-- Taxu Books Schema - Production-ready ledger + AR/AP with RLS
-- Multi-tenant, idempotent, QuickBooks-compatible

-- Schema
create schema if not exists books;

-- Organizations & membership
create table if not exists books.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists books.org_members (
  org_id uuid references books.organizations(id) on delete cascade,
  user_id uuid not null,
  role text check (role in ('owner','admin','member')) default 'member',
  primary key (org_id, user_id),
  created_at timestamptz default now()
);

-- Utility: who can access org rows
create or replace function books.is_org_member(_org uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from books.org_members m
    where m.org_id = _org and m.user_id = auth.uid()
  );
$$;

-- Accounts (Chart of Accounts)
create table if not exists books.accounts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references books.organizations(id) on delete cascade,
  name text not null,
  code text,
  type text not null, -- asset, liability, equity, income, expense
  subtype text,
  currency text default 'USD',
  external_id text,       -- QBO Id
  external_rev text,      -- QBO SyncToken
  created_at timestamptz default now()
);

-- Contacts (customers/vendors)
create table if not exists books.contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references books.organizations(id) on delete cascade,
  kind text check (kind in ('customer','vendor')) not null,
  display_name text not null,
  email text,
  phone text,
  tax_id text,
  external_id text,
  external_rev text,
  created_at timestamptz default now()
);

-- Items (for invoicing)
create table if not exists books.items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references books.organizations(id) on delete cascade,
  name text not null,
  sku text,
  price numeric(14,2),
  income_account uuid references books.accounts(id),
  expense_account uuid references books.accounts(id),
  external_id text,
  external_rev text,
  created_at timestamptz default now()
);

-- Journal
create table if not exists books.journal_entries (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references books.organizations(id) on delete cascade,
  date date not null,
  memo text,
  external_id text,
  external_rev text,
  created_at timestamptz default now()
);

create table if not exists books.journal_lines (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references books.journal_entries(id) on delete cascade,
  account_id uuid not null references books.accounts(id),
  contact_id uuid references books.contacts(id),
  debit numeric(14,2) default 0,
  credit numeric(14,2) default 0,
  memo text
);

-- Invoices (AR)
create table if not exists books.invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references books.organizations(id) on delete cascade,
  contact_id uuid not null references books.contacts(id),
  number text,
  status text check (status in ('draft','open','paid','void')) default 'open',
  issue_date date not null,
  due_date date,
  currency text default 'USD',
  subtotal numeric(14,2) default 0,
  tax numeric(14,2) default 0,
  total numeric(14,2) default 0,
  balance numeric(14,2) default 0,
  external_id text,
  external_rev text,
  created_at timestamptz default now()
);

create table if not exists books.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references books.invoices(id) on delete cascade,
  item_id uuid references books.items(id),
  description text,
  quantity numeric(14,4) default 1,
  unit_price numeric(14,2) default 0,
  amount numeric(14,2) not null default 0,
  account_id uuid references books.accounts(id)
);

-- Bills (AP)
create table if not exists books.bills (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references books.organizations(id) on delete cascade,
  contact_id uuid not null references books.contacts(id),
  number text,
  status text check (status in ('open','paid','void')) default 'open',
  issue_date date not null,
  due_date date,
  currency text default 'USD',
  subtotal numeric(14,2) default 0,
  tax numeric(14,2) default 0,
  total numeric(14,2) default 0,
  balance numeric(14,2) default 0,
  external_id text,
  external_rev text,
  created_at timestamptz default now()
);

create table if not exists books.bill_lines (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references books.bills(id) on delete cascade,
  description text,
  quantity numeric(14,4) default 1,
  unit_price numeric(14,2) default 0,
  amount numeric(14,2) not null default 0,
  account_id uuid references books.accounts(id)
);

-- Payments (in/out) and applications
create table if not exists books.payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references books.organizations(id) on delete cascade,
  direction text check (direction in ('in','out')) not null,
  method text,
  amount numeric(14,2) not null,
  currency text default 'USD',
  received_on date not null,
  contact_id uuid references books.contacts(id),
  external_id text,
  external_rev text,
  created_at timestamptz default now()
);

create table if not exists books.payment_applications (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references books.payments(id) on delete cascade,
  invoice_id uuid references books.invoices(id),
  bill_id uuid references books.bills(id),
  amount numeric(14,2) not null
);

-- Bank accounts & transactions
create table if not exists books.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references books.organizations(id) on delete cascade,
  name text not null,
  mask text,
  currency text default 'USD',
  external_id text,
  created_at timestamptz default now()
);

create table if not exists books.bank_transactions (
  id uuid primary key default gen_random_uuid(),
  bank_account_id uuid not null references books.bank_accounts(id) on delete cascade,
  posted_on date not null,
  amount numeric(14,2) not null,
  counterparty text,
  memo text,
  fitid text,
  created_at timestamptz default now()
);

-- QBO connections
create table if not exists books.qbo_connections (
  org_id uuid primary key references books.organizations(id) on delete cascade,
  realm_id text not null,
  access_token_enc text not null,
  refresh_token_enc text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table books.organizations enable row level security;
alter table books.org_members enable row level security;
alter table books.accounts enable row level security;
alter table books.contacts enable row level security;
alter table books.items enable row level security;
alter table books.journal_entries enable row level security;
alter table books.journal_lines enable row level security;
alter table books.invoices enable row level security;
alter table books.invoice_lines enable row level security;
alter table books.bills enable row level security;
alter table books.bill_lines enable row level security;
alter table books.payments enable row level security;
alter table books.payment_applications enable row level security;
alter table books.bank_accounts enable row level security;
alter table books.bank_transactions enable row level security;
alter table books.qbo_connections enable row level security;

-- Helper function for RLS
create or replace function books.allow_org(org uuid) returns boolean
language sql stable as $$ select books.is_org_member(org); $$;

-- Policies
create policy if not exists org_orgs on books.organizations
  for select using (books.is_org_member(id));
create policy if not exists org_orgs_ins on books.organizations
  for insert with check (true);

create policy if not exists org_members_sel on books.org_members
  for select using (books.is_org_member(org_id));
create policy if not exists org_members_ins on books.org_members
  for insert with check (auth.uid() = user_id);

-- RLS helper macro
create or replace function books._add_rls(tbl regclass, col text) returns void language plpgsql as $$
begin
  execute format('create policy if not exists org_%s_sel on %s for select using (books.allow_org(%s));', tbl::text, tbl::text, col);
  execute format('create policy if not exists org_%s_ins on %s for insert with check (books.allow_org(%s));', tbl::text, tbl::text, col);
  execute format('create policy if not exists org_%s_upd on %s for update using (books.allow_org(%s));', tbl::text, tbl::text, col);
  execute format('create policy if not exists org_%s_del on %s for delete using (books.allow_org(%s));', tbl::text, tbl::text, col);
end $$;

select books._add_rls('books.accounts','org_id');
select books._add_rls('books.contacts','org_id');
select books._add_rls('books.items','org_id');
select books._add_rls('books.journal_entries','org_id');
select books._add_rls('books.invoices','org_id');
select books._add_rls('books.bills','org_id');
select books._add_rls('books.payments','org_id');
select books._add_rls('books.bank_accounts','org_id');
select books._add_rls('books.qbo_connections','org_id');
