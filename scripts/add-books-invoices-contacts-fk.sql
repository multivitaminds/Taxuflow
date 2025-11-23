-- Add foreign key relationship between books.invoices and books.contacts
-- This allows Supabase to properly join these tables in queries

-- First, ensure there are no orphaned records
-- Update any invoices with invalid contact_id to NULL
UPDATE books.invoices
SET contact_id = NULL
WHERE contact_id IS NOT NULL 
AND contact_id NOT IN (SELECT id FROM books.contacts);

-- Add the foreign key constraint
ALTER TABLE books.invoices
ADD CONSTRAINT invoices_contact_id_fkey 
FOREIGN KEY (contact_id) 
REFERENCES books.contacts(id)
ON DELETE SET NULL;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_books_invoices_contact_id ON books.invoices(contact_id);

-- Add comment for documentation
COMMENT ON CONSTRAINT invoices_contact_id_fkey ON books.invoices IS 'Links invoices to their associated contact (customer/vendor)';
