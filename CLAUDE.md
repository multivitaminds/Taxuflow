# CLAUDE.md - Taxuflow

## Project Overview

Taxuflow (branded as "Taxu") is an AI-powered tax filing and accounting SaaS platform. It handles individual tax filing (W-2, 1040), business tax filing (1120, 1120-S, 1065, 941), full double-entry accounting, invoicing, expense tracking, and integrations with financial services.

## Tech Stack

- **Framework:** Next.js 15 (App Router) with React 19
- **Language:** TypeScript (strict mode)
- **Database/Auth:** Supabase (PostgreSQL with Row Level Security)
- **Payments:** Stripe
- **UI:** Tailwind CSS v4, shadcn/ui (New York style), Radix UI, Lucide icons
- **AI:** Vercel AI SDK + OpenAI
- **Integrations:** TaxBandits (e-filing), Plaid (banking), QuickBooks, AWS S3
- **Forms:** React Hook Form + Zod validation
- **Email:** React Email + Resend

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build (TS and ESLint errors are ignored in config)
- `npm run lint` — Run ESLint
- `npm start` — Start production server

## Project Structure

```
app/              → Next.js App Router pages and API routes
  api/            → 39+ API route groups
  accounting/     → Accounting system pages
  dashboard/      → User dashboard
  filing/         → Tax filing interfaces
  admin/          → Admin dashboard
  auth/           → Authentication flows
components/       → React components (140+ files)
  ui/             → shadcn/ui primitives
lib/              → Utilities and services
  supabase/       → Supabase client factories (server.ts, client.ts, middleware.ts)
  efile/          → TaxBandits e-filing integration
  ai/             → AI/LLM configuration
  database/       → Database utilities
  email/          → Email templates (React Email + Resend)
  organization/   → Multi-org management
hooks/            → Custom React hooks
scripts/          → Database migration SQL scripts
public/           → Static assets
styles/           → Global CSS
```

## Code Conventions

### File and Component Naming
- **Files:** kebab-case (`accounting-sidebar.tsx`, `auth-button.tsx`)
- **Components:** PascalCase named exports (`export function AuthButton()`)
- **Client component files:** suffix with `-client` (`billing-client.tsx`, `chart-of-accounts-client.tsx`)
- **No default exports** on components; use named exports. Pages use `export default`.

### Imports (path alias: `@/*` maps to project root)
```typescript
"use client"                                    // directive first (if needed)

import Link from "next/link"                    // Next.js core
import { Card } from "@/components/ui/card"     // UI components
import { DollarSign } from "lucide-react"       // Icons
import { useEffect, useState } from "react"     // React hooks
import type { User } from "@supabase/ssr"       // Type imports
import { createClient } from "@/lib/supabase/server"  // Custom lib
import { MyComponent } from "@/components/my-component" // Custom components
```

### Server vs Client Components
- **Server components** (default): async functions, direct Supabase queries, no `"use client"`
- **Client components:** `"use client"` directive at top, use hooks (`useState`, `useEffect`, `useRouter`)
- **Pattern:** Server page fetches data, passes to `-client` component for interactivity

```typescript
// app/some-page/page.tsx (server)
export default async function SomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return <SomeClient user={user} data={data} />
}
```

### API Routes
- Export named HTTP methods: `export async function GET()`, `export async function POST(request: NextRequest)`
- Return `NextResponse.json()` with appropriate status codes
- Wrap in try/catch with `console.error("[v0] Error context:", error)`

### Supabase Usage
- **Server:** `import { createClient } from "@/lib/supabase/server"` — async, uses cookies
- **Client:** `import { createClient } from "@/lib/supabase/client"` or `getSupabaseBrowserClient()`
- **Books:** `import { createBooksServerClient } from "@/lib/supabase/books-server"`
- **Middleware:** `import { updateSession } from "@/lib/supabase/middleware"`
- Error handling via `lib/supabase/error-handler.ts` (maps PostgreSQL error codes)

### Logging
- Prefix logs with `[v0]`: `console.error("[v0] Error fetching customers:", error)`

### Styling
- Use the `cn()` utility from `@/lib/utils` for combining Tailwind classes
- CSS variables defined in `app/globals.css` (`:root` and `.dark`)
- Stripe-inspired palette: primary `#635bff`, accent `#00d4ff`, destructive `#df1b41`

### Environment Variables
- Client-accessible: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-only: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, etc.
- Never commit `.env.local`

## Database

- 97 tables with Row Level Security (RLS) enabled on all tables
- 50+ performance indexes
- Migration scripts in `/scripts`
- Key domains: tax system, accounting, banking, projects, AI agents

## Key Patterns

- **Auth guard:** Check `supabase.auth.getUser()` → `redirect("/login")` if no user
- **Org context:** Use `getOrganizationContext()` in API routes for multi-tenant isolation
- **Forms:** React Hook Form + Zod schema → shadcn Form components
- **Toasts:** `sonner` library for notifications
- **Theme:** `next-themes` for dark mode support
