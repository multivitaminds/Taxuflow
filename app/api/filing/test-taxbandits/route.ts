import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  console.log("[v0] ========================================")
  console.log("[v0] Testing TaxBandits API connection...")
  console.log("[v0] ========================================")

  try {
    // Check if credentials exist
    const clientId = process.env.TAXBANDITS_CLIENT_ID
    const clientSecret = process.env.TAXBANDITS_API_SECRET // This is actually the Client Secret
    const userToken = process.env.TAXBANDITS_API_KEY // This is actually the User Token
    const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"

    console.log("[v0] Step 1: Checking environment variables...")
    console.log("[v0] - TAXBANDITS_CLIENT_ID:", clientId ? `✓ Set (${clientId.substring(0, 8)}...)` : "✗ Missing")
    console.log(
      "[v0] - TAXBANDITS_API_SECRET (Client Secret):",
      clientSecret ? `✓ Set (${clientSecret.substring(0, 8)}...)` : "✗ Missing",
    )
    console.log(
      "[v0] - TAXBANDITS_API_KEY (User Token):",
      userToken ? `✓ Set (${userToken.substring(0, 8)}...)` : "✗ Missing",
    )
    console.log("[v0] - TAXBANDITS_ENVIRONMENT:", environment)

    if (!clientId || !clientSecret || !userToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing TaxBandits credentials",
          details: {
            hasClientId: !!clientId,
            hasClientSecret: !!clientSecret,
            hasUserToken: !!userToken,
          },
          instructions:
            "Please set TAXBANDITS_CLIENT_ID, TAXBANDITS_API_SECRET (Client Secret), and TAXBANDITS_API_KEY (User Token) in your environment variables. Get these from: https://sandbox.taxbandits.com → Settings → API Credentials",
        },
        { status: 500 },
      )
    }

    const authUrl =
      environment === "production"
        ? "https://oauth.expressauth.net/v2/tbsauth"
        : "https://testoauth.expressauth.net/v2/tbsauth"

    console.log("[v0] Step 2: Generating JWT...")
    console.log("[v0] OAuth URL:", authUrl)

    const payload = {
      iss: clientId, // Issuer: Client ID
      sub: clientId, // Subject: Client ID
      aud: userToken, // Audience: User Token
      iat: Math.floor(Date.now() / 1000), // Issued At: Current timestamp
    }

    console.log("[v0] JWT Payload:", {
      iss: payload.iss.substring(0, 8) + "...",
      sub: payload.sub.substring(0, 8) + "...",
      aud: payload.aud.substring(0, 8) + "...",
      iat: payload.iat,
    })

    const jws = jwt.sign(payload, clientSecret)
    console.log("[v0] JWS Token generated successfully")
    console.log("[v0] JWS (first 50 chars):", jws.substring(0, 50) + "...")

    console.log("[v0] Step 3: Authenticating with TaxBandits OAuth...")
    console.log("[v0] Making GET request to:", authUrl)
    console.log("[v0] With Authentication header (JWS)")

    const authResponse = await fetch(authUrl, {
      method: "GET",
      headers: {
        Authentication: jws, // TaxBandits uses "Authentication" not "Authorization"
      },
    })

    console.log("[v0] Response status:", authResponse.status)
    console.log("[v0] Response headers:", Object.fromEntries(authResponse.headers.entries()))

    const authData = await authResponse.json()
    console.log("[v0] Response body:", JSON.stringify(authData, null, 2))

    if (!authResponse.ok) {
      console.log("[v0] ✗ Authentication failed!")
      return NextResponse.json(
        {
          success: false,
          error: "TaxBandits OAuth authentication failed",
          status: authResponse.status,
          response: authData,
          requestDetails: {
            url: authUrl,
            method: "GET",
            hasJWS: true,
            clientId: clientId.substring(0, 8) + "...",
            jwtPayload: {
              iss: payload.iss.substring(0, 8) + "...",
              sub: payload.sub.substring(0, 8) + "...",
              aud: payload.aud.substring(0, 8) + "...",
              iat: payload.iat,
            },
          },
          troubleshooting: [
            "1. Verify your credentials at: https://sandbox.taxbandits.com → Settings → API Credentials",
            "2. Make sure you're using the SANDBOX credentials (not production)",
            "3. Check that Client ID, Client Secret, and User Token are all correct",
            "4. Ensure TAXBANDITS_ENVIRONMENT is set to 'sandbox' (not 'production')",
          ],
        },
        { status: authResponse.status },
      )
    }

    // Authentication successful - extract Access Token
    const accessToken = authData.AccessToken

    if (!accessToken) {
      console.log("[v0] ✗ No Access Token in response!")
      return NextResponse.json(
        {
          success: false,
          error: "No Access Token received from TaxBandits",
          response: authData,
        },
        { status: 500 },
      )
    }

    console.log("[v0] ✓ Authentication successful!")
    console.log("[v0] Access Token received (first 30 chars):", accessToken.substring(0, 30) + "...")
    console.log("[v0] Token Type:", authData.TokenType)
    console.log("[v0] Expires In:", authData.ExpiresIn, "seconds")

    const apiBaseUrl = environment === "production" ? "https://api.taxbandits.com" : "https://testapi.taxbandits.com"

    console.log("[v0] Step 4: Testing API access with Access Token...")
    // Try to get business list as a test
    const testApiUrl = `${apiBaseUrl}/v1.7.3/Business/List`
    console.log("[v0] Making test API call to:", testApiUrl)

    const testResponse = await fetch(testApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const testData = await testResponse.json()
    console.log("[v0] Test API response status:", testResponse.status)
    console.log("[v0] Test API response:", JSON.stringify(testData, null, 2))

    console.log("[v0] ========================================")
    console.log("[v0] ✓ TaxBandits API Test Complete!")
    console.log("[v0] ========================================")

    // Authentication successful
    return NextResponse.json({
      success: true,
      message: "✓ TaxBandits API is accessible and authentication successful!",
      environment,
      authResponse: {
        accessToken: accessToken.substring(0, 30) + "...",
        tokenType: authData.TokenType,
        expiresIn: authData.ExpiresIn,
      },
      testApiCall: {
        url: testApiUrl,
        status: testResponse.status,
        success: testResponse.ok,
        response: testData,
      },
      apiUrl: apiBaseUrl,
      oauthUrl: authUrl,
      nextSteps: [
        "Your TaxBandits API credentials are working correctly!",
        "You can now submit W-2 forms to the IRS via TaxBandits.",
        "Go back to the W-2 form and click 'Submit to IRS'.",
      ],
    })
  } catch (error: any) {
    console.error("[v0] ✗ TaxBandits API test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to TaxBandits API",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
