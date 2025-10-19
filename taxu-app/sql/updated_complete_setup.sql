-- Updated Complete Supabase Setup Script
-- Run this to populate your database with test data and proper relationships

BEGIN;

-- 1. Create a test organization in books schema
INSERT INTO books.organizations (id, name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'My Test Company')
ON CONFLICT (id) DO NOTHING;

-- 2. Create organization membership for your user
INSERT INTO books.org_members (org_id, user_id, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'f7a837a9-2ef0-48bf-a5aa-bb29d4b34b43', 'owner')
ON CONFLICT (org_id, user_id) DO NOTHING;

-- 3. Create some test accounts (Chart of Accounts)
-- Note: Using org_id if that's the actual column name, or organization_id
INSERT INTO books.accounts (org_id, name, code, type) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Cash', '1000', 'asset'),
('550e8400-e29b-41d4-a716-446655440000', 'Accounts Receivable', '1200', 'asset'),
('550e8400-e29b-41d4-a716-446655440000', 'Revenue', '4000', 'income'),
('550e8400-e29b-41d4-a716-446655440000', 'Expenses', '6000', 'expense')
ON CONFLICT DO NOTHING;

-- 4. Create test customers and vendors
INSERT INTO books.contacts (org_id, kind, display_name, email) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'customer', 'Test Customer Inc', 'customer@test.com'),
('550e8400-e29b-41d4-a716-446655440000', 'vendor', 'Test Vendor LLC', 'vendor@test.com')
ON CONFLICT DO NOTHING;

-- 5. Create a test invoice
INSERT INTO books.invoices (org_id, contact_id, number, status, issue_date, due_date, total_amount) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  c.id,
  'INV-001',
  'open',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  1000.00
FROM books.contacts c 
WHERE c.kind = 'customer' AND c.org_id = '550e8400-e29b-41d4-a716-446655440000'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 6. Create a test bill
INSERT INTO books.bills (org_id, contact_id, number, status, issue_date, due_date, total_amount)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  c.id,
  'BILL-001',
  'open',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '15 days',
  500.00
FROM books.contacts c 
WHERE c.kind = 'vendor' AND c.org_id = '550e8400-e29b-41d4-a716-446655440000'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 7. Add some test deductions data
INSERT INTO deductions (name, amount, deduction_type, tax_year) VALUES 
('Office Supplies', 250.00, 'business_expense', 2024),
('Software Subscriptions', 500.00, 'business_expense', 2024)
ON CONFLICT DO NOTHING;

-- 8. Add test recurring transactions
INSERT INTO recurring_transactions (name, amount, frequency, next_occurrence) VALUES 
('Monthly Software License', 99.00, 'monthly', CURRENT_DATE + INTERVAL '1 month'),
('Quarterly Tax Payment', 1500.00, 'monthly', CURRENT_DATE + INTERVAL '3 months')
ON CONFLICT DO NOTHING;

-- 9. Add test employees
INSERT INTO public.employees (organization_id, first_name, last_name, email, position) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'John', 'Doe', 'john@testcompany.com', 'Developer'),
('550e8400-e29b-41d4-a716-446655440000', 'Jane', 'Smith', 'jane@testcompany.com', 'Designer')
ON CONFLICT DO NOTHING;

-- 10. Add test projects
INSERT INTO public.projects (organization_id, name, description, status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Website Redesign', 'Complete redesign of company website', 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'Mobile App', 'New mobile application development', 'active')
ON CONFLICT DO NOTHING;

COMMIT;

-- Verification queries
SELECT 'Organizations:' as table_name, count(*) as record_count FROM books.organizations
UNION ALL
SELECT 'Org Members:', count(*) FROM books.org_members
UNION ALL
SELECT 'Accounts:', count(*) FROM books.accounts
UNION ALL
SELECT 'Contacts:', count(*) FROM books.contacts
UNION ALL
SELECT 'Invoices:', count(*) FROM books.invoices
UNION ALL
SELECT 'Bills:', count(*) FROM books.bills
UNION ALL
SELECT 'User Profiles:', count(*) FROM user_profiles
UNION ALL
SELECT 'Deductions:', count(*) FROM deductions
UNION ALL
SELECT 'Recurring Transactions:', count(*) FROM recurring_transactions
UNION ALL
SELECT 'Employees:', count(*) FROM public.employees
UNION ALL
SELECT 'Projects:', count(*) FROM public.projects;