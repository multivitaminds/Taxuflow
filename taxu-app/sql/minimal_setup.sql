-- Minimal Setup Script - Just organization and membership
-- This should work without column errors

BEGIN;

-- 1. Create a test organization
INSERT INTO books.organizations (id, name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'My Test Company')
ON CONFLICT (id) DO NOTHING;

-- 2. Create organization membership for your user
INSERT INTO books.org_members (org_id, user_id, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'f7a837a9-2ef0-48bf-a5aa-bb29d4b34b43', 'owner')
ON CONFLICT (org_id, user_id) DO NOTHING;

COMMIT;

-- Verify it worked
SELECT 'Organizations created:' as status, count(*) FROM books.organizations;
SELECT 'Your membership:' as status, role FROM books.org_members WHERE user_id = 'f7a837a9-2ef0-48bf-a5aa-bb29d4b34b43';