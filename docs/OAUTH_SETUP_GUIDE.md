# Google OAuth Setup Guide for Taxu

This guide will help you configure Google OAuth authentication for your Taxu application.

## Prerequisites

- Access to your Vercel project settings
- Access to your Supabase project dashboard
- A Google Cloud Platform account

## Step 1: Configure Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Taxu project
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variable:
   - **Key**: `NEXT_PUBLIC_APP_URL`
   - **Value**: `https://taxu.io`
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**
6. Redeploy your application

## Step 2: Configure Supabase Redirect URLs

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Taxu project
3. Navigate to **Authentication** → **URL Configuration**
4. Set **Site URL** to: `https://taxu.io`
5. Add the following **Redirect URLs**:
   ```
   https://taxu.io/auth/callback
   https://admin.taxu.io/auth/callback
   https://developer.taxu.io/auth/callback
   http://localhost:3000/auth/callback
   ```
6. Click **Save**

## Step 3: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Configure the consent screen:
   - **User Type**: External
   - **App name**: Taxu
   - **User support email**: taxu.com@gmail.com
   - **Developer contact**: taxu.com@gmail.com
   - **Authorized domains**: Add `taxu.io`
5. Click **Save and Continue**

## Step 4: Create OAuth Credentials

1. In Google Cloud Console, navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Application type**: Web application
4. **Name**: Taxu Production
5. Add **Authorized JavaScript origins**:
   ```
   https://taxu.io
   https://admin.taxu.io
   https://developer.taxu.io
   http://localhost:3000
   ```
6. Add **Authorized redirect URIs**:
   ```
   https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   Replace `[YOUR-SUPABASE-PROJECT-REF]` with your actual Supabase project reference (found in your Supabase project URL)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

## Step 5: Configure Google Provider in Supabase

1. Go back to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click to expand
4. Toggle **Enable Sign in with Google** to ON
5. Paste your **Client ID** from Step 4
6. Paste your **Client Secret** from Step 4
7. Click **Save**

## Step 6: Test the OAuth Flow

1. Go to https://taxu.io/signup
2. Click **Continue with Google**
3. You should be redirected to Google's consent screen
4. After authorizing, you should be redirected back to https://taxu.io/auth/callback
5. Then automatically redirected to https://taxu.io/dashboard

## Troubleshooting

### Error: "Database error saving new user"
- Ensure the database trigger script (`scripts/001_setup_user_profiles.sql`) has been run in Supabase SQL Editor
- Check that the `user_profiles` table exists
- Verify RLS policies are enabled

### Error: "redirect_uri_mismatch"
- Double-check that all redirect URIs in Google Cloud Console match exactly
- Ensure the Supabase callback URL is correct
- Make sure there are no trailing slashes

### OAuth redirects to localhost instead of production
- Verify `NEXT_PUBLIC_APP_URL` is set in Vercel environment variables
- Redeploy the application after adding the environment variable
- Clear browser cache and try again

### "Invalid OAuth client" error
- Verify Google OAuth credentials are correctly entered in Supabase
- Check that the Google Cloud project has the OAuth consent screen configured
- Ensure the authorized domains include taxu.io

## Environment Variables Checklist

Make sure these are set in Vercel:

- `NEXT_PUBLIC_APP_URL` = `https://taxu.io`
- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
- `SUPABASE_GOOGLE_CLIENT_ID` = Your Google OAuth Client ID
- `SUPABASE_GOOGLE_CLIENT_SECRET` = Your Google OAuth Client Secret

## Support

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Check Supabase logs in Dashboard → Logs
3. Verify all URLs are using HTTPS (not HTTP) in production
4. Ensure cookies are enabled in the browser
