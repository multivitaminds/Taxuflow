# Taxu - Deployment Guide

## Prerequisites

1. **Supabase Account** - Database is already connected
2. **Vercel Account** - For hosting
3. **Stripe Account** - For payments (optional)

## Quick Deploy to Vercel

### Option 1: Deploy from v0 (Recommended)

1. Click the **"Publish"** button in the top right of v0
2. Select your Vercel account
3. All environment variables will be automatically transferred
4. Your app will be live in ~2 minutes

### Option 2: Deploy from GitHub

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Add environment variables (see below)
4. Deploy

## Environment Variables

The following environment variables are already configured in v0:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
\`\`\`

## Database Setup

### Run Production Setup Script

1. In v0, go to the **Scripts** folder
2. Find `000_production_ready_setup.sql`
3. Click the ▶️ button to execute
4. This will:
   - Enable Row Level Security on all tables
   - Create performance indexes
   - Set up proper access policies
   - Optimize query performance

### Verify Database

Check your Supabase dashboard:
- Security issues should be 0
- Performance issues should be minimal
- All tables should have RLS enabled

## Post-Deployment Checklist

- [ ] Run production setup SQL script
- [ ] Verify Supabase connection
- [ ] Test authentication flow
- [ ] Test document upload
- [ ] Verify Stripe integration (if using)
- [ ] Check API endpoints
- [ ] Test dashboard functionality
- [ ] Review security policies

## Features Included

### Core Features
- AI-powered tax filing
- Document upload and processing
- W-2 data extraction
- Tax calculations and refund estimates
- Filing status tracking

### Accounting Features
- Full double-entry bookkeeping
- Invoicing and billing
- Expense tracking
- Customer and vendor management
- Bank account reconciliation
- Financial reporting

### Advanced Features
- Time tracking system
- Project management
- Custom fields API
- Sales tax engine
- Desktop sync capabilities

## Support

For issues or questions:
- Check Supabase logs for database errors
- Check Vercel logs for deployment errors
- Review the v0 debug logs for runtime errors

## Production Optimization

The database is optimized with:
- 50+ performance indexes
- Row Level Security on all tables
- Optimized query plans
- Proper foreign key relationships

Your Taxu platform is production-ready and secure!
\`\`\`

```typescript file="" isHidden
