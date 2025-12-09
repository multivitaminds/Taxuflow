-- Seed Developer Platform with Sample Data (V2 - Fixed with API Keys)
-- This script creates sample data for the Taxu Developer Platform

-- Step 0: Create sample API keys first (if none exist)
DO $$
DECLARE
  v_user_id UUID;
  v_org_id UUID;
  v_api_key_id UUID;
BEGIN
  -- Get first user and organization
  SELECT id INTO v_user_id FROM users LIMIT 1;
  SELECT id INTO v_org_id FROM organizations LIMIT 1;
  
  -- Only create API key if none exist
  IF NOT EXISTS (SELECT 1 FROM api_keys LIMIT 1) THEN
    INSERT INTO api_keys (user_id, organization_id, key_name, key_value, environment, is_active)
    VALUES (
      v_user_id,
      v_org_id,
      'Development Key',
      'sk_test_' || gen_random_uuid()::text,
      'test',
      true
    ) RETURNING id INTO v_api_key_id;
    
    RAISE NOTICE 'Created sample API key';
  END IF;
END $$;

-- Step 1: Create sample API key scopes (only if API keys exist)
INSERT INTO api_key_scopes (api_key_id, scope, created_at)
SELECT 
  (SELECT id FROM api_keys LIMIT 1),
  scope,
  NOW()
FROM (VALUES 
  ('tax_filing:read'),
  ('tax_filing:write'),
  ('neobank:read'),
  ('neobank:write'),
  ('investment:read'),
  ('accounting:read')
) AS scopes(scope)
WHERE EXISTS (SELECT 1 FROM api_keys LIMIT 1);

-- Step 2: Create sample webhook events
INSERT INTO webhook_events (event_type, event_category, payload, user_id, organization_id, created_at) VALUES
('tax_filing.1099_nec.created', 'tax_filing', '{"filing_id": "1099_001", "tax_year": 2024, "status": "submitted"}', (SELECT id FROM users LIMIT 1), (SELECT id FROM organizations LIMIT 1), NOW() - INTERVAL '2 hours'),
('tax_filing.1099_nec.completed', 'tax_filing', '{"filing_id": "1099_001", "tax_year": 2024, "status": "accepted"}', (SELECT id FROM users LIMIT 1), (SELECT id FROM organizations LIMIT 1), NOW() - INTERVAL '1 hour'),
('neobank.transaction.created', 'neobank', '{"transaction_id": "txn_001", "amount": 1500.00, "type": "deposit"}', (SELECT id FROM users LIMIT 1), (SELECT id FROM organizations LIMIT 1), NOW() - INTERVAL '30 minutes'),
('neobank.account.updated', 'neobank', '{"account_id": "acc_001", "balance": 25000.00}', (SELECT id FROM users LIMIT 1), (SELECT id FROM organizations LIMIT 1), NOW() - INTERVAL '15 minutes'),
('investment.portfolio.updated', 'investment', '{"portfolio_id": "port_001", "total_value": 125000.00}', (SELECT id FROM users LIMIT 1), (SELECT id FROM organizations LIMIT 1), NOW() - INTERVAL '10 minutes'),
('investment.trade.executed', 'investment', '{"trade_id": "trade_001", "symbol": "AAPL", "shares": 10}', (SELECT id FROM users LIMIT 1), (SELECT id FROM organizations LIMIT 1), NOW() - INTERVAL '5 minutes'),
('accounting.invoice.created', 'accounting', '{"invoice_id": "inv_001", "amount": 2500.00}', (SELECT id FROM users LIMIT 1), (SELECT id FROM organizations LIMIT 1), NOW() - INTERVAL '3 minutes'),
('accounting.expense.approved', 'accounting', '{"expense_id": "exp_001", "amount": 150.00}', (SELECT id FROM users LIMIT 1), (SELECT id FROM organizations LIMIT 1), NOW() - INTERVAL '1 minute');

-- Step 3: Create sample webhook subscriptions
INSERT INTO webhook_subscriptions (webhook_id, event_type, is_active, created_at) VALUES
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
  user_id,
  organization_id,
  endpoint,
  method,
  response_status,
  response_time_ms,
  user_agent,
  ip_address,
  created_at
) VALUES
(
  (SELECT id FROM api_keys LIMIT 1),
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM organizations LIMIT 1),
  '/api/v1/tax-filing/1099-nec',
  'POST',
  201,
  145,
  'taxu-node-sdk/1.0.0',
  '192.168.1.100',
  NOW() - INTERVAL '5 minutes'
),
(
  (SELECT id FROM api_keys LIMIT 1),
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM organizations LIMIT 1),
  '/api/v1/neobank/accounts',
  'GET',
  200,
  89,
  'taxu-python-sdk/1.2.0',
  '192.168.1.101',
  NOW() - INTERVAL '4 minutes'
),
(
  (SELECT id FROM api_keys LIMIT 1),
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM organizations LIMIT 1),
  '/api/v1/investment/portfolios',
  'GET',
  200,
  112,
  'taxu-ruby-sdk/1.1.0',
  '192.168.1.102',
  NOW() - INTERVAL '3 minutes'
),
(
  (SELECT id FROM api_keys LIMIT 1),
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM organizations LIMIT 1),
  '/api/v1/accounting/invoices',
  'POST',
  201,
  178,
  'curl/7.81.0',
  '192.168.1.103',
  NOW() - INTERVAL '2 minutes'
),
(
  (SELECT id FROM api_keys LIMIT 1),
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM organizations LIMIT 1),
  '/api/v1/webhooks',
  'GET',
  200,
  67,
  'PostmanRuntime/7.32.3',
  '192.168.1.104',
  NOW() - INTERVAL '1 minute'
);

-- Step 5: Create sample rate limit tracking
INSERT INTO api_rate_limits (
  api_key_id,
  window_start,
  request_count,
  created_at
) VALUES
(
  (SELECT id FROM api_keys LIMIT 1),
  DATE_TRUNC('hour', NOW()),
  45,
  NOW()
),
(
  (SELECT id FROM api_keys LIMIT 1),
  DATE_TRUNC('hour', NOW() - INTERVAL '1 hour'),
  89,
  NOW() - INTERVAL '1 hour'
);

-- Step 6: Create sample SDK downloads
INSERT INTO sdk_downloads (
  sdk_name,
  sdk_version,
  download_source,
  user_agent,
  ip_address,
  created_at
) VALUES
('taxu-node', '1.0.0', 'npm', 'npm/9.6.7', '203.0.113.1', NOW() - INTERVAL '2 days'),
('taxu-python', '1.2.0', 'pypi', 'pip/23.1.2', '203.0.113.2', NOW() - INTERVAL '1 day'),
('taxu-ruby', '1.1.0', 'rubygems', 'Ruby/3.2.0', '203.0.113.3', NOW() - INTERVAL '12 hours'),
('taxu-php', '1.0.5', 'packagist', 'Composer/2.5.5', '203.0.113.4', NOW() - INTERVAL '6 hours'),
('taxu-go', '1.1.2', 'go', 'Go/1.21.0', '203.0.113.5', NOW() - INTERVAL '3 hours'),
('taxu-java', '1.0.8', 'maven', 'Maven/3.9.2', '203.0.113.6', NOW() - INTERVAL '1 hour');

-- Step 7: Create sample documentation page views
INSERT INTO documentation_page_views (
  page_path,
  page_title,
  user_id,
  search_query,
  time_on_page_seconds,
  ip_address,
  referrer,
  created_at
) VALUES
('/developer/docs/api/tax-filing', 'Tax Filing API', (SELECT id FROM users LIMIT 1), 'tax filing api', 120, '203.0.113.10', 'https://google.com', NOW() - INTERVAL '3 hours'),
('/developer/docs/api/neobank', 'Neobank API', (SELECT id FROM users LIMIT 1), NULL, 95, '203.0.113.10', NULL, NOW() - INTERVAL '2 hours'),
('/developer/docs/webhooks', 'Webhooks Documentation', (SELECT id FROM users LIMIT 1), NULL, 240, '203.0.113.10', '/developer/docs', NOW() - INTERVAL '1 hour'),
('/developer/docs/sdks', 'SDKs & Libraries', (SELECT id FROM users LIMIT 1), 'python sdk', 60, '203.0.113.10', NULL, NOW() - INTERVAL '30 minutes'),
('/developer/docs/cli', 'CLI Documentation', (SELECT id FROM users LIMIT 1), NULL, 180, '203.0.113.10', 'https://taxu.com', NOW() - INTERVAL '15 minutes');

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
  version_number,
  release_date,
  is_current,
  is_deprecated,
  deprecation_date,
  sunset_date,
  changelog,
  created_at
) VALUES
('2024-12-01', '2024-12-01', true, false, NULL, NULL, 'Added Investment Portfolio Analytics and enhanced webhook retry logic', NOW()),
('2024-09-01', '2024-09-01', false, false, NULL, NULL, 'Updated Tax Filing Response Format', NOW()),
('2024-06-01', '2024-06-01', false, true, '2024-12-01', '2025-06-01', 'Initial API release', NOW());

-- Step 10: Create API changelog entries
INSERT INTO api_changelog_entries (
  version_id,
  change_type,
  title,
  description,
  affected_endpoints,
  published_at,
  created_at
) VALUES
(
  (SELECT id FROM api_versions WHERE version_number = '2024-12-01'),
  'feature',
  'Added Investment Portfolio Analytics',
  'New endpoints for comprehensive portfolio performance analytics including returns, benchmarks, and risk metrics.',
  ARRAY['/api/v1/investment/portfolios/{id}/analytics', '/api/v1/investment/portfolios/{id}/performance'],
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
),
(
  (SELECT id FROM api_versions WHERE version_number = '2024-12-01'),
  'improvement',
  'Enhanced Webhook Retry Logic',
  'Webhooks now retry with exponential backoff up to 72 hours. Added webhook delivery status tracking.',
  NULL,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
),
(
  (SELECT id FROM api_versions WHERE version_number = '2024-09-01'),
  'breaking',
  'Updated Tax Filing Response Format',
  'Tax filing endpoints now return standardized response format with nested status object. Migration guide available at /developer/docs/migrations/2024-09-01',
  ARRAY['/api/v1/tax-filing/1099-nec', '/api/v1/tax-filing/941'],
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '90 days'
);

-- Step 11: Create sample developer test collections
INSERT INTO developer_test_collections (
  user_id,
  collection_name,
  description,
  is_public,
  created_at
) VALUES
(
  (SELECT id FROM users LIMIT 1),
  'Tax Filing Quick Tests',
  'Common tax filing scenarios for testing',
  false,
  NOW()
),
(
  (SELECT id FROM users LIMIT 1),
  'Neobank Integration Tests',
  'End-to-end neobank API tests',
  false,
  NOW()
);

-- Step 12: Create sample developer test requests
INSERT INTO developer_test_requests (
  user_id,
  request_name,
  method,
  endpoint,
  headers,
  body,
  response_body,
  response_status,
  is_saved,
  created_at
) VALUES
(
  (SELECT id FROM users LIMIT 1),
  'Create 1099-NEC Filing',
  'POST',
  '/api/v1/tax-filing/1099-nec',
  '{"Content-Type": "application/json", "Authorization": "Bearer test_key"}',
  '{"tax_year": 2024, "recipient": {"name": "John Doe", "tin": "123-45-6789"}, "amount": 5000.00}',
  '{"filing_id": "1099_001", "status": "submitted", "created_at": "2024-12-08T12:00:00Z"}',
  201,
  true,
  NOW()
),
(
  (SELECT id FROM users LIMIT 1),
  'Get Account Balance',
  'GET',
  '/api/v1/neobank/accounts/acc_001',
  '{"Authorization": "Bearer test_key"}',
  NULL,
  '{"account_id": "acc_001", "balance": 25000.00, "currency": "USD"}',
  200,
  true,
  NOW()
);

-- Step 13: Link test requests to collections
INSERT INTO developer_test_collection_requests (
  collection_id,
  test_request_id,
  order_index,
  created_at
) VALUES
(
  (SELECT id FROM developer_test_collections WHERE collection_name = 'Tax Filing Quick Tests'),
  (SELECT id FROM developer_test_requests WHERE request_name = 'Create 1099-NEC Filing'),
  1,
  NOW()
),
(
  (SELECT id FROM developer_test_collections WHERE collection_name = 'Neobank Integration Tests'),
  (SELECT id FROM developer_test_requests WHERE request_name = 'Get Account Balance'),
  1,
  NOW()
);

-- Step 14: Create sample support tickets
INSERT INTO developer_support_tickets (
  user_id,
  organization_id,
  ticket_number,
  subject,
  description,
  status,
  priority,
  category,
  created_at
) VALUES
(
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM organizations LIMIT 1),
  'TICK-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
  'Webhook delivery failing for tax_filing.completed events',
  'I am not receiving webhook events for tax_filing.completed. My endpoint is https://myapp.com/webhooks/taxu and it returns 200 OK when I test manually.',
  'open',
  'high',
  'webhook',
  NOW() - INTERVAL '2 hours'
),
(
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM organizations LIMIT 1),
  'TICK-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
  'Question about rate limits for neobank API',
  'What are the rate limits for the neobank API? I am planning to process about 1000 transactions per hour.',
  'resolved',
  'medium',
  'api',
  NOW() - INTERVAL '1 day'
);

-- Step 15: Create sample support messages
INSERT INTO developer_support_messages (
  ticket_id,
  user_id,
  is_staff,
  message,
  created_at
) VALUES
(
  (SELECT id FROM developer_support_tickets WHERE subject LIKE 'Webhook delivery%'),
  (SELECT id FROM users LIMIT 1),
  false,
  'Hi, I am not receiving webhook events for tax_filing.completed. My endpoint is https://myapp.com/webhooks/taxu and it returns 200 OK when I test manually.',
  NOW() - INTERVAL '2 hours'
),
(
  (SELECT id FROM developer_support_tickets WHERE subject LIKE 'Question about rate limits%'),
  (SELECT id FROM users LIMIT 1),
  false,
  'What are the rate limits for the neobank API? I am planning to process about 1000 transactions per hour.',
  NOW() - INTERVAL '1 day'
);

-- Step 16: Create API status incidents
INSERT INTO api_status_incidents (
  incident_title,
  incident_description,
  severity,
  status,
  affected_services,
  started_at,
  resolved_at,
  created_at
) VALUES
(
  'Increased API Latency - Tax Filing',
  'We are investigating increased response times on tax filing endpoints.',
  'minor',
  'resolved',
  ARRAY['tax_filing'],
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '3 days'
),
(
  'Webhook Delivery Delays',
  'Some webhook deliveries are experiencing delays. We are working to resolve this.',
  'major',
  'monitoring',
  ARRAY['webhooks'],
  NOW() - INTERVAL '1 hour',
  NULL,
  NOW() - INTERVAL '1 hour'
);

-- Step 17: Create API status updates
INSERT INTO api_status_updates (
  incident_id,
  update_text,
  status,
  created_at
) VALUES
(
  (SELECT id FROM api_status_incidents WHERE incident_title = 'Increased API Latency - Tax Filing'),
  'We have identified the issue as a database query optimization problem and are deploying a fix.',
  'investigating',
  NOW() - INTERVAL '2 days 2 hours'
),
(
  (SELECT id FROM api_status_incidents WHERE incident_title = 'Increased API Latency - Tax Filing'),
  'Fix has been deployed and latency has returned to normal levels. We will continue monitoring.',
  'resolved',
  NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM api_status_incidents WHERE incident_title = 'Webhook Delivery Delays'),
  'We are investigating increased webhook delivery times. Deliveries are still being processed but may be delayed by up to 10 minutes.',
  'investigating',
  NOW() - INTERVAL '1 hour'
);

-- Success message
SELECT 'Developer Platform seed data created successfully!' AS message;
SELECT 'Total webhook events created: ' || COUNT(*)::text AS webhook_events FROM webhook_events WHERE created_at > NOW() - INTERVAL '1 day';
SELECT 'Total API request logs created: ' || COUNT(*)::text AS api_logs FROM api_request_logs WHERE created_at > NOW() - INTERVAL '1 day';
SELECT 'Total SDK downloads created: ' || COUNT(*)::text AS sdk_downloads FROM sdk_downloads WHERE created_at > NOW() - INTERVAL '3 days';
SELECT 'Total documentation page views created: ' || COUNT(*)::text AS doc_views FROM documentation_page_views WHERE created_at > NOW() - INTERVAL '1 day';
