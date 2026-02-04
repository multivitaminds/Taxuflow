# Deployment Synchronization Guide

This document explains how to synchronize code between v0, GitHub, Vercel, and taxu.io.

## Architecture

```
v0.app (Design & Development)
    ↓ (Push via "Create Branch" button)
GitHub: multivitaminds/v0-taxu-landing-page
    ↓ (Auto-deploy on push to main)
Vercel (Build & Deploy)
    ↓ (Serves on custom domain)
taxu.io (Production Site)
```

## Repositories

- **Primary Repo**: `https://github.com/multivitaminds/v0-taxu-landing-page`
- **Owner**: multivitaminds (personal account)
- **Email**: taxu-infra@gmail.com
- **Default Branch**: `main`

## Setup Instructions

### 1. v0 → GitHub Sync

When you're in v0 and see "needs a branch to continue":

1. Click the **"Create Branch"** button in v0
2. v0 will create a new branch with your latest changes
3. Review the changes in the branch
4. Merge the branch to `main` via GitHub PR

**Alternative**: v0 can also push directly to `main` if configured

### 2. GitHub → Vercel Auto-Deploy

Vercel is configured to automatically deploy when code is pushed to the `main` branch:

- **Project**: v0-taxu-landing-page
- **Framework**: Next.js 16.1.1
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Domain**: taxu.io

### 3. Verify Deployment

After pushing to GitHub:

1. Check deployment status:
   ```bash
   vercel ls v0-taxu-landing-page --scope multivitaminds-5942s-projects
   ```

2. Visit the production URL:
   ```
   https://taxu.io
   ```

## Manual Deployment (If Needed)

If auto-deploy doesn't trigger or you need to manually deploy:

```bash
cd ~/taxu-platform/v0-taxu-landing-page
vercel --prod --yes
```

## Common Workflows

### Workflow 1: Update from v0
1. Make changes in v0
2. Click "Create Branch" when prompted
3. v0 creates a branch in GitHub
4. Create a PR and merge to main
5. Vercel auto-deploys to taxu.io

### Workflow 2: Update from Local
1. Make changes locally
2. Commit: `git commit -m "description"`
3. Push: `git push origin main`
4. Vercel auto-deploys to taxu.io

### Workflow 3: Sync v0 with Existing Code
1. In v0, click "Create Branch"
2. v0 will show differences
3. Review and merge changes
4. Vercel auto-deploys

## Environment Variables

Required environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL` (should be https://taxu.io)

## Troubleshooting

### v0 Can't Create Branch
- Verify v0 has access to the GitHub repo
- Check that multivitaminds account is connected in v0 settings

### Vercel Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure package.json dependencies are correct

### Domain Not Working
- Verify taxu.io DNS points to Vercel
- Check domain configuration in Vercel dashboard
- Clear browser cache

## Current Status (as of Feb 4, 2026)

- ✅ GitHub repo: `multivitaminds/v0-taxu-landing-page` (active)
- ✅ Vercel project: `v0-taxu-landing-page` (connected)
- ✅ Domain: `taxu.io` (configured)
- ⏳ v0 integration: Ready to sync (click "Create Branch")

## Next Steps

1. In v0, click the "Create Branch" button
2. This will sync your latest v0 changes to GitHub
3. Merge the branch to main
4. Vercel will automatically deploy to taxu.io

---

**Co-Authored-By**: Warp <agent@warp.dev>
