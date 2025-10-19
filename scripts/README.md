# Database Setup Guide

This guide explains how to set up your Supabase database for the Taxu accounting system.

## How to Run Scripts in v0

1. Open the **Scripts** folder in the v0 sidebar
2. Click the **▶ Play button** next to any `.sql` file
3. The script will execute directly in your connected Supabase database
4. Check the output for any errors

## Recommended Execution Order

Run these scripts in order to set up your complete accounting system:

### 1. Core Foundation (Run First)
\`\`\`
✅ create-user-profiles.sql
   - Creates user profiles table with subscription tiers
\`\`\`

### 2. Accounting Core Tables
\`\`\`
✅ 001_accounting_core_tables.sql
   - Chart of accounts, customers, vendors, products
   - Invoices, bills, payments, expenses
   - Core accounting infrastructure
\`\`\`

### 3. Production Ledger System
\`\`\`
✅ 020_books_schema.sql
   - Double-entry bookkeeping system
   - Journal entries and general ledger
   - AR/AP tracking
   - QuickBooks-compatible structure
\`\`\`

### 4. Advanced Features (Optional)
\`\`\`
002_advanced_accounting_features.sql - Bank reconciliation, recurring transactions
021_qbo_parity_tables.sql - Full QuickBooks Online compatibility
030_purchase_orders_system.sql - Purchase order management
031_sales_tax_system.sql - Sales tax tracking
032_credit_memos_system.sql - Credit memo system
006_time_tracking_system.sql - Time tracking for projects
007_project_management_features.sql - Project management
\`\`\`

### 5. Document Processing (If using AI features)
\`\`\`
003_create_documents_table.sql - Document storage
005_create_w2_processing_tables.sql - W2 form processing
006_create_tax_filings_table.sql - Tax filing tracking
010_create_advanced_ai_agent_system.sql - AI agent system
\`\`\`

## What Each Core Script Creates

### 001_accounting_core_tables.sql
- **chart_of_accounts** - Account structure (Assets, Liabilities, Equity, Revenue, Expenses)
- **customers** - Customer management
- **vendors** - Vendor management
- **products_services** - Product/service catalog
- **invoices** & **invoice_items** - Sales invoicing
- **bills** & **bill_items** - Purchase bills
- **payments** - Payment tracking
- **expenses** - Expense management
- **estimates** - Sales estimates/quotes

### 020_books_schema.sql
- **books_chart_of_accounts** - Production-ready COA
- **books_journal_entries** - Double-entry journal system
- **books_accounts_receivable** - AR tracking
- **books_accounts_payable** - AP tracking
- **books_bank_accounts** - Bank account management
- **books_reconciliations** - Bank reconciliation
- Plus 10+ more tables for complete accounting

## Verifying Installation

After running the scripts, verify your tables exist:

1. Go to Supabase Dashboard → Table Editor
2. You should see all the accounting tables listed
3. Check that Row Level Security (RLS) is enabled on all tables

## Support for Reports

These tables support all 17 financial reports:
- ✅ Balance Sheet
- ✅ Profit & Loss Statement
- ✅ Cash Flow Statement
- ✅ AR Aging Summary
- ✅ AP Aging Summary
- ✅ Sales by Customer/Product
- ✅ Expenses by Category/Vendor
- ✅ Invoice/Bill Lists
- ✅ Customer/Vendor Balance Details
- ✅ Trial Balance
- ✅ General Ledger

## Troubleshooting

**Error: "relation already exists"**
- The table already exists in your database
- Safe to ignore or drop the table first if you want to recreate it

**Error: "permission denied"**
- Make sure you're connected to Supabase in v0
- Check that your Supabase service role key is configured

**Error: "column does not exist"**
- Run scripts in the recommended order
- Some scripts depend on tables created by earlier scripts

## Need Help?

If you encounter issues:
1. Check the v0 console for detailed error messages
2. Verify your Supabase connection in the Connect section
3. Ensure environment variables are set correctly
