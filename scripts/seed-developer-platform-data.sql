-- Seed Developer Platform with Sample Data
-- This script creates sample data for the Taxu Developer Platform

-- Step 1: Create sample API key scopes
INSERT INTO api_key_scopes (api_key_id, scope, granted_at) VALUES
-- Assuming api_keys table has some existing keys, we'll reference them
-- If no keys exist, these will need to be created first
(
  (SELECT id FROM api_keys LIMIT 1),
  'tax_filing:read',
  NOW()
),
(
  (SELECT id FROM api_keys LIMIT 1),
  'tax_filing:write',
  NOW()
),
(
  (SELECT id FROM api_keys LIMIT 1),
  'neobank:read',
  NOW()
),
(
  (SELECT id FROM api_keys LIMIT 1),
  'investment:read',
  NOW()
);

-- Step 2: Create sample webhook events
INSERT INTO webhook_events (event_type, platform, data, created_at) VALUES
('tax_filing.1099_nec.created', 'tax_filing', '{"filing_id": "1099_001", "tax_year": 2024, "status": "submitted"}', NOW() - INTERVAL '2 hours'),
('tax_filing.1099_nec.completed', 'tax_filing', '{"filing_id": "1099_001", "tax_year": 2024, "status": "accepted"}', NOW() - INTERVAL '1 hour'),
('neobank.transaction.created', 'neobank', '{"transaction_id": "txn_001", "amount": 1500.00, "type": "deposit"}', NOW() - INTERVAL '30 minutes'),
('neobank.account.updated', 'neobank', '{"account_id": "acc_001", "balance": 25000.00}', NOW() - INTERVAL '15 minutes'),
('investment.portfolio.updated', 'investment', '{"portfolio_id": "port_001", "total_value": 125000.00}', NOW() - INTERVAL '10 minutes'),
('investment.trade.executed', 'investment', '{"trade_id": "trade_001", "symbol": "AAPL", "shares": 10}', NOW() - INTERVAL '5 minutes'),
('accounting.invoice.created', 'accounting', '{"invoice_id": "inv_001", "amount": 2500.00}', NOW() - INTERVAL '3 minutes'),
('accounting.expense.approved', 'accounting', '{"expense_id": "exp_001", "amount": 150.00}', NOW() - INTERVAL '1 minute');

-- Step 3: Create sample webhook subscriptions
INSERT INTO webhook_subscriptions (webhook_id, event_type, enabled, created_at) VALUES
(
  (SELECT id FROM webhooks LIMIT 1),
  'tax_filing.1099_nec.created',
  true,
  NOW()
),
(
  (SELECT id FROM webhooks LIMIT 1),
  'tax_filing.1099_nec.completed',
  true,
  NOW()
),
(
  (SELECT id FROM webhooks LIMIT 1),
  'neobank.transaction.created',
  true,
  NOW()
),
(
  (SELECT id FROM webhooks LIMIT 1),
  'investment.portfolio.updated',
  true,
  NOW()
);

-- Step 4: Create sample API request logs
INSERT INTO api_request_logs (
  api_key_id,
  endpoint,
  method,
  status_code,
  response_time_ms,
  request_size_bytes,
  response_size_bytes,
  user_agent,
  ip_address,
  created_at
) VALUES
(
  (SELECT id FROM api_keys LIMIT 1),
  '/api/v1/tax-filing/1099-nec',
  'POST',
  201,
  145,
  2048,
  512,
  'taxu-node-sdk/1.0.0',
  '192.168.1.100',
  NOW() - INTERVAL '5 minutes'
),
(
  (SELECT id FROM api_keys LIMIT 1),
  '/api/v1/neobank/accounts',
  'GET',
  200,
  89,
  0,
  4096,
  'taxu-python-sdk/1.2.0',
  '192.168.1.101',
  NOW() - INTERVAL '4 minutes'
),
(
  (SELECT id FROM api_keys LIMIT 1),
  '/api/v1/investment/portfolios',
  'GET',
  200,
  112,
  0,
  8192,
  'taxu-ruby-sdk/1.1.0',
  '192.168.1.102',
  NOW() - INTERVAL '3 minutes'
),
(
  (SELECT id FROM api_keys LIMIT 1),
  '/api/v1/accounting/invoices',
  'POST',
  201,
  178,
  3072,
  1024,
  'curl/7.81.0',
  '192.168.1.103',
  NOW() - INTERVAL '2 minutes'
),
(
  (SELECT id FROM api_keys LIMIT 1),
  '/api/v1/webhooks',
  'GET',
  200,
  67,
  0,
  2048,
  'PostmanRuntime/7.32.3',
  '192.168.1.104',
  NOW() - INTERVAL '1 minute'
);

-- Step 5: Create sample rate limit tracking
INSERT INTO api_rate_limits (
  api_key_id,
  window_start,
  request_count,
  limit_exceeded
) VALUES
(
  (SELECT id FROM api_keys LIMIT 1),
  DATE_TRUNC('hour', NOW()),
  45,
  false
),
(
  (SELECT id FROM api_keys LIMIT 1),
  DATE_TRUNC('hour', NOW() - INTERVAL '1 hour'),
  89,
  false
);

-- Step 6: Create sample SDK downloads
INSERT INTO sdk_downloads (
  sdk_name,
  version,
  platform,
  download_count,
  ip_address,
  user_agent,
  created_at
) VALUES
('taxu-node', '1.0.0', 'npm', 1, '203.0.113.1', 'npm/9.6.7', NOW() - INTERVAL '2 days'),
('taxu-python', '1.2.0', 'pypi', 1, '203.0.113.2', 'pip/23.1.2', NOW() - INTERVAL '1 day'),
('taxu-ruby', '1.1.0', 'rubygems', 1, '203.0.113.3', 'Ruby/3.2.0', NOW() - INTERVAL '12 hours'),
('taxu-php', '1.0.5', 'packagist', 1, '203.0.113.4', 'Composer/2.5.5', NOW() - INTERVAL '6 hours'),
('taxu-go', '1.1.2', 'go', 1, '203.0.113.5', 'Go/1.21.0', NOW() - INTERVAL '3 hours'),
('taxu-java', '1.0.8', 'maven', 1, '203.0.113.6', 'Maven/3.9.2', NOW() - INTERVAL '1 hour');

-- Step 7: Create sample documentation page views
INSERT INTO documentation_page_views (
  page_path,
  page_title,
  user_id,
  session_id,
  referrer,
  search_query,
  time_on_page_seconds,
  created_at
) VALUES
('/developer/docs/api/tax-filing', 'Tax Filing API', (SELECT id FROM users LIMIT 1), 'sess_001', 'https://google.com', 'tax filing api', 120, NOW() - INTERVAL '3 hours'),
('/developer/docs/api/neobank', 'Neobank API', (SELECT id FROM users LIMIT 1), 'sess_001', NULL, NULL, 95, NOW() - INTERVAL '2 hours'),
('/developer/docs/webhooks', 'Webhooks Documentation', (SELECT id FROM users LIMIT 1), 'sess_002', '/developer/docs', NULL, 240, NOW() - INTERVAL '1 hour'),
('/developer/docs/sdks', 'SDKs & Libraries', (SELECT id FROM users LIMIT 1), 'sess_002', NULL, 'python sdk', 60, NOW() - INTERVAL '30 minutes'),
('/developer/docs/cli', 'CLI Documentation', (SELECT id FROM users LIMIT 1), 'sess_003', 'https://taxu.com', NULL, 180, NOW() - INTERVAL '15 minutes');

-- Step 8: Create sample documentation feedback
INSERT INTO documentation_feedback (
  page_path,
  user_id,
  rating,
  feedback_text,
  feedback_type,
  created_at
) VALUES
('/developer/docs/api/tax-filing', (SELECT id FROM users LIMIT 1), 5, 'Very clear documentation! Helped me integrate quickly.', 'positive', NOW() - INTERVAL '2 hours'),
('/developer/docs/webhooks', (SELECT id FROM users LIMIT 1), 4, 'Good examples, but need more information about retry logic.', 'suggestion', NOW() - INTERVAL '1 hour'),
('/developer/docs/sdks', (SELECT id FROM users LIMIT 1), 3, 'Missing Python 3.11 compatibility information.', 'issue', NOW() - INTERVAL '30 minutes');

-- Step 9: Create API versions
INSERT INTO api_versions (
  version,
  release_date,
  is_current,
  is_deprecated,
  deprecation_date,
  sunset_date,
  changelog_url,
  migration_guide_url
) VALUES
('2024-12-01', '2024-12-01', true, false, NULL, NULL, '/developer/docs/changelog/2024-12-01', NULL),
('2024-09-01', '2024-09-01', false, false, NULL, NULL, '/developer/docs/changelog/2024-09-01', NULL),
('2024-06-01', '2024-06-01', false, true, '2024-12-01', '2025-06-01', '/developer/docs/changelog/2024-06-01', '/developer/docs/migrations/2024-06-01');

-- Step 10: Create API changelog entries
INSERT INTO api_changelog_entries (
  version_id,
  change_type,
  title,
  description,
  affected_endpoints,
  breaking_change,
  migration_required,
  migration_guide,
  published_at
) VALUES
(
  (SELECT id FROM api_versions WHERE version = '2024-12-01'),
  'feature',
  'Added Investment Portfolio Analytics',
  'New endpoints for comprehensive portfolio performance analytics including returns, benchmarks, and risk metrics.',
  ARRAY['/api/v1/investment/portfolios/{id}/analytics', '/api/v1/investment/portfolios/{id}/performance'],
  false,
  false,
  NULL,
  NOW() - INTERVAL '7 days'
),
(
  (SELECT id FROM api_versions WHERE version = '2024-12-01'),
  'improvement',
  'Enhanced Webhook Retry Logic',
  'Webhooks now retry with exponential backoff up to 72 hours. Added webhook delivery status tracking.',
  NULL,
  false,
  false,
  NULL,
  NOW() - INTERVAL '7 days'
),
(
  (SELECT id FROM api_versions WHERE version = '2024-09-01'),
  'breaking',
  'Updated Tax Filing Response Format',
  'Tax filing endpoints now return standardized response format with nested status object.',
  ARRAY['/api/v1/tax-filing/1099-nec', '/api/v1/tax-filing/941'],
  true,
  true,
  '## Migration Guide\n\nUpdate your response parsing:\n\n**Before:**\n```json\n{\n  "filing_id": "123",\n  "status": "submitted"\n}\n```\n\n**After:**\n```json\n{\n  "filing_id": "123",\n  "status": {\n    "state": "submitted",\n    "updated_at": "2024-09-01T12:00:00Z"\n  }\n}\n```',
  NOW() - INTERVAL '90 days'
);

-- Step 11: Create sample developer test collections
INSERT INTO developer_test_collections (
  user_id,
  name,
  description,
  is_public
) VALUES
(
  (SELECT id FROM users LIMIT 1),
  'Tax Filing Quick Tests',
  'Common tax filing scenarios for testing',
  false
),
(
  (SELECT id FROM users LIMIT 1),
  'Neobank Integration Tests',
  'End-to-end neobank API tests',
  false
);

-- Step 12: Create sample developer test requests
INSERT INTO developer_test_requests (
  user_id,
  name,
  description,
  method,
  endpoint,
  headers,
  body,
  saved_response
) VALUES
(
  (SELECT id FROM users LIMIT 1),
  'Create 1099-NEC Filing',
  'Test creating a new 1099-NEC filing',
  'POST',
  '/api/v1/tax-filing/1099-nec',
  '{"Content-Type": "application/json", "Authorization": "Bearer test_key"}',
  '{"tax_year": 2024, "recipient": {"name": "John Doe", "tin": "123-45-6789"}, "amount": 5000.00}',
  '{"filing_id": "1099_001", "status": "submitted", "created_at": "2024-12-08T12:00:00Z"}'
),
(
  (SELECT id FROM users LIMIT 1),
  'Get Account Balance',
  'Retrieve neobank account balance',
  'GET',
  '/api/v1/neobank/accounts/acc_001',
  '{"Authorization": "Bearer test_key"}',
  NULL,
  '{"account_id": "acc_001", "balance": 25000.00, "currency": "USD"}'
);

-- Step 13: Link test requests to collections
INSERT INTO developer_test_collection_requests (
  collection_id,
  request_id,
  order_index
) VALUES
(
  (SELECT id FROM developer_test_collections WHERE name = 'Tax Filing Quick Tests'),
  (SELECT id FROM developer_test_requests WHERE name = 'Create 1099-NEC Filing'),
  1
),
(
  (SELECT id FROM developer_test_collections WHERE name = 'Neobank Integration Tests'),
  (SELECT id FROM developer_test_requests WHERE name = 'Get Account Balance'),
  1
);

-- Step 14: Create sample support tickets
INSERT INTO developer_support_tickets (
  user_id,
  subject,
  status,
  priority,
  category,
  created_at
) VALUES
(
  (SELECT id FROM users LIMIT 1),
  'Webhook delivery failing for tax_filing.completed events',
  'open',
  'high',
  'webhooks',
  NOW() - INTERVAL '2 hours'
),
(
  (SELECT id FROM users LIMIT 1),
  'Question about rate limits for neobank API',
  'resolved',
  'medium',
  'api',
  NOW() - INTERVAL '1 day'
);

-- Step 15: Create sample support messages
INSERT INTO developer_support_messages (
  ticket_id,
  user_id,
  message,
  is_internal,
  created_at
) VALUES
(
  (SELECT id FROM developer_support_tickets WHERE subject LIKE 'Webhook delivery%'),
  (SELECT id FROM users LIMIT 1),
  'Hi, I''m not receiving webhook events for tax_filing.completed. My endpoint is https://myapp.com/webhooks/taxu and it returns 200 OK when I test manually.',
  false,
  NOW() - INTERVAL '2 hours'
),
(
  (SELECT id FROM developer_support_tickets WHERE subject LIKE 'Question about rate limits%'),
  (SELECT id FROM users LIMIT 1),
  'What are the rate limits for the neobank API? I''m planning to process about 1000 transactions per hour.',
  false,
  NOW() - INTERVAL '1 day'
);

-- Step 16: Create API status incidents
INSERT INTO api_status_incidents (
  title,
  description,
  severity,
  status,
  affected_services,
  started_at,
  resolved_at
) VALUES
(
  'Increased API Latency - Tax Filing',
  'We are investigating increased response times on tax filing endpoints.',
  'minor',
  'resolved',
  ARRAY['tax_filing'],
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days'
),
(
  'Webhook Delivery Delays',
  'Some webhook deliveries are experiencing delays. We are working to resolve this.',
  'major',
  'monitoring',
  ARRAY['webhooks'],
  NOW() - INTERVAL '1 hour',
  NULL
);

-- Step 17: Create API status updates
INSERT INTO api_status_updates (
  incident_id,
  message,
  status,
  created_at
) VALUES
(
  (SELECT id FROM api_status_incidents WHERE title = 'Increased API Latency - Tax Filing'),
  'We have identified the issue as a database query optimization problem and are deploying a fix.',
  'investigating',
  NOW() - INTERVAL '2 days 2 hours'
),
(
  (SELECT id FROM api_status_incidents WHERE title = 'Increased API Latency - Tax Filing'),
  'Fix has been deployed and latency has returned to normal levels. We will continue monitoring.',
  'resolved',
  NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM api_status_incidents WHERE title = 'Webhook Delivery Delays'),
  'We are investigating increased webhook delivery times. Deliveries are still being processed but may be delayed by up to 10 minutes.',
  'investigating',
  NOW() - INTERVAL '1 hour'
);

-- Success message
SELECT 'Developer Platform seed data created successfully!' AS message;
SELECT 'Total webhook events created: ' || COUNT(*)::text FROM webhook_events;
SELECT 'Total API request logs created: ' || COUNT(*)::text FROM api_request_logs;
SELECT 'Total SDK downloads created: ' || COUNT(*)::text FROM sdk_downloads;
SELECT 'Total documentation page views created: ' || COUNT(*)::text FROM documentation_page_views;
