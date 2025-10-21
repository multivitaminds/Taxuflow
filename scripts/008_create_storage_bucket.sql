-- Create storage bucket for tax documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tax-documents',
  'tax-documents',
  false,
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'tax-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'tax-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own documents"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'tax-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'tax-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
