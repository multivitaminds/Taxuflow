# Database Scripts Execution Guide

## Critical Scripts (Run These Now)

These scripts fix critical production issues and must be executed immediately:

### 1. Fix org_members Infinite Recursion (CRITICAL)
**File:** `scripts/fix-org-members-rls-policy.sql`
**Priority:** IMMEDIATE - Blocks dashboard access
**Issue:** Infinite recursion in org_members RLS policy causing 500 errors
**Impact:** Users cannot access dashboard or organization features

### 2. Fix OAuth User Creation (CRITICAL)
**File:** `scripts/017_fix_oauth_trigger.sql`
**Priority:** IMMEDIATE - Blocks Google OAuth login
**Issue:** User profiles not created properly during OAuth flow
**Impact:** Users cannot sign up/login with Google

### 3. Create Organizations Schema (CRITICAL)
**File:** `scripts/create-organizations-schema.sql`
**Priority:** IMMEDIATE - Required for multi-org support
**Issue:** Organizations table and related schema missing
**Impact:** Cannot create or manage organizations

### 4. Get User Organizations Function (CRITICAL)
**File:** `scripts/017_create_get_user_organizations_function.sql`
**Priority:** IMMEDIATE - Required by API
**Issue:** RPC function missing for fetching user orgs
**Impact:** Dashboard cannot load user's organizations

---

## High Priority Scripts (Run After Critical)

### 5. Create Recipients Table
**File:** `scripts/create-recipients-table.sql`
**Issue:** Recipients/contractors management missing
**Impact:** Cannot file 1099s without recipients

### 6. Create W-2 Filings Table
**File:** `scripts/create-w2-filings-table.sql`
**Issue:** W-2 filing storage missing
**Impact:** Cannot store W-2 filing submissions

### 7. Create 1099-NEC Filings Table
**File:** `scripts/create-1099-nec-filings-table.sql`
**Issue:** 1099-NEC filing storage missing
**Impact:** Cannot store 1099 filing submissions

### 8. Create 941 Enhancement Tables
**File:** `scripts/create-941-enhancement-tables.sql`
**Issue:** Form 941 quarterly filing tables missing
**Impact:** Cannot file quarterly payroll taxes

### 9. Create W-9 Tables
**File:** `scripts/create-w9-tables.sql`
**Issue:** W-9 collection and storage missing
**Impact:** Cannot collect W-9s from contractors

### 10. Create Neobank Schema
**File:** `scripts/create_neobank_schema.sql`
**Issue:** Banking features tables missing
**Impact:** Neobank features don't persist data

---

## Medium Priority Scripts (Run After High Priority)

### 11. Setup API Keys
**File:** `scripts/setup-api-keys.sql`
**Issue:** Developer API key management missing
**Impact:** Cannot issue API keys to developers

### 12. Create Security Logs Table
**File:** `scripts/create-security-logs-table.sql`
**Issue:** Security audit trail missing
**Impact:** Cannot track security events

### 13. Create OAuth States Table
**File:** `scripts/create-oauth-states-table.sql`
**Issue:** OAuth state management missing
**Impact:** OAuth flow may be vulnerable to CSRF

### 14. Setup Email Notifications
**File:** `scripts/setup-email-notifications.sql`
**Issue:** Email notification queue missing
**Impact:** Cannot send transactional emails

### 15. Add Password Update Function
**File:** `scripts/add-password-update-function.sql`
**Issue:** User cannot change password
**Impact:** Account management incomplete

### 16. Add Stripe Fields
**File:** `scripts/add-stripe-fields.sql`
**Issue:** Stripe customer/subscription tracking missing
**Impact:** Cannot track payments properly

---

## Low Priority / Optimization Scripts

### 17. Performance Optimization
**File:** `scripts/999_performance_optimization.sql`
**Issue:** Database lacks indexes and optimizations
**Impact:** Slow queries as data grows

### 18. Setup Accounting Tables
**File:** `scripts/setup-accounting-tables.sql`
**Issue:** Full accounting system tables
**Impact:** Advanced accounting features missing

---

## How to Execute Scripts

### In v0 (Recommended)
Scripts are automatically available in the v0 interface. Simply:
1. Navigate to the Scripts panel in v0
2. Click on the script file
3. Click "Run Script"
4. Verify success message

### Manual Execution (If needed)
If you need to run scripts manually in Supabase:
1. Go to Supabase Dashboard → SQL Editor
2. Copy the script content
3. Click "Run"
4. Verify no errors

---

## Execution Order Summary

**CRITICAL (Run Now):**
1. `fix-org-members-rls-policy.sql`
2. `017_fix_oauth_trigger.sql`
3. `create-organizations-schema.sql`
4. `017_create_get_user_organizations_function.sql`

**HIGH PRIORITY (Run Next):**
5-10. Recipients, W-2, 1099, 941, W-9, Neobank tables

**MEDIUM PRIORITY:**
11-16. API keys, security logs, OAuth states, emails, password, Stripe

**LOW PRIORITY:**
17-18. Performance optimizations

---

## Post-Execution Verification

After running critical scripts, verify:
- [ ] Dashboard loads without 500 errors
- [ ] Can view organizations in dropdown
- [ ] Google OAuth login works
- [ ] Can navigate to filing pages
- [ ] No console errors on key pages
