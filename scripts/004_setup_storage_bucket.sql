-- Create storage bucket for tax documents
insert into storage.buckets (id, name, public)
values ('tax-documents', 'tax-documents', false)
on conflict (id) do nothing;

-- Storage policies - users can only access their own files
create policy "Users can upload their own tax documents"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'tax-documents' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view their own tax documents"
on storage.objects for select
to authenticated
using (
  bucket_id = 'tax-documents' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own tax documents"
on storage.objects for update
to authenticated
using (
  bucket_id = 'tax-documents' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own tax documents"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'tax-documents' 
  and (storage.foldername(name))[1] = auth.uid()::text
);
