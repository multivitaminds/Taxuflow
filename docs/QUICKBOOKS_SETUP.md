# QuickBooks Integration Setup

This document outlines the environment variables and setup required for QuickBooks OAuth integration.

## Environment Variables

Add these to your Vercel project environment variables:

### QuickBooks OAuth Credentials

```env
# QuickBooks Client ID (from Intuit Developer Portal)
QBO_CLIENT_ID=ABX0LRq0T2Kqc6VdFrWxOC22YKnqxF1YTLjCWxvqZpzGKCQZoV

# QuickBooks Client Secret (from Intuit Developer Portal)
QBO_CLIENT_SECRET=yQFf8gWwPQCZvgHd7i8tL4cU6RjyT1cJqZ9oBGrP

# QuickBooks OAuth Redirect URI (must match what's configured in Intuit Developer Portal)
QBO_REDIRECT_URI=https://taxu.io/integrations/quickbooks/callback

# QuickBooks Environment (sandbox or production)
QBO_ENVIRONMENT=sandbox
```

### Application Base URL

```env
# Base URL for your application (used for OAuth redirects)
NEXT_PUBLIC_APP_URL=https://taxu.io
```

## QuickBooks Developer Portal Configuration

1. Go to https://developer.intuit.com/app/developer/dashboard
2. Select your app or create a new one
3. Navigate to "Keys & OAuth"
4. Add redirect URI: `https://taxu.io/integrations/quickbooks/callback`
5. Copy your Client ID and Client Secret

## OAuth Flow

1. User clicks "Connect QuickBooks" button
2. App redirects to `/api/books/qbo/connect`
3. User authorizes on QuickBooks OAuth page
4. QuickBooks redirects back to `/integrations/quickbooks/callback`
5. App exchanges authorization code for access/refresh tokens
6. Tokens are encrypted and stored in `qbo_connections` table

## API Endpoints

- **Connect**: `/api/books/qbo/connect` - Initiates OAuth flow
- **Callback**: `/integrations/quickbooks/callback` - Handles OAuth callback
- **Sync**: `/api/books/qbo/sync` - Syncs data from QuickBooks
- **Status**: `/api/quickbooks/sync-status` - Check connection status

## Database Schema

The `qbo_connections` table stores encrypted QuickBooks tokens:

```sql
CREATE TABLE qbo_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  realm_id TEXT NOT NULL,
  access_token TEXT NOT NULL,  -- Encrypted
  refresh_token TEXT NOT NULL, -- Encrypted
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, realm_id)
);
```

## Testing in Sandbox

The sandbox environment uses test QuickBooks companies. To test:

1. Ensure `QBO_ENVIRONMENT=sandbox`
2. Use sandbox credentials from Intuit Developer Portal
3. Connect a test QuickBooks company
4. Sync test data

## Security Notes

- All OAuth tokens are encrypted before storage using AES-256-GCM
- Tokens are automatically refreshed when expired
- Never commit credentials to version control
- Use environment variables for all sensitive data
