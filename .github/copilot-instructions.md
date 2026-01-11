# Taxu Platform - AI Agent Instructions

## Project Overview
Taxu is an AI-powered tax & accounting platform with **300+ pages** across 4 integrated systems: Tax Filing, Neobank, Investments, and Accounting. Built with Next.js 16 canary + React 19 (App Router), Supabase (97 tables with RLS), Stripe, and Vercel AI SDK. See `PLATFORM_MANIFEST.md` for complete page inventory.

**Critical versions:**
- Next.js: `16.1.1-canary.1` (uses async request APIs - `cookies()`, `headers()` are now async)
- React: `19.1.0` (breaking changes from v18 - check React 19 migration guide)
- Tailwind CSS: `v4` (PostCSS plugin via `@tailwindcss/postcss`, not standalone CLI)
- Package manager: `npm` (note: `pnpm-lock.yaml` exists but always use `npm` commands)

## Critical Architecture Patterns

### Client/Server Component Split (Strict Convention)
- **Server Components** (default): All pages in `app/*/page.tsx` - use for data fetching, SEO, and initial renders
- **Client Components** (`"use client"`): Interactive UI in `components/*-client.tsx` - **MUST follow `-client.tsx` naming**
- **Naming convention**: `accounting-dashboard-client.tsx`, `banking-dashboard-client.tsx` (never `accounting-dashboard.tsx` for client components)
- **Server actions**: Always in `app/actions/*.ts` with `"use server"` directive at line 1 (see `app/actions/accounting.ts`)
- **Data flow pattern**: Server component fetches → passes props → client component handles interactivity (see `app/accounting/page.tsx` → `components/accounting-dashboard-client.tsx`)

### Database Access Patterns (Critical - Multiple Clients)
```typescript
// Client-side: Use lib/supabase/client.ts
import { createClient } from "@/lib/supabase/client"
const supabase = createClient() // Returns cached singleton instance

// Server-side: Use lib/supabase/server.ts (MUST AWAIT!)
import { createClient } from "@/lib/supabase/server"
const supabase = await createClient() // Async - uses Next.js 15 async cookies()

// Books/Accounting: Separate client with organization context
import { createBooksServerClient } from "@/lib/supabase/books-server"
const supabase = await createBooksServerClient() // Auto-handles org_id filtering
```

**Key patterns:**
- **Singleton caching**: Both clients cache instances - never create multiple times per request
- **Auth check pattern**: Always check user before queries:
  ```typescript
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  ```
- **v0 Preview Mode**: Code can run without env vars for demos. All Supabase calls check for null client:
  ```typescript
  const supabase = await createClient()
  if (!supabase) return null // or return demo data
  ```
  Functions like `createClientSafe()` handle this pattern automatically.
- **Multi-tenancy**: 97 tables use `user_id` + `organization_id`/`org_id` with RLS policies
- **Organization context**: API routes use `getOrganizationContext()` from `lib/organization/context` (see `app/api/accounting/invoices/route.ts`)
- **RLS enabled on all tables** - queries auto-filter by user/org without explicit WHERE clauses

### Shadcn/UI Component System
- Components in `components/ui/` from shadcn/ui (Radix UI + Tailwind)
- Config: `components.json` defines aliases and styling
- Import path: `@/components/ui/{component}`
- Use `cn()` utility from `@/lib/utils.ts` for className merging
- Style: "new-york" variant with CSS variables enabled

## Development Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build (checks types)
npm run lint             # ESLint validation
npm test                 # Jest unit tests (watch mode)
npm run test:ci          # CI mode tests
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:ui      # Playwright UI mode
npm run test:performance # Lighthouse benchmarks
```

**Testing conventions:**
- Unit tests: `__tests__/unit/` using Jest + `@testing-library/react`
- Integration: `__tests__/integration/` with mocked Supabase responses
- E2E: `__tests__/e2e/` using Playwright for critical paths (baseURL: `http://localhost:3000`)
- Path aliases work in tests: `@/` maps to root (`tsconfig.json` + `jest.config.js`)
- Coverage: `npm run test:coverage` generates report in `coverage/` directory

## Database Conventions

### Schema Organization (97 tables)
- **Tax System**: `documents`, `w2_data`, `tax_forms`, `tax_calculations`, `filings`
- **Accounting**: `invoices`, `bills`, `expenses`, `customers`, `vendors`, `payments`
- **Banking**: `bank_accounts`, `transactions`, `reconciliation`
- **Organization**: `organizations`, `organization_members` (multi-tenant support)
- **Neobank**: Full neobank schema with accounts, cards, transactions

### Security & Performance
- All tables have Row Level Security (RLS) enabled
- User data isolation: `user_id` column + RLS policies
- Organization data: Additional `organization_id` for multi-tenant
- 50+ indexes for query optimization (see `scripts/999_performance_optimization.sql`)
- Use prepared statements via Supabase client (auto-handled)

### Migration Scripts
Located in `scripts/` directory:
- **Execution Guide**: See `SCRIPTS_TO_RUN.md` for prioritized execution order (100+ scripts organized by priority)
- **Numbering**: Sequential (`001_`, `002_`, etc.) - check existing numbers before adding new
- **Production-ready**: `scripts/production/` contains tested, deployment-ready migrations (7 core schemas)
- **Critical Scripts**: Fix infinite recursion in RLS, OAuth triggers, organization schema - see SCRIPTS_TO_RUN.md
- **Execution**: Run via Supabase dashboard SQL editor or `psql` 
- **Structure**: Core schemas: `001_core_user_org_schema.sql`, `002_accounting_schema.sql`, `003_neobank_schema.sql`, etc.
- **Testing**: Always test on staging/local before production - RLS policies can break existing queries

## API Route Patterns

```typescript
// app/api/[feature]/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Your logic here
  return NextResponse.json({ data })
}
```

### Authentication Checks
- API routes: `await supabase.auth.getUser()` - check for `user`
- Pages: Auth happens in server components, redirect if no session
- Protected routes: Check user before database queries

## Path Aliases
```typescript
// Configured in tsconfig.json
"@/*" = "./*"
// Examples:
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
```

## Environment Variables
- Validation in `lib/env-validation.ts` using Zod
- Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Optional integrations: Stripe, Plaid, TaxBandits, OpenAI, Resend
- Prefix `NEXT_PUBLIC_` for client-side access
- Use `process.env.VARIABLE_NAME` - validated on app start

## AI Features
- Vercel AI SDK integration (`@ai-sdk/react`, `@ai-sdk/openai`)
- AI-powered document processing in `lib/ml/`
- Tax optimization: `lib/tax-strategy-analyzer.ts`
- Chat widget: `components/taxu-chat-widget.tsx`
- Deduction maximizer: `lib/deduction-maximizer.ts`

## Key Libraries & Integrations
- **Styling**: Tailwind CSS v4 (PostCSS plugin), `class-variance-authority` for variants
- **Forms**: `react-hook-form` + `@hookform/resolvers` + `zod` validation
- **Date**: `date-fns` for date manipulation, `react-day-picker` for calendars
- **Charts**: `recharts` for analytics dashboards
- **Payments**: Stripe SDK (`stripe` package) - see `lib/stripe.ts`
- **File Upload**: `react-dropzone` + AWS S3 (`@aws-sdk/client-s3`)
- **PDF**: `jspdf` for PDF generation
- **Banking**: Plaid integration (`react-plaid-link`)

## Common Patterns

### Metadata for SEO
```typescript
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Page Title - Taxu",
  description: "Page description",
}
```

### Error Handling
- Use error boundaries: `components/error-boundary.tsx`
- API errors: Return proper status codes with `NextResponse.json()`
- Display user-friendly errors via `sonner` toast notifications

### Data Fetching
- Server components: Direct Supabase queries (no loading states needed)
- Client components: Use React hooks with `useState`/`useEffect` or SWR pattern
- Real-time: Supabase Realtime channels for live updates

## Special Considerations
- **v0 Preview Mode**: Code handles missing env vars gracefully (demo mode)
- **PWA Support**: Manifest at `/manifest.json`, install prompt component
- **Mobile**: Responsive design required, `components/mobile-navigation.tsx`
- **Analytics**: Vercel Analytics integrated, custom analytics in `lib/database/analytics.ts`
- **Security Headers**: Configured in `next.config.mjs` (CSP, XSS protection)

## When Making Changes
1. **Database changes**: Create migration in `scripts/` following numbering convention
2. **New features**: Check if shadcn/ui component exists before creating custom UI
3. **Server actions**: Place in `app/actions/` with `"use server"` directive
4. **API routes**: Follow auth pattern (check user first)
5. **Types**: Prefer TypeScript inference; add explicit types for public APIs
6. **Testing**: Add unit tests for utils, E2E for critical flows

## Debugging
- **Database**: Check Supabase dashboard → Table Editor & Logs
  - Look for `[v0]` prefixed console logs - these indicate internal debugging messages
- **Common Issues**: See `SCRIPTS_TO_RUN.md` for known issues:
  - Infinite recursion in `org_members` RLS policy → Run `scripts/fix-org-members-rls-policy.sql`
  - OAuth trigger bugs → Run `scripts/017_fix_oauth_trigger.sql`
  - Missing organization functions → Run `scripts/017_create_get_user_organizations_function.sql`
- **Deployment**: Vercel dashboard for build logs
- **Runtime**: v0 debug logs (if in v0) or browser console
- **Network**: Use browser DevTools Network tab for API debugging
- **RLS Policies**: Test queries with different users to verify RLS is working correctly
  - Use `EXPLAIN ANALYZE` in SQL editor to debug slow queries
  - Check `scripts/999_performance_optimization.sql` for index strategies
