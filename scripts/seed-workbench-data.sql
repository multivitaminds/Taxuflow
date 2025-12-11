-- Seed comprehensive test data for Taxu Shell Workbench
-- This creates realistic test requests, collections, and API logs

-- Insert Test Collections
INSERT INTO developer_test_collections (id, user_id, collection_name, description, is_public, created_at, updated_at)
VALUES 
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Tax Filing API', 'Test endpoints for 1099-NEC and W-2 filing', false, NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Neobank API', 'Banking, transactions, and card management tests', false, NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Investment API', 'Portfolio and holdings management tests', false, NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Document Processing', 'AI document extraction and analysis tests', false, NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Accounting API', 'Invoices, expenses, and journal entries', false, NOW(), NOW());

-- Insert Test Requests for Tax Filing
INSERT INTO developer_test_requests (id, user_id, request_name, method, endpoint, headers, body, environment, response_status, response_body, response_time_ms, is_saved, is_favorite, created_at, updated_at)
VALUES
  -- Get All 1099 Filings
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Get All 1099 Filings', 'GET', '/api/recipients', 
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}', 
   NULL, 
   'production', 200, 
   '{"recipients": [{"id": "rec_123", "first_name": "John", "last_name": "Doe", "total_payments": 15000}]}', 
   145, true, true, NOW(), NOW()),
  
  -- Create 1099 Filing
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Create 1099-NEC Filing', 'POST', '/api/filing/1099-nec',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   '{"tax_year": 2024, "recipient_id": "rec_123", "nonemployee_compensation": 15000, "federal_tax_withheld": 0}',
   'production', 201,
   '{"filing_id": "filing_456", "status": "pending", "submission_id": "sub_789"}',
   523, true, false, NOW(), NOW()),
  
  -- Get Filing Status
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Check Filing Status', 'GET', '/api/filing/status/filing_456',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   NULL,
   'production', 200,
   '{"filing_id": "filing_456", "irs_status": "accepted", "accepted_at": "2024-01-15T10:30:00Z"}',
   98, true, false, NOW(), NOW());

-- Insert Test Requests for Neobank
INSERT INTO developer_test_requests (id, user_id, request_name, method, endpoint, headers, body, environment, response_status, response_body, response_time_ms, is_saved, is_favorite, created_at, updated_at)
VALUES
  -- Get Account Balance
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Get Account Balance', 'GET', '/api/neobank/accounts',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   NULL,
   'production', 200,
   '{"accounts": [{"id": "acc_123", "balance": 5432.50, "currency": "USD", "status": "active"}]}',
   112, true, true, NOW(), NOW()),
  
  -- Create Transaction
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Create Transaction', 'POST', '/api/neobank/transactions',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   '{"account_id": "acc_123", "amount": -50.00, "description": "Coffee Shop", "merchant_name": "Starbucks"}',
   'production', 201,
   '{"transaction_id": "txn_789", "status": "completed", "balance": 5382.50}',
   234, true, false, NOW(), NOW()),
  
  -- Get Virtual Cards
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'List Virtual Cards', 'GET', '/api/neobank/cards',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   NULL,
   'production', 200,
   '{"cards": [{"id": "card_456", "last4": "4242", "status": "active", "daily_limit": 1000}]}',
   89, true, false, NOW(), NOW());

-- Insert Test Requests for Investment
INSERT INTO developer_test_requests (id, user_id, request_name, method, endpoint, headers, body, environment, response_status, response_body, response_time_ms, is_saved, is_favorite, created_at, updated_at)
VALUES
  -- Get Portfolio
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Get Portfolio Summary', 'GET', '/api/investment/portfolios',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   NULL,
   'production', 200,
   '{"portfolios": [{"id": "port_123", "total_value": 125000, "total_gain_loss": 15000, "gain_loss_percent": 13.6}]}',
   156, true, true, NOW(), NOW()),
  
  -- Create Buy Transaction
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Buy Stock', 'POST', '/api/investment/transactions',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   '{"transaction_type": "buy", "symbol": "AAPL", "shares": 10, "price_per_share": 175.50}',
   'production', 201,
   '{"transaction_id": "txn_inv_789", "status": "executed", "total_amount": 1755.00}',
   412, true, false, NOW(), NOW()),
  
  -- Get Holdings
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'List Holdings', 'GET', '/api/investment/holdings',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   NULL,
   'production', 200,
   '{"holdings": [{"symbol": "AAPL", "shares": 50, "market_value": 8775, "unrealized_gain_loss": 1200}]}',
   134, true, false, NOW(), NOW());

-- Insert Test Requests for Documents
INSERT INTO developer_test_requests (id, user_id, request_name, method, endpoint, headers, body, environment, response_status, response_body, response_time_ms, is_saved, is_favorite, created_at, updated_at)
VALUES
  -- Upload Document
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Upload Tax Document', 'POST', '/api/process-document',
   '{"Content-Type": "multipart/form-data", "Authorization": "Bearer test_key_abc123"}',
   '{"file_name": "w2_2023.pdf", "document_type": "W-2", "tax_year": 2023}',
   'production', 202,
   '{"document_id": "doc_123", "status": "processing", "ai_confidence": 0.95}',
   2340, true, true, NOW(), NOW()),
  
  -- Get Document Analysis
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Get Document Analysis', 'GET', '/api/documents/doc_123',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   NULL,
   'production', 200,
   '{"document_id": "doc_123", "extracted_data": {"wages": 75000, "federal_tax": 9500}, "ai_confidence": 0.95}',
   187, true, false, NOW(), NOW());

-- Insert Test Requests for Accounting
INSERT INTO developer_test_requests (id, user_id, request_name, method, endpoint, headers, body, environment, response_status, response_body, response_time_ms, is_saved, is_favorite, created_at, updated_at)
VALUES
  -- Create Invoice
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Create Invoice', 'POST', '/api/accounting/invoices',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   '{"customer_id": "cust_123", "invoice_date": "2024-01-15", "items": [{"description": "Consulting", "amount": 5000}]}',
   'production', 201,
   '{"invoice_id": "inv_789", "invoice_number": "INV-2024-001", "total_amount": 5000}',
   298, true, false, NOW(), NOW()),
  
  -- Get Expenses
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'List Expenses', 'GET', '/api/accounting/expenses',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   NULL,
   'production', 200,
   '{"expenses": [{"id": "exp_456", "amount": 250, "category": "Office Supplies", "date": "2024-01-10"}]}',
   123, true, false, NOW(), NOW()),
  
  -- Create Journal Entry
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Create Journal Entry', 'POST', '/api/accounting/journal-entries',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key_abc123"}',
   '{"entry_date": "2024-01-15", "lines": [{"account_id": "acc_1", "debit": 1000}, {"account_id": "acc_2", "credit": 1000}]}',
   'production', 201,
   '{"entry_id": "je_123", "entry_number": "JE-2024-001", "status": "posted"}',
   267, true, false, NOW(), NOW());

-- Link test requests to collections
INSERT INTO developer_test_collection_requests (id, collection_id, test_request_id, order_index, created_at)
SELECT 
  gen_random_uuid(),
  c.id,
  r.id,
  ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY r.created_at) as order_index,
  NOW()
FROM developer_test_collections c
JOIN developer_test_requests r ON r.user_id = c.user_id
WHERE 
  (c.collection_name = 'Tax Filing API' AND r.endpoint LIKE '%filing%' OR r.endpoint LIKE '%recipients%')
  OR (c.collection_name = 'Neobank API' AND r.endpoint LIKE '%neobank%')
  OR (c.collection_name = 'Investment API' AND r.endpoint LIKE '%investment%')
  OR (c.collection_name = 'Document Processing' AND r.endpoint LIKE '%document%')
  OR (c.collection_name = 'Accounting API' AND r.endpoint LIKE '%accounting%');

-- Insert realistic API request logs for history
INSERT INTO api_request_logs (id, user_id, api_key_id, method, endpoint, request_body, query_parameters, response_status, response_body, response_time_ms, ip_address, user_agent, created_at)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM users LIMIT 1),
  NULL,
  (ARRAY['GET', 'POST', 'PUT', 'DELETE'])[floor(random() * 4 + 1)],
  (ARRAY['/api/recipients', '/api/filing/1099-nec', '/api/neobank/accounts', '/api/investment/portfolios', '/api/documents'])[floor(random() * 5 + 1)],
  CASE WHEN random() > 0.5 THEN '{"test": "data"}'::jsonb ELSE NULL END,
  '{"page": "1", "limit": "20"}'::jsonb,
  (ARRAY[200, 201, 400, 404, 500])[floor(random() * 5 + 1)],
  '{"success": true, "data": {}}'::jsonb,
  floor(random() * 500 + 50)::integer,
  '192.168.1.100'::inet,
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  NOW() - (random() * INTERVAL '30 days')
FROM generate_series(1, 50);

-- Insert webhook events for testing
INSERT INTO webhook_events (id, user_id, organization_id, event_type, event_category, resource_type, resource_id, payload, api_version, created_at, processed_at)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM users LIMIT 1),
  NULL,
  (ARRAY['filing.completed', 'transaction.created', 'document.processed', 'invoice.paid'])[floor(random() * 4 + 1)],
  (ARRAY['tax_filing', 'banking', 'documents', 'accounting'])[floor(random() * 4 + 1)],
  'filing',
  gen_random_uuid(),
  jsonb_build_object(
    'event_id', gen_random_uuid()::text,
    'timestamp', NOW()::text,
    'data', jsonb_build_object('amount', floor(random() * 10000))
  ),
  'v1',
  NOW() - (random() * INTERVAL '7 days'),
  NOW() - (random() * INTERVAL '7 days') + INTERVAL '5 seconds'
FROM generate_series(1, 25);

COMMENT ON TABLE developer_test_requests IS 'Stores saved API test requests for the Taxu Shell Workbench';
COMMENT ON TABLE developer_test_collections IS 'Organizes test requests into collections for better organization';
COMMENT ON TABLE api_request_logs IS 'Logs all API requests for history and debugging';
