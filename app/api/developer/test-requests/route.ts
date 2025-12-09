import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET - List all test requests for the current user
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const collectionId = searchParams.get("collection_id")
    const saved = searchParams.get("saved")

    // Build query
    let query = supabase
      .from("developer_test_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (collectionId) {
      query = query.eq("collection_id", collectionId)
    }

    if (saved === "true") {
      query = query.eq("is_saved", true)
    }

    const { data: testRequests, error } = await query

    if (error) {
      console.error("[v0] Error fetching test requests:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ testRequests })
  } catch (error) {
    console.error("[v0] Error in test-requests GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new test request
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
    const { request_name, method, endpoint, headers, body: requestBody, collection_id, is_saved = true } = body

    if (!request_name || !method || !endpoint) {
      return NextResponse.json({ error: "Missing required fields: request_name, method, endpoint" }, { status: 400 })
    }

    const { data: testRequest, error } = await supabase
      .from("developer_test_requests")
      .insert({
        user_id: user.id,
        request_name,
        method,
        endpoint,
        headers: headers || {},
        body: requestBody || null,
        collection_id: collection_id || null,
        is_saved,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating test request:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ testRequest }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in test-requests POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update a test request
export async function PATCH(request: Request) {
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
    const { id, request_name, method, endpoint, headers, body: requestBody, is_saved } = body

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 })
    }

    // Verify ownership
    const { data: existing } = await supabase.from("developer_test_requests").select("user_id").eq("id", id).single()

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: "Test request not found or access denied" }, { status: 404 })
    }

    const updates: any = { updated_at: new Date().toISOString() }
    if (request_name) updates.request_name = request_name
    if (method) updates.method = method
    if (endpoint) updates.endpoint = endpoint
    if (headers) updates.headers = headers
    if (requestBody !== undefined) updates.body = requestBody
    if (is_saved !== undefined) updates.is_saved = is_saved

    const { data: testRequest, error } = await supabase
      .from("developer_test_requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating test request:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ testRequest })
  } catch (error) {
    console.error("[v0] Error in test-requests PATCH:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a test request
export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 })
    }

    // Verify ownership before deleting
    const { data: existing } = await supabase.from("developer_test_requests").select("user_id").eq("id", id).single()

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: "Test request not found or access denied" }, { status: 404 })
    }

    const { error } = await supabase.from("developer_test_requests").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting test request:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in test-requests DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
