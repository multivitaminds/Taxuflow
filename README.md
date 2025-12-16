# Taxu - AI-Powered Tax & Accounting Platform

A comprehensive business operating system combining AI-powered tax filing with full accounting capabilities.

## Features

### Tax Filing
- AI-powered document processing
- W-2 data extraction
- Automated tax calculations
- Refund estimates and optimization
- Filing status tracking

### Accounting System
- Double-entry bookkeeping
- Invoicing and billing
- Expense tracking
- Customer and vendor management
- Bank reconciliation
- Financial reporting (P&L, Balance Sheet, Cash Flow)
- Chart of accounts
- Payment processing

### Advanced Features
- Time tracking system
- Project management
- Custom fields API
- Sales tax engine with multi-jurisdiction support
- Desktop sync capabilities
- Real-time analytics dashboard

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **AI**: Vercel AI SDK
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (already connected)
- Vercel account for deployment

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables are already configured in v0

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Deploy to Production

**Option 1: Deploy from v0 (Recommended)**
1. Click the "Publish" button in v0
2. Select your Vercel account
3. Done! Your app will be live in ~2 minutes

**Option 2: Deploy from GitHub**
1. Push code to GitHub
2. Import in Vercel dashboard
3. Add environment variables
4. Deploy

## Database Setup

Run the production setup script to enable security and optimize performance:

1. Go to Scripts folder in v0
2. Run `000_production_ready_setup.sql`
3. This will:
   - Enable Row Level Security on all tables
   - Create performance indexes
   - Set up access policies
   - Optimize queries

## Project Structure

```
taxu/
├── app/                    # Next.js app directory
│   ├── dashboard/         # User dashboard
│   ├── accounting/        # Accounting features
│   ├── api/              # API routes
│   └── ...               # Other pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Helper functions
├── scripts/              # Database migration scripts
└── public/               # Static assets
```

## Environment Variables

Required environment variables (already configured in v0):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

## Database Schema

The platform includes 97 tables organized into:

- **Tax System**: Documents, W-2 data, tax forms, calculations, filings
- **Accounting**: Invoices, bills, expenses, customers, vendors, payments
- **Banking**: Bank accounts, transactions, reconciliation
- **Projects**: Time tracking, project management, tasks
- **Advanced**: Custom fields, sales tax, sync capabilities
- **AI**: Agent activities, insights, learning events

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure authentication with Supabase Auth
- API routes protected with middleware
- Environment variables encrypted

## Performance

- 50+ database indexes for fast queries
- Optimized query plans
- Server-side rendering where appropriate
- Image optimization
- Code splitting and lazy loading

## API Documentation

API documentation is available at `/api-docs` with:
- REST API endpoints
- Authentication guide
- Rate limiting information
- Example requests/responses

## Support

For issues or questions:
- Check Supabase dashboard for database logs
- Check Vercel dashboard for deployment logs
- Review v0 debug logs for runtime errors

## License

Proprietary - All rights reserved

## Deployment Status

- Database: Connected (97 tables)
- Authentication: Configured
- Payments: Stripe integrated
- Security: RLS enabled
- Performance: Optimized with indexes
- Status: Production Ready ✅
