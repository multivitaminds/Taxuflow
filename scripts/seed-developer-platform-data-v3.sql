-- Seed Developer Platform with Sample Data (Corrected for actual schema)
-- This script creates sample data for the Taxu Developer Platform

DO $$
DECLARE
  v_user_id UUID;
  v_org_id UUID;
  v_api_key_id UUID;
  v_webhook_id UUID;
BEGIN
  -- Get first user and organization
  SELECT id INTO v_user_id FROM users LIMIT 1;
  SELECT id INTO v_org_id FROM organizations LIMIT 1;

  -- Create sample API key if none exists
  IF NOT EXISTS (SELECT 1 FROM api_keys WHERE user_id = v_user_id LIMIT 1) THEN
    INSERT INTO api_keys (
      user_id,
      organization_id,
      name,
      key_prefix,
      key_hash,
      environment,
      is_active
    ) VALUES (
      v_user_id,
      v_org_id,
      'Development Key',
      'sk_test',
      encode(digest('test_key_' || gen_random_uuid()::text, 'sha256'), 'hex'),
      'test',
      true
    ) RETURNING id INTO v_api_key_id;
  ELSE
    SELECT id INTO v_api_key_id FROM api_keys WHERE user_id = v_user_id LIMIT 1;
  END IF;

  -- Create sample webhook if none exists
  IF NOT EXISTS (SELECT 1 FROM webhooks WHERE user_id = v_user_id LIMIT 1) THEN
    INSERT INTO webhooks (
      user_id,
      organization_id,
      url,
      secret,
      events,
      is_active
    ) VALUES (
      v_user_id,
      v_org_id,
      'https://example.com/webhooks/taxu',
      encode(gen_random_bytes(32), 'hex'),
      '["tax_filing.1099_nec.created", "neobank.transaction.created"]'::jsonb,
      true
    ) RETURNING id INTO v_webhook_id;
  ELSE
    SELECT id INTO v_webhook_id FROM webhooks WHERE user_id = v_user_id LIMIT 1;
  END IF;

  -- Step 1: Create sample API key scopes
  INSERT INTO api_key_scopes (api_key_id, scope) VALUES
  (v_api_key_id, 'tax_filing:read'),
  (v_api_key_id, 'tax_filing:write'),
  (v_api_key_id, 'neobank:read'),
  (v_api_key_id, 'investment:read');

  -- Step 2: Create sample webhook events
  INSERT INTO webhook_events (event_type, event_category, user_id, organization_id, resource_type, resource_id, payload) VALUES
  ('tax_filing.1099_nec.created', 'tax_filing', v_user_id, v_org_id, 'filing', gen_random_uuid(), '{"filing_id": "1099_001", "tax_year": 2024, "status": "submitted"}'::jsonb),
  ('tax_filing.1099_nec.completed', 'tax_filing', v_user_id, v_org_id, 'filing', gen_random_uuid(), '{"filing_id": "1099_001", "tax_year": 2024, "status": "accepted"}'::jsonb),
  ('neobank.transaction.created', 'neobank', v_user_id, v_org_id, 'transaction', gen_random_uuid(), '{"transaction_id": "txn_001", "amount": 1500.00, "type": "deposit"}'::jsonb),
  ('neobank.account.updated', 'neobank', v_user_id, v_org_id, 'account', gen_random_uuid(), '{"account_id": "acc_001", "balance": 25000.00}'::jsonb),
  ('investment.portfolio.updated', 'investment', v_user_id, v_org_id, 'portfolio', gen_random_uuid(), '{"portfolio_id": "port_001", "total_value": 125000.00}'::jsonb),
  ('investment.trade.executed', 'investment', v_user_id, v_org_id, 'trade', gen_random_uuid(), '{"trade_id": "trade_001", "symbol": "AAPL", "shares": 10}'::jsonb),
  ('accounting.invoice.created', 'accounting', v_user_id, v_org_id, 'invoice', gen_random_uuid(), '{"invoice_id": "inv_001", "amount": 2500.00}'::jsonb),
  ('accounting.expense.approved', 'accounting', v_user_id, v_org_id, 'expense', gen_random_uuid(), '{"expense_id": "exp_001", "amount": 150.00}'::jsonb);

  -- Step 3: Create sample webhook subscriptions
  INSERT INTO webhook_subscriptions (webhook_id, event_type, is_active) VALUES
  (v_webhook_id, 'tax_filing.1099_nec.created', true),
  (v_webhook_id, 'tax_filing.1099_nec.completed', true),
  (v_webhook_id, 'neobank.transaction.created', true),
  (v_webhook_id, 'investment.portfolio.updated', true);

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
    ip_address
  ) VALUES
  (v_api_key_id, v_user_id, v_org_id, '/api/v1/tax-filing/1099-nec', 'POST', 201, 145, 'taxu-node-sdk/1.0.0', '192.168.1.100'),
  (v_api_key_id, v_user_id, v_org_id, '/api/v1/neobank/accounts', 'GET', 200, 89, 'taxu-python-sdk/1.2.0', '192.168.1.101'),
  (v_api_key_id, v_user_id, v_org_id, '/api/v1/investment/portfolios', 'GET', 200, 112, 'taxu-ruby-sdk/1.1.0', '192.168.1.102'),
  (v_api_key_id, v_user_id, v_org_id, '/api/v1/accounting/invoices', 'POST', 201, 178, 'curl/7.81.0', '192.168.1.103'),
  (v_api_key_id, v_user_id, v_org_id, '/api/v1/webhooks', 'GET', 200, 67, 'PostmanRuntime/7.32.3', '192.168.1.104');

  -- Step 5: Create sample SDK downloads
  INSERT INTO sdk_downloads (
    sdk_name,
    sdk_version,
    download_source,
    user_id,
    ip_address,
    user_agent
  ) VALUES
  ('taxu-node', '1.0.0', 'npm', v_user_id, '203.0.113.1', 'npm/9.6.7'),
  ('taxu-python', '1.2.0', 'pypi', v_user_id, '203.0.113.2', 'pip/23.1.2'),
  ('taxu-ruby', '1.1.0', 'rubygems', v_user_id, '203.0.113.3', 'Ruby/3.2.0'),
  ('taxu-php', '1.0.5', 'packagist', v_user_id, '203.0.113.4', 'Composer/2.5.5'),
  ('taxu-go', '1.1.2', 'go', v_user_id, '203.0.113.5', 'Go/1.21.0'),
  ('taxu-java', '1.0.8', 'maven', v_user_id, '203.0.113.6', 'Maven/3.9.2');

  -- Step 6: Create sample documentation page views
  INSERT INTO documentation_page_views (
    page_path,
    page_title,
    user_id,
    referrer,
    search_query,
    time_on_page_seconds
  ) VALUES
  ('/developer/docs/api/tax-filing', 'Tax Filing API', v_user_id, 'https://google.com', 'tax filing api', 120),
  ('/developer/docs/api/neobank', 'Neobank API', v_user_id, NULL, NULL, 95),
  ('/developer/docs/webhooks', 'Webhooks Documentation', v_user_id, '/developer/docs', NULL, 240),
  ('/developer/docs/sdks', 'SDKs & Libraries', v_user_id, NULL, 'python sdk', 60),
  ('/developer/docs/cli', 'CLI Documentation', v_user_id, 'https://taxu.com', NULL, 180);

  -- Step 7: Create sample documentation feedback
  INSERT INTO documentation_feedback (
    page_path,
    user_id,
    rating,
    feedback_text,
    feedback_type
  ) VALUES
  ('/developer/docs/api/tax-filing', v_user_id, 5, 'Very clear documentation! Helped me integrate quickly.', 'positive'),
  ('/developer/docs/webhooks', v_user_id, 4, 'Good examples, but need more information about retry logic.', 'suggestion'),
  ('/developer/docs/sdks', v_user_id, 3, 'Missing Python 3.11 compatibility information.', 'issue');

  -- Step 8: Create API versions
  INSERT INTO api_versions (
    version_number,
    release_date,
    is_current,
    is_deprecated,
    deprecation_date,
    sunset_date,
    changelog
  ) VALUES
  ('2024-12-01', '2024-12-01', true, false, NULL, NULL, 'Latest stable release with investment analytics'),
  ('2024-09-01', '2024-09-01', false, false, NULL, NULL, 'Enhanced webhook retry logic'),
  ('2024-06-01', '2024-06-01', false, true, '2024-12-01', '2025-06-01', 'Legacy version - please migrate');

  -- Step 9: Create API changelog entries
  INSERT INTO api_changelog_entries (
    version_id,
    change_type,
    title,
    description,
    affected_endpoints,
    published_at
  ) VALUES
  (
    (SELECT id FROM api_versions WHERE version_number = '2024-12-01'),
    'feature',
    'Added Investment Portfolio Analytics',
    'New endpoints for comprehensive portfolio performance analytics including returns, benchmarks, and risk metrics.',
    ARRAY['/api/v1/investment/portfolios/{id}/analytics', '/api/v1/investment/portfolios/{id}/performance'],
    NOW() - INTERVAL '7 days'
  ),
  (
    (SELECT id FROM api_versions WHERE version_number = '2024-12-01'),
    'improvement',
    'Enhanced Webhook Retry Logic',
    'Webhooks now retry with exponential backoff up to 72 hours. Added webhook delivery status tracking.',
    NULL,
    NOW() - INTERVAL '7 days'
  );

  -- Step 10: Create sample developer test collections
  INSERT INTO developer_test_collections (
    user_id,
    collection_name,
    description,
    is_public
  ) VALUES
  (v_user_id, 'Tax Filing Quick Tests', 'Common tax filing scenarios for testing', false),
  (v_user_id, 'Neobank Integration Tests', 'End-to-end neobank API tests', false);

  -- Step 11: Create sample developer test requests
  INSERT INTO developer_test_requests (
    user_id,
    request_name,
    method,
    endpoint,
    headers,
    body,
    response_body,
    response_status,
    is_saved
  ) VALUES
  (v_user_id, 'Create 1099-NEC Filing', 'POST', '/api/v1/tax-filing/1099-nec',
   '{"Content-Type": "application/json", "Authorization": "Bearer test_key"}'::jsonb,
   '{"tax_year": 2024, "recipient": {"name": "John Doe", "tin": "123-45-6789"}, "amount": 5000.00}'::jsonb,
   '{"filing_id": "1099_001", "status": "submitted", "created_at": "2024-12-08T12:00:00Z"}'::jsonb,
   201, true),
  (v_user_id, 'Get Account Balance', 'GET', '/api/v1/neobank/accounts/acc_001',
   '{"Authorization": "Bearer test_key"}'::jsonb,
   NULL,
   '{"account_id": "acc_001", "balance": 25000.00, "currency": "USD"}'::jsonb,
   200, true);

  -- Step 12: Create sample support tickets
  INSERT INTO developer_support_tickets (
    user_id,
    organization_id,
    ticket_number,
    subject,
    description,
    status,
    priority,
    category
  ) VALUES
  (v_user_id, v_org_id, 'TICK-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
   'Webhook delivery failing for tax_filing.completed events',
   'I am not receiving webhook events for tax_filing.completed. My endpoint is https://myapp.com/webhooks/taxu and it returns 200 OK when I test manually.',
   'open', 'high', 'webhook'),
  (v_user_id, v_org_id, 'TICK-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
   'Question about rate limits for neobank API',
   'What are the rate limits for the neobank API? I am planning to process about 1000 transactions per hour.',
   'resolved', 'medium', 'api');

  -- Step 13: Create sample support messages
  INSERT INTO developer_support_messages (
    ticket_id,
    user_id,
    is_staff,
    message
  ) VALUES
  (
    (SELECT id FROM developer_support_tickets WHERE subject LIKE 'Webhook delivery%'),
    v_user_id,
    false,
    'Hi, I''m not receiving webhook events for tax_filing.completed. My endpoint is https://myapp.com/webhooks/taxu and it returns 200 OK when I test manually.'
  ),
  (
    (SELECT id FROM developer_support_tickets WHERE subject LIKE 'Question about rate limits%'),
    v_user_id,
    false,
    'What are the rate limits for the neobank API? I''m planning to process about 1000 transactions per hour.'
  );

  -- Step 14: Create API status incidents
  INSERT INTO api_status_incidents (
    incident_title,
    incident_description,
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

  -- Step 15: Create API status updates
  INSERT INTO api_status_updates (
    incident_id,
    update_text,
    status
  ) VALUES
  (
    (SELECT id FROM api_status_incidents WHERE incident_title = 'Increased API Latency - Tax Filing'),
    'We have identified the issue as a database query optimization problem and are deploying a fix.',
    'investigating'
  ),
  (
    (SELECT id FROM api_status_incidents WHERE incident_title = 'Increased API Latency - Tax Filing'),
    'Fix has been deployed and latency has returned to normal levels. We will continue monitoring.',
    'resolved'
  ),
  (
    (SELECT id FROM api_status_incidents WHERE incident_title = 'Webhook Delivery Delays'),
    'We are investigating increased webhook delivery times. Deliveries are still being processed but may be delayed by up to 10 minutes.',
    'investigating'
  );

  RAISE NOTICE 'Developer Platform seed data created successfully!';
END $$;

-- Display summary
SELECT 'Total webhook events created: ' || COUNT(*)::text AS summary FROM webhook_events;
SELECT 'Total API request logs created: ' || COUNT(*)::text AS summary FROM api_request_logs;
SELECT 'Total SDK downloads created: ' || COUNT(*)::text AS summary FROM sdk_downloads;
SELECT 'Total documentation page views created: ' || COUNT(*)::text AS summary FROM documentation_page_views;
SELECT 'Total API key scopes created: ' || COUNT(*)::text AS summary FROM api_key_scopes;
SELECT 'Total support tickets created: ' || COUNT(*)::text AS summary FROM developer_support_tickets;
SELECT 'Success! Your Taxu Developer Platform is now populated with sample data.' AS final_message;
