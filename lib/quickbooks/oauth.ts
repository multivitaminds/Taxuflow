import { createServerClient } from "@/lib/supabase/server"

const QBO_AUTH_URL = "https://appcenter.intuit.com/connect/oauth2"
const QBO_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer"
const QBO_API_BASE = "https://quickbooks.api.intuit.com/v3"

export interface QuickBooksTokens {
  access_token: string
  refresh_token: string
  expires_at: number
  realm_id: string
}

/**
 * Generate QuickBooks OAuth authorization URL
 */
export function getQuickBooksAuthUrl(userId: string): string {
  const redirectUri = process.env.QBO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/quickbooks/callback`

  const params = new URLSearchParams({
    client_id: process.env.QBO_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "com.intuit.quickbooks.accounting",
    state: userId, // Pass user ID to identify who's connecting
  })

  return `${QBO_AUTH_URL}?${params.toString()}`
}

/**
 * Exchange authorization code for access tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<QuickBooksTokens> {
  const redirectUri = process.env.QBO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/quickbooks/callback`

  const response = await fetch(QBO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${process.env.QBO_CLIENT_ID}:${process.env.QBO_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange code: ${error}`)
  }

  const data = await response.json()

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    realm_id: data.realmId,
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<QuickBooksTokens> {
  const response = await fetch(QBO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${process.env.QBO_CLIENT_ID}:${process.env.QBO_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to refresh token: ${error}`)
  }

  const data = await response.json()

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    realm_id: data.realmId,
  }
}

/**
 * Get valid access token (refresh if expired)
 */
export async function getValidAccessToken(userId: string): Promise<string> {
  const supabase = await createServerClient()

  // Get stored tokens from database
  const { data: connection } = await supabase.from("quickbooks_connections").select("*").eq("user_id", userId).single()

  if (!connection) {
    throw new Error("QuickBooks not connected")
  }

  // Check if token is expired
  if (Date.now() >= connection.expires_at) {
    // Refresh the token
    const newTokens = await refreshAccessToken(connection.refresh_token)

    // Update database with new tokens
    await supabase
      .from("quickbooks_connections")
      .update({
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        expires_at: newTokens.expires_at,
      })
      .eq("user_id", userId)

    return newTokens.access_token
  }

  return connection.access_token
}

/**
 * Make authenticated request to QuickBooks API
 */
export async function quickbooksRequest(userId: string, endpoint: string, options: RequestInit = {}): Promise<any> {
  const accessToken = await getValidAccessToken(userId)
  const supabase = await createServerClient()

  const { data: connection } = await supabase
    .from("quickbooks_connections")
    .select("realm_id")
    .eq("user_id", userId)
    .single()

  const url = `${QBO_API_BASE}/company/${connection.realm_id}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`QuickBooks API error: ${error}`)
  }

  return response.json()
}
