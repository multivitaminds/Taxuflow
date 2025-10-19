-- Create documents table to store file metadata
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_url text,
  file_size integer,
  file_type text,
  document_type text, -- 'w2', '1099', 'receipt', 'other'
  tax_year integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.documents enable row level security;

-- RLS Policies - users can only access their own documents
create policy "documents_select_own"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "documents_insert_own"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "documents_update_own"
  on public.documents for update
  using (auth.uid() = user_id);

create policy "documents_delete_own"
  on public.documents for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists documents_created_at_idx on public.documents(created_at desc);
