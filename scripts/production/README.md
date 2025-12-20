# Production Database Schema Setup Guide

This folder contains production-ready SQL migration scripts for both the Accounting Platform and Neobank Platform.

## Setup Order

Run the scripts in this exact order:

1. **001_core_user_org_schema.sql** - Core user profiles, organizations, and audit logging
2. **002_accounting_schema.sql** - Complete accounting system tables (invoices, bills, expenses, journal entries)
3. **003_neobank_schema.sql** - Neobank accounts, transactions, cards, budgets, investments, loans
4. **004_tax_filing_schema.sql** - Tax filing tables (W2, 1099, 941 forms)
5. **005_ai_analytics_schema.sql** - AI processing, insights, analytics, and performance metrics
6. **006_relationships_functions.sql** - Utility functions and triggers

## Running Scripts in Supabase

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each script in order
4. Click **Run** for each script
5. Verify no errors appear

### Option 2: Using v0 (Already Connected)

Since your Supabase integration is already connected in v0, you can run scripts directly from the scripts folder. v0 will execute them automatically.

### Option 3: Command Line

\`\`\`bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
psql $POSTGRES_URL < scripts/production/001_core_user_org_schema.sql
psql $POSTGRES_URL < scripts/production/002_accounting_schema.sql
# ... continue for all scripts
\`\`\`

## What Gets Created

### 182 Total Tables Across:

**Core System (7 tables)**
- user_profiles, organizations, org_members, audit_logs

**Accounting Platform (50+ tables)**
- accounts, contacts, invoices, bills, expenses, journal_entries, payments
- bank_accounts, reconciliations, recurring_transactions
- employees, payroll, time_tracking, projects

**Neobank Platform (40+ tables)**
- neobank_accounts, neobank_transactions, neobank_cards
- budgets, savings_goals, investment_portfolios, investment_holdings
- loans, credit_scores, subscriptions, bill_payments

**Tax Filing (20+ tables)**
- tax_filings, w2_forms, form_1099, form_941
- tax_documents, tax_calculations

**AI & Analytics (15+ tables)**
- ai_processing_jobs, ai_insights, analytics_events
- performance_metrics, fraud_detection_log

**Enterprise Features (50+ tables)**
- Multi-tenant data isolation
- SSO/SAML configurations
- Compliance tracking
- Custom branding

## Features Included

✅ **Row Level Security (RLS)** - All tables have proper RLS policies
✅ **Indexes** - Optimized indexes on frequently queried columns
✅ **Foreign Keys** - Proper relationships between tables
✅ **Triggers** - Automatic updated_at timestamps and audit logging
✅ **Functions** - Utility functions for balance calculations
✅ **Constraints** - Check constraints for data validation

## Environment Variables Required

Make sure these are set in your Vercel project:

\`\`\`
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
POSTGRES_URL=your-direct-connection-string
\`\`\`

## Verification

After running all scripts, verify with:

\`\`\`sql
-- Check table count
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';
\`\`\`

## Support

If you encounter any issues:
1. Check the Supabase logs for error messages
2. Verify all environment variables are set
3. Ensure your Supabase project has sufficient resources
4. Contact support at vercel.com/help
