import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// POST - Execute an API request and log it
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { method, endpoint, headers, body: requestBody, save_request, request_name } = body

    const startTime = Date.now()
    let response: Response
    let responseData: any
    let responseStatus: number
    let errorMessage: string | null = null

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }

      if (requestBody && ["POST", "PUT", "PATCH"].includes(method)) {
        fetchOptions.body = JSON.stringify(requestBody)
      }

      response = await fetch(endpoint, fetchOptions)
      responseStatus = response.status
      responseData = await response.json().catch(() => ({}))
    } catch (error: any) {
      errorMessage = error.message
      responseStatus = 0
      responseData = { error: error.message }
    }

    const responseTime = Date.now() - startTime

    const { data: apiKeys } = await supabase
      .from("api_keys")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .limit(1)
      .single()

    const { error: logError } = await supabase.from("api_request_logs").insert({
      user_id: user.id,
      api_key_id: apiKeys?.id,
      method,
      endpoint,
      request_body: requestBody,
      response_status: responseStatus,
      response_body: responseData,
      response_time_ms: responseTime,
      error_message: errorMessage,
    })

    if (logError) {
      console.error("[v0] Error logging API request:", logError)
    }

    if (save_request && request_name) {
      const { error: saveError } = await supabase.from("developer_test_requests").insert({
        user_id: user.id,
        request_name,
        method,
        endpoint,
        headers,
        body: requestBody,
        response_status: responseStatus,
        response_body: responseData,
        response_time_ms: responseTime,
        is_saved: true,
        environment: "test",
      })

      if (saveError) {
        console.error("[v0] Error saving test request:", saveError)
      }
    }

    return NextResponse.json({
      status: responseStatus,
      data: responseData,
      responseTime,
      headers: {
        "content-type": "application/json",
      },
      error: errorMessage,
    })
  } catch (error) {
    console.error("[v0] Error executing API request:", error)
    return NextResponse.json({ error: "Failed to execute API request" }, { status: 500 })
  }
}
