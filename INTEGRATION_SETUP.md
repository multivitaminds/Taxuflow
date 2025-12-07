# Integration Setup Guide

This document provides instructions for setting up QuickBooks and Xero integrations.

## QuickBooks Online Integration

### Required Environment Variables

Add the following environment variables to your Vercel project or `.env.local` file:

\`\`\`bash
QBO_CLIENT_ID=your_quickbooks_client_id
QBO_CLIENT_SECRET=your_quickbooks_client_secret
QBO_REDIRECT_URI=https://yourdomain.com/api/books/qbo/callback
\`\`\`

### Setup Steps

1. **Create a QuickBooks App**
   - Go to [QuickBooks Developer Portal](https://developer.intuit.com/)
   - Click "Create an app" and select "QuickBooks Online and Payments"
   - Fill in your app details

2. **Get Credentials**
   - Navigate to your app's "Keys & OAuth" section
   - Copy the **Client ID** and **Client Secret**
   - Add them as environment variables

3. **Configure Redirect URI**
   - In your QuickBooks app settings, add the redirect URI:
     - Development: `http://localhost:3000/api/books/qbo/callback`
     - Production: `https://yourdomain.com/api/books/qbo/callback`

4. **Set Scopes**
   - Ensure your app has the `com.intuit.quickbooks.accounting` scope enabled

### Testing the Connection

1. Navigate to `/accounting/settings` in your app
2. Click "Connect" on the QuickBooks card
3. You'll be redirected to QuickBooks to authorize
4. After authorization, you'll be redirected back with connection status

---

## Xero Integration

### Required Environment Variables

Add the following environment variables to your Vercel project or `.env.local` file:

\`\`\`bash
XERO_CLIENT_ID=your_xero_client_id
XERO_CLIENT_SECRET=your_xero_client_secret
XERO_REDIRECT_URI=https://yourdomain.com/api/books/xero/callback
\`\`\`

### Setup Steps

1. **Create a Xero App**
   - Go to [Xero Developer Portal](https://developer.xero.com/myapps)
   - Click "New app" and select "OAuth 2.0"
   - Fill in your app details

2. **Get Credentials**
   - After creating your app, you'll see the **Client ID**
   - Generate a **Client Secret** in the app settings
   - Add them as environment variables

3. **Configure Redirect URI**
   - In your Xero app settings, add the redirect URI:
     - Development: `http://localhost:3000/api/books/xero/callback`
     - Production: `https://yourdomain.com/api/books/xero/callback`

4. **Set Scopes**
   - Enable the following scopes in your Xero app:
     - `accounting.transactions`
     - `accounting.contacts`
     - `accounting.settings`

### Testing the Connection

1. Navigate to `/accounting/settings` in your app
2. Click "Connect" on the Xero card
3. You'll be redirected to Xero to authorize
4. After authorization, you'll be redirected back with connection status

---

## Database Setup

The integration requires database tables to store OAuth credentials:

### QuickBooks Table (Already Created)
- Table: `qbo_connections`
- Stores: user_id, realm_id, access_token, refresh_token, expires_at

### Xero Table (New)
Run the SQL script to create the Xero connections table:
\`\`\`bash
# The script is located at: scripts/create-xero-connections-table.sql
\`\`\`

---

## Security Notes

1. **Token Encryption**: All access tokens and refresh tokens are encrypted using AES-256-GCM before storage
2. **Environment Variables**: Never commit credentials to version control
3. **HTTPS**: Always use HTTPS in production for OAuth callbacks
4. **Token Refresh**: Implement token refresh logic before tokens expire (typically 1 hour for both providers)

---

## Troubleshooting

### QuickBooks Connection Issues

**Error: "QuickBooks integration not configured"**
- Ensure `QBO_CLIENT_ID` and `QBO_CLIENT_SECRET` are set
- Check that environment variables are properly deployed to Vercel

**Error: "Token exchange failed"**
- Verify your Client Secret is correct
- Check that the Redirect URI matches exactly in both your app and QuickBooks settings

### Xero Connection Issues

**Error: "Xero integration not configured"**
- Ensure `XERO_CLIENT_ID` and `XERO_CLIENT_SECRET` are set
- Check that environment variables are properly deployed to Vercel

**Error: "No tenant found"**
- The user may not have any Xero organizations associated with their account
- Ask the user to create or connect to a Xero organization first

---

## API Endpoints

### QuickBooks
- Connect: `GET /api/books/qbo/connect`
- Callback: `GET /api/books/qbo/callback`
- Sync: `POST /api/books/qbo/sync`
- Status: `GET /api/books/qbo/status`

### Xero
- Connect: `GET /api/books/xero/connect`
- Callback: `GET /api/books/xero/callback`
- Sync: `POST /api/books/xero/sync` (to be implemented)
- Status: `GET /api/books/xero/status` (to be implemented)

---

## Next Steps

After successful integration setup:

1. Implement data sync endpoints to pull transactions from QuickBooks/Xero
2. Add token refresh logic to maintain valid access tokens
3. Create UI for viewing synced data
4. Add disconnect functionality
5. Implement webhook handlers for real-time updates (optional)
