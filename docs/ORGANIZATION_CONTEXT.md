# Organization Context & Multi-Tenant Support

## Overview

Taxu supports both **personal data** (public schema) and **organization data** (books schema) in a multi-tenant architecture. Users can access:
- Their personal accounting data (invoices, bills, customers in `public` schema)
- Organization data they're members of (via `books.org_members` table)

## Architecture

### Schemas

1. **Public Schema** - Personal user data
   - `invoices`, `bills`, `customers`, `vendors`, etc.
   - Scoped by `user_id`
   - Each user owns their own data

2. **Books Schema** - Organization data
   - `books.invoices`, `books.bills`, `books.contacts`, etc.
   - Scoped by `org_id` 
   - Multiple users can access same organization data via `books.org_members`

### Organization Membership

Users are assigned to organizations through the `books.org_members` table:

```sql
-- books.org_members structure
user_id   | org_id    | role      | created_at
----------|-----------|-----------|------------
uuid      | uuid      | text      | timestamp
```

## Usage

### Getting Organization Context

```typescript
import { getOrganizationContext } from "@/lib/organization"

const orgContext = await getOrganizationContext()

if (orgContext) {
  console.log("User ID:", orgContext.userId)
  console.log("Primary Org:", orgContext.organizationId)
  console.log("All Orgs:", orgContext.organizationIds)
  console.log("Has Org Access:", orgContext.hasOrganizationAccess)
}
```

### Fetching Books Schema Data

```typescript
import { fetchBooksData } from "@/lib/organization"

// Fetch invoices from books schema
const { data: invoices, error } = await fetchBooksData(
  "invoices", // books.invoices table
  orgContext,
  {
    select: "*, contacts!customer_id(company_name, email)",
    orderBy: { column: "created_at", ascending: false },
    limit: 50
  }
)
```

### Combining Personal & Organization Data

```typescript
import { fetchCombinedData } from "@/lib/organization"

// Fetch both personal customers and org contacts
const { personalData, orgData, combined, error } = await fetchCombinedData({
  publicTable: "customers",
  booksTable: "contacts", 
  orgContext,
  select: "id, company_name, email, phone",
  orderBy: { column: "created_at", ascending: false }
})

console.log("Personal customers:", personalData?.length)
console.log("Org contacts:", orgData?.length)
console.log("Combined total:", combined.length)
```

## Current Implementation Status

### ✅ Implemented
- Organization context utilities (`lib/organization/`)
- Books schema RLS policies (Script 2 executed)
- Organization membership table (`books.org_members`)
- Multi-tenant data access control

### ⚠️ Needs Implementation
- API routes currently use `createBooksServerClient()` which connects to books schema
- APIs like `/api/accounting/customers` and `/api/accounting/invoices` only fetch books data
- Need to update APIs to support combined personal + org data fetching
- Need UI to display data source (personal vs organization)
- Need organization switcher in dashboard

## Migration Guide

### For Existing API Routes

**Before (Books schema only):**
```typescript
const supabase = await createBooksServerClient()
const { data } = await supabase.from("contacts").select("*")
```

**After (Combined approach):**
```typescript
const orgContext = await getOrganizationContext()

if (!orgContext) {
  return NextResponse.json({ error: "No access" }, { status: 403 })
}

const { combined } = await fetchCombinedData({
  publicTable: "customers",
  booksTable: "contacts",
  orgContext,
  select: "*"
})

return NextResponse.json({ 
  data: combined,
  context: {
    hasOrganizationAccess: orgContext.hasOrganizationAccess,
    organizationCount: orgContext.organizationIds.length
  }
})
```

## Database Schema

### Key Tables

```sql
-- Organization membership
books.org_members (
  user_id uuid REFERENCES auth.users,
  org_id uuid REFERENCES books.organizations,
  role text,
  created_at timestamp
)

-- Organizations
books.organizations (
  id uuid PRIMARY KEY,
  name text,
  slug text,
  billing_email text,
  plan_type text,
  is_active boolean,
  features jsonb
)

-- Example books data table
books.invoices (
  id uuid PRIMARY KEY,
  org_id uuid REFERENCES books.organizations,
  contact_id uuid REFERENCES books.contacts,
  total numeric,
  status text
)
```

### RLS Policies

All books schema tables have RLS policies that check membership:

```sql
CREATE POLICY "Users can view org invoices"
ON books.invoices
FOR SELECT
TO authenticated
USING (org_id IN (
  SELECT org_id FROM books.org_members WHERE user_id = auth.uid()
));
```

## Next Steps

1. Update `/api/accounting/customers` to use `fetchCombinedData()`
2. Update `/api/accounting/invoices` to use `fetchCombinedData()`
3. Add organization selector to dashboard UI
4. Add visual indicators showing data source (personal vs org)
5. Create organization management pages
6. Add organization invitation system
