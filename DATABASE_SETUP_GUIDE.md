# Complete Database Setup Guide

This guide provides the complete list of scripts needed to set up the Taxu database with full support for adding new entries across all modules (accounting, neobank, investments, tax filing).

## Execution Order

### Phase 1: Critical Foundation (MUST RUN FIRST)

These scripts set up the core user, organization, and authentication infrastructure:

#### 1. User Profiles & Authentication
```sql
-- Run in this exact order:
scripts/001_setup_user_profiles.sql
scripts/017_fix_oauth_trigger.sql
scripts/011_simple_auth_setup.sql
scripts/setup-user-profiles-rls.sql
```

#### 2. Organizations Schema
```sql
scripts/create-organizations-schema.sql
scripts/017_create_get_user_organizations_function.sql
scripts/018_create_organization_function.sql
```

#### 3. Fix RLS Infinite Recursion Issues
```sql
-- CRITICAL: Fixes the org_members recursion error
scripts/fix-organization-memberships-rls.sql
scripts/fix-org-members-rls-recursion.sql
scripts/fix-org-rls-infinite-recursion.sql
```

---

### Phase 2: Core Business Modules

#### 4. Accounting Schema
```sql
scripts/004_accounting_schema.sql
scripts/setup-accounting-tables.sql
scripts/add-all-accounting-relationships.sql
scripts/add-invoices-contacts-fk.sql
scripts/add-books-invoices-contacts-fk.sql
scripts/complete-user-relationships.sql
```

#### 5. Neobank Schema
```sql
scripts/create_neobank_schema.sql
scripts/create-wallet-features.sql
scripts/create-neobank-refund-deposits.sql
scripts/add-refund-deposit-automation.sql
```

#### 6. Investment Schema
```sql
scripts/create-investment-schema.sql
scripts/investment/001_investment_analytics_enhancement.sql
scripts/investment/002_investment_ai_recommendations.sql
scripts/investment/003_investment_interactive_features.sql
scripts/seed-investment-demo-data.sql
```

#### 7. Tax Filing Schema
```sql
scripts/setup-tax-filings.sql
scripts/016_add_filing_tables.sql
scripts/create-recipients-table.sql
scripts/create-w2-filings-table.sql
scripts/create-w2-enhancement-tables.sql
scripts/create-1099-nec-filings-table.sql
scripts/create-941-priority-features.sql
scripts/create-941-enhancement-tables.sql
scripts/create-w9-tables.sql
scripts/fix-w9-tables-policies.sql
```

---

### Phase 3: Cross-Module Integration

#### 8. Relationships & Foreign Keys
```sql
scripts/01-create-cross-feature-relationships.sql
scripts/02-add-missing-tables.sql
scripts/04-fix-foreign-key-constraints.sql
scripts/establish-user-table-relationships.sql
scripts/05-verify-all-relationships.sql
```

#### 9. Comprehensive Insert Support (NEW)
```sql
-- This is the main script from this conversation
scripts/100_comprehensive_table_relationships_and_insert_support.sql
```

---

### Phase 4: Security & Access Control

#### 10. RLS Policies
```sql
scripts/03-add-rls-policies-v3.sql
scripts/create-role-based-access.sql
scripts/fix-form-941-policies.sql
```

#### 11. Security & Audit Logging
```sql
scripts/create-security-logs-table.sql
scripts/create-security-events-table.sql
scripts/04-create-fraud-detection-system.sql
```

---

### Phase 5: API & Integrations

#### 12. Developer API
```sql
scripts/setup-api-keys.sql
scripts/create-webhook-infrastructure.sql
scripts/create-webhook-logs-table.sql
```

#### 13. OAuth & External Integrations
```sql
scripts/create-oauth-states-table.sql
scripts/fix-oauth-user-creation.sql
scripts/create-xero-connections-table.sql
scripts/create-synced-data-tables.sql
```

#### 14. Payment Processing
```sql
scripts/add-stripe-fields.sql
```

---

### Phase 6: Features & Enhancements

#### 15. Document Processing
```sql
scripts/fix-document-processing-schema.sql
```

#### 16. Email & Notifications
```sql
scripts/setup-email-notifications.sql
```

#### 17. Duplicate Prevention
```sql
scripts/create-duplicate-filing-check.sql
```

---

### Phase 7: Performance & Optimization

#### 18. Database Optimization
```sql
scripts/database-indexes.sql
scripts/05-add-performance-indexes.sql
scripts/999_performance_optimization.sql
```

#### 19. Admin Functions
```sql
scripts/admin-auth-functions.sql
scripts/setup-admin-system.sql
scripts/add-password-update-function.sql
```

#### 20. Cron Jobs
```sql
scripts/999_refresh_dashboard_cron.sql
```

---

## Quick Start (Minimum Required)

If you need to get started quickly, run these essential scripts in order:

```sql
-- 1. Core User & Auth
scripts/001_setup_user_profiles.sql
scripts/017_fix_oauth_trigger.sql

-- 2. Organizations
scripts/create-organizations-schema.sql
scripts/017_create_get_user_organizations_function.sql

-- 3. Fix RLS Recursion (CRITICAL)
scripts/fix-organization-memberships-rls.sql

-- 4. Core Business Modules
scripts/004_accounting_schema.sql
scripts/create_neobank_schema.sql
scripts/create-investment-schema.sql
scripts/setup-tax-filings.sql

-- 5. Comprehensive Insert Support (NEW)
scripts/100_comprehensive_table_relationships_and_insert_support.sql

-- 6. Basic RLS
scripts/03-add-rls-policies-v3.sql

-- 7. Performance
scripts/999_performance_optimization.sql
```

---

## Verification Checklist

After running all scripts, verify the following:

### Database Structure
- [ ] All tables exist (check with `\dt` in psql or Supabase table view)
- [ ] Foreign keys are properly set up
- [ ] Indexes are created on key columns

### RLS Policies
- [ ] Users can insert their own records
- [ ] Users cannot access other users' data
- [ ] No infinite recursion errors on org_members

### Functions & Triggers
- [ ] `get_user_organizations()` returns user's orgs
- [ ] `bulk_insert_customers()` works
- [ ] `bulk_insert_vendors()` works
- [ ] `bulk_insert_employees()` works
- [ ] OAuth trigger creates user profiles automatically

### Test Data Creation
Try creating sample records:

```sql
-- Test customer creation
INSERT INTO customers (user_id, organization_id, company_name, email)
VALUES (auth.uid(), 'your-org-id', 'Test Company', 'test@example.com');

-- Test neobank account creation
INSERT INTO neobank_accounts (user_id, account_type, nickname)
VALUES (auth.uid(), 'checking', 'My Checking');

-- Test employee creation
INSERT INTO employees (organization_id, first_name, last_name, email)
VALUES ('your-org-id', 'John', 'Doe', 'john@example.com');

-- Test vendor creation
INSERT INTO vendors (user_id, organization_id, vendor_name, email)
VALUES (auth.uid(), 'your-org-id', 'Vendor Inc', 'vendor@example.com');
```

### API Endpoints
- [ ] `/api/developer/collections` works
- [ ] `/api/recipients/[id]` works
- [ ] `/api/webhooks/endpoints/[id]` works
- [ ] Account creation from UI works

### UI Features
- [ ] Dashboard loads without errors
- [ ] Can create accounts in neobank
- [ ] Can add customers/vendors in accounting
- [ ] Can add employees in payroll
- [ ] Can file taxes
- [ ] Can track investments

---

## Troubleshooting

### Common Issues

**1. Foreign Key Constraint Violations**
- Ensure parent records exist before creating child records
- Run: `SELECT * FROM table_relationships_summary;` to see all FK relationships

**2. RLS Policy Blocks Inserts**
- Check if RLS is enabled: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
- Verify policies: `SELECT * FROM pg_policies WHERE tablename = 'your_table';`

**3. Infinite Recursion Errors**
- Re-run: `scripts/fix-organization-memberships-rls.sql`
- Check policy definitions don't reference themselves

**4. Missing Functions**
- Verify function exists: `SELECT * FROM pg_proc WHERE proname = 'function_name';`
- Re-run the script that creates the function

**5. User Not Found in Users Table**
- The `create-account.ts` action now auto-creates users
- Or manually run: `INSERT INTO users (id, email) VALUES (auth.uid(), auth.email());`

---

## Production Deployment

For production deployment, use the consolidated production scripts:

```sql
-- Run in order:
scripts/production/001_core_user_org_schema.sql
scripts/production/002_accounting_schema_fixed.sql
scripts/production/003_neobank_schema.sql
scripts/production/004_tax_filing_schema_fixed.sql
scripts/production/005_ai_analytics_schema_fixed.sql
scripts/production/006_relationships_functions.sql
```

Then run:
```sql
scripts/100_comprehensive_table_relationships_and_insert_support.sql
```

---

## Support

If you encounter issues:
1. Check the `table_relationships_summary` view for FK relationships
2. Review the available bulk insert functions
3. Verify RLS policies are not blocking legitimate operations
4. Check Supabase logs for detailed error messages

---

## Summary

This guide provides the complete database setup for Taxu with:
- Full support for individual and bulk data entry
- Cross-module relationships (accounting ↔ neobank ↔ investments ↔ tax)
- Secure RLS policies for multi-tenant access
- Performance optimizations
- Audit logging and security features
- Developer API support
- OAuth and external integrations

Run the scripts in the order specified above, and you'll have a fully functional database supporting all Taxu features.
