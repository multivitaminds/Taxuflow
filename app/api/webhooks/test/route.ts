import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createHmac } from "crypto"

export async function POST(req: Request) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { endpoint_id } = body

  const { data: endpoint, error } = await supabase
    .from("webhook_endpoints")
    .select("*")
    .eq("id", endpoint_id)
    .eq("user_id", user.id)
    .single()

  if (error || !endpoint) {
    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
  }

  // Send test event
  const testPayload = {
    id: `evt_test_${Date.now()}`,
    object: "event",
    type: "test.webhook",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        message: "This is a test webhook from Taxu",
        timestamp: new Date().toISOString(),
      },
    },
  }

  const payloadString = JSON.stringify(testPayload)
  const signature = createHmac("sha256", endpoint.secret).update(payloadString).digest("hex")
  const timestamp = Date.now().toString()

  try {
    const response = await fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Taxu-Signature": signature,
        "X-Taxu-Timestamp": timestamp,
        "User-Agent": "Taxu-Webhooks/1.0",
      },
      body: payloadString,
      signal: AbortSignal.timeout(10000),
    })

    const responseBody = await response.text()

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      body: responseBody,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
