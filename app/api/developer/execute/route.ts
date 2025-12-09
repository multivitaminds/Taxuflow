import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// POST - Execute an API test request and log it
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      method,
      endpoint,
      headers = {},
      body: requestBody,
      save_request = false,
      request_name,
      test_request_id,
    } = body

    if (!method || !endpoint) {
      return NextResponse.json({ error: "Missing required fields: method, endpoint" }, { status: 400 })
    }

    // Validate endpoint
    let targetUrl: URL
    try {
      // If endpoint is relative, use the current origin
      if (endpoint.startsWith("/")) {
        const origin = request.headers.get("origin") || "http://localhost:3000"
        targetUrl = new URL(endpoint, origin)
      } else {
        targetUrl = new URL(endpoint)
      }
    } catch (e) {
      return NextResponse.json({ error: "Invalid endpoint URL" }, { status: 400 })
    }

    // Execute the API request
    const startTime = Date.now()
    let responseStatus = 0
    let responseBody: any = null
    const responseHeaders: Record<string, string> = {}
    let errorMessage: string | null = null

    try {
      const fetchOptions: RequestInit = {
        method: method.toUpperCase(),
        headers: {
          ...headers,
          "User-Agent": "Taxu-Workbench/1.0",
        },
      }

      // Add body for methods that support it
      if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && requestBody) {
        fetchOptions.body = typeof requestBody === "string" ? requestBody : JSON.stringify(requestBody)
      }

      const response = await fetch(targetUrl.toString(), fetchOptions)
      const endTime = Date.now()
      const responseTimeMs = endTime - startTime

      responseStatus = response.status

      // Capture response headers
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // Try to parse response body
      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        responseBody = await response.json()
      } else {
        responseBody = await response.text()
      }

      // Get user's API key for logging (if they have one)
      const { data: apiKeys } = await supabase.from("api_keys").select("id").eq("user_id", user.id).limit(1)

      const apiKeyId = apiKeys?.[0]?.id || null

      // Log the API request
      if (apiKeyId) {
        await supabase.from("api_request_logs").insert({
          api_key_id: apiKeyId,
          endpoint: targetUrl.pathname,
          method: method.toUpperCase(),
          status_code: responseStatus,
          response_time_ms: responseTimeMs,
          request_size_bytes: requestBody ? JSON.stringify(requestBody).length : 0,
          response_size_bytes: responseBody ? JSON.stringify(responseBody).length : 0,
          user_agent: "Taxu-Workbench/1.0",
          ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        })
      }

      // Save or update the test request if requested
      if (save_request) {
        if (test_request_id) {
          // Update existing test request with response
          await supabase
            .from("developer_test_requests")
            .update({
              response_body: responseBody,
              response_status: responseStatus,
              response_time_ms: responseTimeMs,
              last_executed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", test_request_id)
            .eq("user_id", user.id)
        } else if (request_name) {
          // Create new test request
          await supabase.from("developer_test_requests").insert({
            user_id: user.id,
            request_name,
            method: method.toUpperCase(),
            endpoint,
            headers,
            body: requestBody,
            response_body: responseBody,
            response_status: responseStatus,
            response_time_ms: responseTimeMs,
            is_saved: true,
            last_executed_at: new Date().toISOString(),
          })
        }
      }

      return NextResponse.json({
        success: true,
        status: responseStatus,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
        responseTime: responseTimeMs,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      const endTime = Date.now()
      const responseTimeMs = endTime - startTime
      errorMessage = error.message

      console.error("[v0] Error executing API request:", error)

      return NextResponse.json({
        success: false,
        error: errorMessage,
        status: 0,
        responseTime: responseTimeMs,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("[v0] Error in execute POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
