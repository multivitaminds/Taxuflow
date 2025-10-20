-- ============================================================================
-- TAXU PLATFORM - SAMPLE DATA SEED SCRIPT
-- ============================================================================
-- This script populates the accounting tables with realistic sample data
-- for a fictional consulting company: "TechConsult Solutions LLC"
-- Fiscal Year: 2024
-- ============================================================================

-- Note: Replace 'YOUR_USER_ID_HERE' with an actual user UUID from auth.users
-- Or run this after authentication to use auth.uid()

DO $$
DECLARE
  demo_user_id UUID := '00000000-0000-0000-0000-000000000001'; -- Replace with actual user ID
  
  -- Account IDs
  cash_account_id UUID;
  ar_account_id UUID;
  ap_account_id UUID;
  revenue_account_id UUID;
  expense_account_id UUID;
  equity_account_id UUID;
  
  -- Customer IDs
  customer1_id UUID;
  customer2_id UUID;
  customer3_id UUID;
  customer4_id UUID;
  customer5_id UUID;
  
  -- Vendor IDs
  vendor1_id UUID;
  vendor2_id UUID;
  vendor3_id UUID;
  
  -- Product IDs
  product1_id UUID;
  product2_id UUID;
  product3_id UUID;
  
  -- Invoice IDs
  invoice1_id UUID;
  invoice2_id UUID;
  invoice3_id UUID;
  
  -- Bill IDs
  bill1_id UUID;
  bill2_id UUID;
  
  -- Bank Account ID
  bank_account_id UUID;

BEGIN

-- ============================================================================
-- SECTION 1: CHART OF ACCOUNTS
-- ============================================================================

-- Assets
INSERT INTO chart_of_accounts (id, user_id, account_number, account_name, account_type, account_subtype, balance)
VALUES 
  (uuid_generate_v4(), demo_user_id, '1000', 'Cash', 'Asset', 'Current Asset', 125000.00),
  (uuid_generate_v4(), demo_user_id, '1200', 'Accounts Receivable', 'Asset', 'Current Asset', 45000.00),
  (uuid_generate_v4(), demo_user_id, '1500', 'Equipment', 'Asset', 'Fixed Asset', 35000.00),
  (uuid_generate_v4(), demo_user_id, '1600', 'Accumulated Depreciation', 'Asset', 'Fixed Asset', -5000.00)
RETURNING id INTO cash_account_id;

SELECT id INTO ar_account_id FROM chart_of_accounts WHERE account_number = '1200' AND user_id = demo_user_id;

-- Liabilities
INSERT INTO chart_of_accounts (id, user_id, account_number, account_name, account_type, account_subtype, balance)
VALUES 
  (uuid_generate_v4(), demo_user_id, '2000', 'Accounts Payable', 'Liability', 'Current Liability', 15000.00),
  (uuid_generate_v4(), demo_user_id, '2100', 'Credit Card Payable', 'Liability', 'Current Liability', 3500.00),
  (uuid_generate_v4(), demo_user_id, '2500', 'Long-term Debt', 'Liability', 'Long-term Liability', 50000.00)
RETURNING id INTO ap_account_id;

-- Equity
INSERT INTO chart_of_accounts (id, user_id, account_number, account_name, account_type, account_subtype, balance)
VALUES 
  (uuid_generate_v4(), demo_user_id, '3000', 'Owner Equity', 'Equity', 'Owner Equity', 100000.00),
  (uuid_generate_v4(), demo_user_id, '3900', 'Retained Earnings', 'Equity', 'Retained Earnings', 31500.00)
RETURNING id INTO equity_account_id;

-- Revenue
INSERT INTO chart_of_accounts (id, user_id, account_number, account_name, account_type, account_subtype, balance)
VALUES 
  (uuid_generate_v4(), demo_user_id, '4000', 'Consulting Revenue', 'Revenue', 'Service Revenue', 285000.00),
  (uuid_generate_v4(), demo_user_id, '4100', 'Training Revenue', 'Revenue', 'Service Revenue', 45000.00),
  (uuid_generate_v4(), demo_user_id, '4200', 'Software Licensing', 'Revenue', 'Product Revenue', 28000.00)
RETURNING id INTO revenue_account_id;

-- Expenses
INSERT INTO chart_of_accounts (id, user_id, account_number, account_name, account_type, account_subtype, balance)
VALUES 
  (uuid_generate_v4(), demo_user_id, '5000', 'Salaries & Wages', 'Expense', 'Operating Expense', 180000.00),
  (uuid_generate_v4(), demo_user_id, '5100', 'Rent Expense', 'Expense', 'Operating Expense', 36000.00),
  (uuid_generate_v4(), demo_user_id, '5200', 'Utilities', 'Expense', 'Operating Expense', 4800.00),
  (uuid_generate_v4(), demo_user_id, '5300', 'Office Supplies', 'Expense', 'Operating Expense', 3200.00),
  (uuid_generate_v4(), demo_user_id, '5400', 'Marketing & Advertising', 'Expense', 'Operating Expense', 12000.00),
  (uuid_generate_v4(), demo_user_id, '5500', 'Professional Fees', 'Expense', 'Operating Expense', 8500.00),
  (uuid_generate_v4(), demo_user_id, '5600', 'Insurance', 'Expense', 'Operating Expense', 6000.00),
  (uuid_generate_v4(), demo_user_id, '5700', 'Travel & Entertainment', 'Expense', 'Operating Expense', 9500.00),
  (uuid_generate_v4(), demo_user_id, '5800', 'Software Subscriptions', 'Expense', 'Operating Expense', 7200.00),
  (uuid_generate_v4(), demo_user_id, '5900', 'Depreciation', 'Expense', 'Operating Expense', 5000.00)
RETURNING id INTO expense_account_id;

-- ============================================================================
-- SECTION 2: CUSTOMERS
-- ============================================================================

INSERT INTO customers (id, user_id, company_name, contact_name, email, phone, address, city, state, zip_code, payment_terms, credit_limit)
VALUES 
  (uuid_generate_v4(), demo_user_id, 'Acme Corporation', 'John Smith', 'john.smith@acmecorp.com', '555-0101', '123 Business Ave', 'New York', 'NY', '10001', 30, 50000.00),
  (uuid_generate_v4(), demo_user_id, 'Global Tech Industries', 'Sarah Johnson', 'sarah.j@globaltech.com', '555-0102', '456 Tech Blvd', 'San Francisco', 'CA', '94102', 45, 75000.00),
  (uuid_generate_v4(), demo_user_id, 'Innovate Solutions', 'Michael Chen', 'mchen@innovatesol.com', '555-0103', '789 Innovation Dr', 'Austin', 'TX', '78701', 30, 40000.00),
  (uuid_generate_v4(), demo_user_id, 'Enterprise Systems LLC', 'Emily Davis', 'edavis@entsys.com', '555-0104', '321 Enterprise Way', 'Chicago', 'IL', '60601', 60, 100000.00),
  (uuid_generate_v4(), demo_user_id, 'StartUp Ventures', 'David Wilson', 'dwilson@startupventures.com', '555-0105', '654 Startup St', 'Seattle', 'WA', '98101', 15, 25000.00)
RETURNING id INTO customer1_id;

SELECT id INTO customer2_id FROM customers WHERE company_name = 'Global Tech Industries' AND user_id = demo_user_id;
SELECT id INTO customer3_id FROM customers WHERE company_name = 'Innovate Solutions' AND user_id = demo_user_id;
SELECT id INTO customer4_id FROM customers WHERE company_name = 'Enterprise Systems LLC' AND user_id = demo_user_id;
SELECT id INTO customer5_id FROM customers WHERE company_name = 'StartUp Ventures' AND user_id = demo_user_id;

-- ============================================================================
-- SECTION 3: VENDORS
-- ============================================================================

INSERT INTO vendors (id, user_id, company_name, contact_name, email, phone, address, city, state, zip_code, payment_terms)
VALUES 
  (uuid_generate_v4(), demo_user_id, 'Office Depot', 'Sales Department', 'sales@officedepot.com', '555-0201', '100 Supply Rd', 'Atlanta', 'GA', '30301', 30),
  (uuid_generate_v4(), demo_user_id, 'Cloud Services Inc', 'Account Manager', 'billing@cloudservices.com', '555-0202', '200 Cloud Ave', 'Portland', 'OR', '97201', 30),
  (uuid_generate_v4(), demo_user_id, 'Marketing Pro Agency', 'Jennifer Lee', 'jlee@marketingpro.com', '555-0203', '300 Marketing Ln', 'Miami', 'FL', '33101', 15)
RETURNING id INTO vendor1_id;

SELECT id INTO vendor2_id FROM vendors WHERE company_name = 'Cloud Services Inc' AND user_id = demo_user_id;
SELECT id INTO vendor3_id FROM vendors WHERE company_name = 'Marketing Pro Agency' AND user_id = demo_user_id;

-- ============================================================================
-- SECTION 4: PRODUCTS & SERVICES
-- ============================================================================

INSERT INTO products (id, user_id, name, description, type, sku, unit_price, cost, taxable)
VALUES 
  (uuid_generate_v4(), demo_user_id, 'IT Consulting - Hourly', 'Professional IT consulting services', 'service', 'SVC-001', 150.00, 75.00, true),
  (uuid_generate_v4(), demo_user_id, 'Software Development - Hourly', 'Custom software development', 'service', 'SVC-002', 175.00, 90.00, true),
  (uuid_generate_v4(), demo_user_id, 'Training Workshop - Full Day', 'On-site training workshop', 'service', 'SVC-003', 2500.00, 800.00, true),
  (uuid_generate_v4(), demo_user_id, 'Project Management', 'Project management services', 'service', 'SVC-004', 125.00, 60.00, true),
  (uuid_generate_v4(), demo_user_id, 'Software License - Annual', 'Annual software license', 'product', 'PRD-001', 1200.00, 400.00, true)
RETURNING id INTO product1_id;

SELECT id INTO product2_id FROM products WHERE sku = 'SVC-002' AND user_id = demo_user_id;
SELECT id INTO product3_id FROM products WHERE sku = 'SVC-003' AND user_id = demo_user_id;

-- ============================================================================
-- SECTION 5: BANK ACCOUNTS
-- ============================================================================

INSERT INTO bank_accounts (id, user_id, account_name, account_number, bank_name, account_type, current_balance)
VALUES 
  (uuid_generate_v4(), demo_user_id, 'Business Checking', '****1234', 'First National Bank', 'checking', 125000.00),
  (uuid_generate_v4(), demo_user_id, 'Business Savings', '****5678', 'First National Bank', 'savings', 50000.00),
  (uuid_generate_v4(), demo_user_id, 'Business Credit Card', '****9012', 'Chase Bank', 'credit_card', -3500.00)
RETURNING id INTO bank_account_id;

-- ============================================================================
-- SECTION 6: INVOICES (Q1-Q4 2024)
-- ============================================================================

-- January Invoices
INSERT INTO invoices (id, user_id, customer_id, invoice_number, invoice_date, due_date, status, subtotal, tax_amount, total_amount, amount_paid, balance_due)
VALUES 
  (uuid_generate_v4(), demo_user_id, customer1_id, 'INV-2024-001', '2024-01-15', '2024-02-14', 'paid', 15000.00, 1200.00, 16200.00, 16200.00, 0.00),
  (uuid_generate_v4(), demo_user_id, customer2_id, 'INV-2024-002', '2024-01-20', '2024-03-05', 'paid', 22500.00, 1800.00, 24300.00, 24300.00, 0.00)
RETURNING id INTO invoice1_id;

-- February Invoices
INSERT INTO invoices (id, user_id, customer_id, invoice_number, invoice_date, due_date, status, subtotal, tax_amount, total_amount, amount_paid, balance_due)
VALUES 
  (uuid_generate_v4(), demo_user_id, customer3_id, 'INV-2024-003', '2024-02-10', '2024-03-11', 'paid', 18000.00, 1440.00, 19440.00, 19440.00, 0.00),
  (uuid_generate_v4(), demo_user_id, customer4_id, 'INV-2024-004', '2024-02-25', '2024-04-25', 'paid', 35000.00, 2800.00, 37800.00, 37800.00, 0.00)
RETURNING id INTO invoice2_id;

-- March Invoices
INSERT INTO invoices (id, user_id, customer_id, invoice_number, invoice_date, due_date, status, subtotal, tax_amount, total_amount, amount_paid, balance_due)
VALUES 
  (uuid_generate_v4(), demo_user_id, customer5_id, 'INV-2024-005', '2024-03-05', '2024-03-20', 'paid', 12000.00, 960.00, 12960.00, 12960.00, 0.00),
  (uuid_generate_v4(), demo_user_id, customer1_id, 'INV-2024-006', '2024-03-18', '2024-04-17', 'paid', 20000.00, 1600.00, 21600.00, 21600.00, 0.00)
RETURNING id INTO invoice3_id;

-- April-June Invoices
INSERT INTO invoices (user_id, customer_id, invoice_number, invoice_date, due_date, status, subtotal, tax_amount, total_amount, amount_paid, balance_due)
VALUES 
  (demo_user_id, customer2_id, 'INV-2024-007', '2024-04-12', '2024-05-27', 'paid', 28000.00, 2240.00, 30240.00, 30240.00, 0.00),
  (demo_user_id, customer3_id, 'INV-2024-008', '2024-05-08', '2024-06-07', 'paid', 16500.00, 1320.00, 17820.00, 17820.00, 0.00),
  (demo_user_id, customer4_id, 'INV-2024-009', '2024-06-15', '2024-08-14', 'paid', 42000.00, 3360.00, 45360.00, 45360.00, 0.00);

-- July-September Invoices
INSERT INTO invoices (user_id, customer_id, invoice_number, invoice_date, due_date, status, subtotal, tax_amount, total_amount, amount_paid, balance_due)
VALUES 
  (demo_user_id, customer5_id, 'INV-2024-010', '2024-07-10', '2024-07-25', 'paid', 14000.00, 1120.00, 15120.00, 15120.00, 0.00),
  (demo_user_id, customer1_id, 'INV-2024-011', '2024-08-05', '2024-09-04', 'paid', 25000.00, 2000.00, 27000.00, 27000.00, 0.00),
  (demo_user_id, customer2_id, 'INV-2024-012', '2024-09-20', '2024-11-04', 'sent', 32000.00, 2560.00, 34560.00, 0.00, 34560.00);

-- October-December Invoices
INSERT INTO invoices (user_id, customer_id, invoice_number, invoice_date, due_date, status, subtotal, tax_amount, total_amount, amount_paid, balance_due)
VALUES 
  (demo_user_id, customer3_id, 'INV-2024-013', '2024-10-08', '2024-11-07', 'sent', 19000.00, 1520.00, 20520.00, 10000.00, 10520.00),
  (demo_user_id, customer4_id, 'INV-2024-014', '2024-11-12', '2025-01-11', 'sent', 38000.00, 3040.00, 41040.00, 0.00, 41040.00),
  (demo_user_id, customer5_id, 'INV-2024-015', '2024-12-01', '2024-12-16', 'draft', 15000.00, 1200.00, 16200.00, 0.00, 16200.00);

-- ============================================================================
-- SECTION 7: INVOICE ITEMS
-- ============================================================================

-- Invoice 1 Items
INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, amount)
VALUES 
  (invoice1_id, product1_id, 'IT Consulting - January', 100.00, 150.00, 15000.00);

-- Invoice 2 Items
INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, amount)
VALUES 
  (invoice2_id, product2_id, 'Software Development - Phase 1', 128.57, 175.00, 22500.00);

-- Invoice 3 Items
INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, amount)
VALUES 
  (invoice3_id, product1_id, 'IT Consulting - February', 120.00, 150.00, 18000.00);

-- ============================================================================
-- SECTION 8: BILLS (Vendor Expenses)
-- ============================================================================

-- Q1 Bills
INSERT INTO bills (id, user_id, vendor_id, bill_number, bill_date, due_date, status, subtotal, tax_amount, total_amount, amount_paid, balance_due)
VALUES 
  (uuid_generate_v4(), demo_user_id, vendor1_id, 'BILL-001', '2024-01-10', '2024-02-09', 'paid', 1200.00, 96.00, 1296.00, 1296.00, 0.00),
  (uuid_generate_v4(), demo_user_id, vendor2_id, 'BILL-002', '2024-02-01', '2024-03-02', 'paid', 2400.00, 0.00, 2400.00, 2400.00, 0.00),
  (uuid_generate_v4(), demo_user_id, vendor3_id, 'BILL-003', '2024-03-15', '2024-03-30', 'paid', 5000.00, 400.00, 5400.00, 5400.00, 0.00)
RETURNING id INTO bill1_id;

-- Q2-Q4 Bills
INSERT INTO bills (user_id, vendor_id, bill_number, bill_date, due_date, status, subtotal, tax_amount, total_amount, amount_paid, balance_due)
VALUES 
  (demo_user_id, vendor1_id, 'BILL-004', '2024-04-10', '2024-05-10', 'paid', 800.00, 64.00, 864.00, 864.00, 0.00),
  (demo_user_id, vendor2_id, 'BILL-005', '2024-05-01', '2024-05-31', 'paid', 2400.00, 0.00, 2400.00, 2400.00, 0.00),
  (demo_user_id, vendor3_id, 'BILL-006', '2024-06-20', '2024-07-05', 'paid', 3500.00, 280.00, 3780.00, 3780.00, 0.00),
  (demo_user_id, vendor1_id, 'BILL-007', '2024-07-15', '2024-08-14', 'paid', 950.00, 76.00, 1026.00, 1026.00, 0.00),
  (demo_user_id, vendor2_id, 'BILL-008', '2024-08-01', '2024-08-31', 'paid', 2400.00, 0.00, 2400.00, 2400.00, 0.00),
  (demo_user_id, vendor3_id, 'BILL-009', '2024-09-10', '2024-09-25', 'paid', 4200.00, 336.00, 4536.00, 4536.00, 0.00),
  (demo_user_id, vendor1_id, 'BILL-010', '2024-10-12', '2024-11-11', 'open', 1100.00, 88.00, 1188.00, 0.00, 1188.00),
  (demo_user_id, vendor2_id, 'BILL-011', '2024-11-01', '2024-12-01', 'open', 2400.00, 0.00, 2400.00, 0.00, 2400.00),
  (demo_user_id, vendor3_id, 'BILL-012', '2024-12-05', '2024-12-20', 'draft', 3800.00, 304.00, 4104.00, 0.00, 4104.00);

SELECT id INTO bill2_id FROM bills WHERE bill_number = 'BILL-002' AND user_id = demo_user_id;

-- ============================================================================
-- SECTION 9: BILL ITEMS
-- ============================================================================

INSERT INTO bill_items (bill_id, description, quantity, unit_price, amount)
VALUES 
  (bill1_id, 'Office Supplies - January', 1.00, 1200.00, 1200.00),
  (bill2_id, 'Cloud Hosting - Monthly', 1.00, 2400.00, 2400.00);

-- ============================================================================
-- SECTION 10: EXPENSES (Operating Expenses)
-- ============================================================================

-- Monthly recurring expenses
INSERT INTO expenses (user_id, vendor_id, expense_date, category, description, amount, payment_method)
VALUES 
  -- Rent (Monthly)
  (demo_user_id, NULL, '2024-01-01', 'Rent', 'Office Rent - January', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-02-01', 'Rent', 'Office Rent - February', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-03-01', 'Rent', 'Office Rent - March', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-04-01', 'Rent', 'Office Rent - April', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-05-01', 'Rent', 'Office Rent - May', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-06-01', 'Rent', 'Office Rent - June', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-07-01', 'Rent', 'Office Rent - July', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-08-01', 'Rent', 'Office Rent - August', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-09-01', 'Rent', 'Office Rent - September', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-10-01', 'Rent', 'Office Rent - October', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-11-01', 'Rent', 'Office Rent - November', 3000.00, 'Check'),
  (demo_user_id, NULL, '2024-12-01', 'Rent', 'Office Rent - December', 3000.00, 'Check'),
  
  -- Utilities (Monthly)
  (demo_user_id, NULL, '2024-01-15', 'Utilities', 'Electric & Internet - January', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-02-15', 'Utilities', 'Electric & Internet - February', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-03-15', 'Utilities', 'Electric & Internet - March', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-04-15', 'Utilities', 'Electric & Internet - April', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-05-15', 'Utilities', 'Electric & Internet - May', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-06-15', 'Utilities', 'Electric & Internet - June', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-07-15', 'Utilities', 'Electric & Internet - July', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-08-15', 'Utilities', 'Electric & Internet - August', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-09-15', 'Utilities', 'Electric & Internet - September', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-10-15', 'Utilities', 'Electric & Internet - October', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-11-15', 'Utilities', 'Electric & Internet - November', 400.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-12-15', 'Utilities', 'Electric & Internet - December', 400.00, 'Credit Card'),
  
  -- Salaries (Bi-weekly - 26 pay periods, showing quarterly totals)
  (demo_user_id, NULL, '2024-03-31', 'Payroll', 'Q1 Salaries & Wages', 45000.00, 'Direct Deposit'),
  (demo_user_id, NULL, '2024-06-30', 'Payroll', 'Q2 Salaries & Wages', 45000.00, 'Direct Deposit'),
  (demo_user_id, NULL, '2024-09-30', 'Payroll', 'Q3 Salaries & Wages', 45000.00, 'Direct Deposit'),
  (demo_user_id, NULL, '2024-12-31', 'Payroll', 'Q4 Salaries & Wages', 45000.00, 'Direct Deposit'),
  
  -- Software Subscriptions (Monthly)
  (demo_user_id, vendor2_id, '2024-01-05', 'Software', 'Software Subscriptions - January', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-02-05', 'Software', 'Software Subscriptions - February', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-03-05', 'Software', 'Software Subscriptions - March', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-04-05', 'Software', 'Software Subscriptions - April', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-05-05', 'Software', 'Software Subscriptions - May', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-06-05', 'Software', 'Software Subscriptions - June', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-07-05', 'Software', 'Software Subscriptions - July', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-08-05', 'Software', 'Software Subscriptions - August', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-09-05', 'Software', 'Software Subscriptions - September', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-10-05', 'Software', 'Software Subscriptions - October', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-11-05', 'Software', 'Software Subscriptions - November', 600.00, 'Credit Card'),
  (demo_user_id, vendor2_id, '2024-12-05', 'Software', 'Software Subscriptions - December', 600.00, 'Credit Card'),
  
  -- Insurance (Quarterly)
  (demo_user_id, NULL, '2024-01-15', 'Insurance', 'Business Insurance - Q1', 1500.00, 'Check'),
  (demo_user_id, NULL, '2024-04-15', 'Insurance', 'Business Insurance - Q2', 1500.00, 'Check'),
  (demo_user_id, NULL, '2024-07-15', 'Insurance', 'Business Insurance - Q3', 1500.00, 'Check'),
  (demo_user_id, NULL, '2024-10-15', 'Insurance', 'Business Insurance - Q4', 1500.00, 'Check'),
  
  -- Travel & Entertainment (Sporadic)
  (demo_user_id, NULL, '2024-02-20', 'Travel', 'Client Meeting - NYC', 850.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-03-10', 'Travel', 'Conference - San Francisco', 1200.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-05-15', 'Travel', 'Client Visit - Chicago', 650.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-06-22', 'Entertainment', 'Client Dinner', 320.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-08-05', 'Travel', 'Training - Boston', 980.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-09-18', 'Travel', 'Client Meeting - Seattle', 1100.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-10-25', 'Entertainment', 'Team Building Event', 450.00, 'Credit Card'),
  (demo_user_id, NULL, '2024-11-12', 'Travel', 'Conference - Austin', 1250.00, 'Credit Card'),
  
  -- Professional Fees (Quarterly)
  (demo_user_id, NULL, '2024-03-31', 'Professional Fees', 'Legal & Accounting - Q1', 2000.00, 'Check'),
  (demo_user_id, NULL, '2024-06-30', 'Professional Fees', 'Legal & Accounting - Q2', 2000.00, 'Check'),
  (demo_user_id, NULL, '2024-09-30', 'Professional Fees', 'Legal & Accounting - Q3', 2500.00, 'Check'),
  (demo_user_id, NULL, '2024-12-31', 'Professional Fees', 'Legal & Accounting - Q4', 2000.00, 'Check');

-- ============================================================================
-- SECTION 11: PAYMENTS (Customer Payments)
-- ============================================================================

INSERT INTO payments (user_id, payment_type, customer_id, payment_date, payment_method, reference_number, amount)
VALUES 
  (demo_user_id, 'customer_payment', customer1_id, '2024-02-10', 'ACH', 'PMT-001', 16200.00),
  (demo_user_id, 'customer_payment', customer2_id, '2024-03-01', 'Wire Transfer', 'PMT-002', 24300.00),
  (demo_user_id, 'customer_payment', customer3_id, '2024-03-05', 'Check', 'PMT-003', 19440.00),
  (demo_user_id, 'customer_payment', customer4_id, '2024-04-20', 'ACH', 'PMT-004', 37800.00),
  (demo_user_id, 'customer_payment', customer5_id, '2024-03-18', 'Credit Card', 'PMT-005', 12960.00),
  (demo_user_id, 'customer_payment', customer1_id, '2024-04-15', 'ACH', 'PMT-006', 21600.00),
  (demo_user_id, 'customer_payment', customer2_id, '2024-05-25', 'Wire Transfer', 'PMT-007', 30240.00),
  (demo_user_id, 'customer_payment', customer3_id, '2024-06-05', 'Check', 'PMT-008', 17820.00),
  (demo_user_id, 'customer_payment', customer4_id, '2024-08-10', 'ACH', 'PMT-009', 45360.00),
  (demo_user_id, 'customer_payment', customer5_id, '2024-07-22', 'Credit Card', 'PMT-010', 15120.00),
  (demo_user_id, 'customer_payment', customer1_id, '2024-09-02', 'ACH', 'PMT-011', 27000.00),
  (demo_user_id, 'customer_payment', customer3_id, '2024-10-15', 'Check', 'PMT-012', 10000.00);

-- ============================================================================
-- SECTION 12: BANK TRANSACTIONS
-- ============================================================================

-- Sample bank transactions for the checking account
INSERT INTO bank_transactions (bank_account_id, transaction_date, description, amount, transaction_type, category, reconciled)
VALUES 
  -- Deposits (Customer Payments)
  (bank_account_id, '2024-02-10', 'Customer Payment - Acme Corp', 16200.00, 'credit', 'Customer Payment', true),
  (bank_account_id, '2024-03-01', 'Customer Payment - Global Tech', 24300.00, 'credit', 'Customer Payment', true),
  (bank_account_id, '2024-03-05', 'Customer Payment - Innovate Solutions', 19440.00, 'credit', 'Customer Payment', true),
  (bank_account_id, '2024-04-20', 'Customer Payment - Enterprise Systems', 37800.00, 'credit', 'Customer Payment', true),
  
  -- Withdrawals (Expenses)
  (bank_account_id, '2024-01-01', 'Office Rent - January', 3000.00, 'debit', 'Rent', true),
  (bank_account_id, '2024-02-01', 'Office Rent - February', 3000.00, 'debit', 'Rent', true),
  (bank_account_id, '2024-03-01', 'Office Rent - March', 3000.00, 'debit', 'Rent', true),
  (bank_account_id, '2024-01-15', 'Utilities', 400.00, 'debit', 'Utilities', true),
  (bank_account_id, '2024-02-15', 'Utilities', 400.00, 'debit', 'Utilities', true),
  (bank_account_id, '2024-03-31', 'Payroll - Q1', 45000.00, 'debit', 'Payroll', true);

-- ============================================================================
-- SECTION 13: JOURNAL ENTRIES (Adjusting Entries)
-- ============================================================================

-- Depreciation Entry
INSERT INTO journal_entries (id, user_id, entry_number, entry_date, description, status)
VALUES 
  (uuid_generate_v4(), demo_user_id, 'JE-2024-001', '2024-12-31', 'Annual Depreciation Expense', 'posted');

-- Get the journal entry ID
DECLARE je_id UUID;
SELECT id INTO je_id FROM journal_entries WHERE entry_number = 'JE-2024-001' AND user_id = demo_user_id;

-- Get account IDs for depreciation
DECLARE depreciation_expense_id UUID;
DECLARE accumulated_depreciation_id UUID;
SELECT id INTO depreciation_expense_id FROM chart_of_accounts WHERE account_number = '5900' AND user_id = demo_user_id;
SELECT id INTO accumulated_depreciation_id FROM chart_of_accounts WHERE account_number = '1600' AND user_id = demo_user_id;

INSERT INTO journal_entry_lines (journal_entry_id, account_id, description, debit_amount, credit_amount)
VALUES 
  (je_id, depreciation_expense_id, 'Depreciation Expense', 5000.00, 0.00),
  (je_id, accumulated_depreciation_id, 'Accumulated Depreciation', 0.00, 5000.00);

-- ============================================================================
-- SECTION 14: ESTIMATES
-- ============================================================================

INSERT INTO estimates (user_id, customer_id, estimate_number, estimate_date, expiration_date, status, subtotal, tax_amount, total_amount)
VALUES 
  (demo_user_id, customer1_id, 'EST-2024-001', '2024-11-15', '2024-12-15', 'sent', 25000.00, 2000.00, 27000.00),
  (demo_user_id, customer3_id, 'EST-2024-002', '2024-11-20', '2024-12-20', 'sent', 18000.00, 1440.00, 19440.00),
  (demo_user_id, customer5_id, 'EST-2024-003', '2024-12-01', '2025-01-01', 'draft', 22000.00, 1760.00, 23760.00);

END $$;

-- ============================================================================
-- DATA SEEDING COMPLETE!
-- ============================================================================
-- Sample data has been populated for TechConsult Solutions LLC
-- Fiscal Year: 2024
-- 
-- Summary:
-- - 5 Customers
-- - 3 Vendors
-- - 5 Products/Services
-- - 15 Invoices (Total: $358,000)
-- - 12 Bills (Total: $30,000+)
-- - 50+ Expense entries
-- - 12 Customer Payments
-- - 3 Bank Accounts
-- - 10+ Bank Transactions
-- - 1 Journal Entry
-- - 3 Estimates
-- 
-- Your accounting reports should now display realistic financial data!
-- ============================================================================
