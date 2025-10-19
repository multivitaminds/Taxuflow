-- Simple Setup Script - Just the essentials
-- Run this to create basic test data

BEGIN;

-- 1. Create a test organization
INSERT INTO books.organizations (id, name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'My Test Company')
ON CONFLICT (id) DO NOTHING;

-- 2. Create organization membership for your user
INSERT INTO books.org_members (org_id, user_id, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'f7a837a9-2ef0-48bf-a5aa-bb29d4b34b43', 'owner')
ON CONFLICT (org_id, user_id) DO NOTHING;

-- 3. Create basic test accounts (only required columns)
INSERT INTO books.accounts (org_id, name, type) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Cash', 'asset'),
('550e8400-e29b-41d4-a716-446655440000', 'Revenue', 'income')
ON CONFLICT DO NOTHING;

-- 4. Create test contact (only required columns)
INSERT INTO books.contacts (org_id, kind, display_name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'customer', 'Test Customer Inc')
ON CONFLICT DO NOTHING;

-- 5. Add test deductions
INSERT INTO deductions (name, amount) VALUES 
('Office Supplies', 250.00),
('Software Subscriptions', 500.00)
ON CONFLICT DO NOTHING;

-- 6. Add test recurring transactions
INSERT INTO recurring_transactions (name, amount, frequency) VALUES 
('Monthly Software License', 99.00, 'monthly'),
('Quarterly Tax Payment', 1500.00, 'monthly')
ON CONFLICT DO NOTHING;

-- 7. Add test employees
INSERT INTO public.employees (first_name, last_name) VALUES 
('John', 'Doe'),
('Jane', 'Smith')
ON CONFLICT DO NOTHING;

-- 8. Add test projects
INSERT INTO public.projects (name, status) VALUES 
('Website Redesign', 'active'),
('Mobile App', 'active')
ON CONFLICT DO NOTHING;

COMMIT;

-- Verify the data
SELECT 'Organizations:' as table_name, count(*) as record_count FROM books.organizations
UNION ALL
SELECT 'Org Members:', count(*) FROM books.org_members
UNION ALL
SELECT 'Accounts:', count(*) FROM books.accounts
UNION ALL
SELECT 'Contacts:', count(*) FROM books.contacts
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