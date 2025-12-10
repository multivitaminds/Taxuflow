import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET - List all saved test requests for the user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const collectionId = searchParams.get("collection_id")
    const isFavorite = searchParams.get("favorite") === "true"

    let query = supabase
      .from("developer_test_requests")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_saved", true)
      .order("created_at", { ascending: false })

    if (collectionId) {
      query = query.eq("collection_id", collectionId)
    }

    if (isFavorite) {
      query = query.eq("is_favorite", true)
    }

    const { data: requests, error } = await query

    if (error) throw error

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("[v0] Error fetching test requests:", error)
    return NextResponse.json({ error: "Failed to fetch test requests" }, { status: 500 })
  }
}

// POST - Create or save a new test request
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
    const { request_name, method, endpoint, headers, body: requestBody, environment, is_favorite } = body

    const { data: testRequest, error } = await supabase
      .from("developer_test_requests")
      .insert({
        user_id: user.id,
        request_name,
        method,
        endpoint,
        headers,
        body: requestBody,
        environment: environment || "test",
        is_saved: true,
        is_favorite: is_favorite || false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ request: testRequest }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating test request:", error)
    return NextResponse.json({ error: "Failed to create test request" }, { status: 500 })
  }
}

// PATCH - Update a test request
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
    }

    const { data: testRequest, error } = await supabase
      .from("developer_test_requests")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ request: testRequest })
  } catch (error) {
    console.error("[v0] Error updating test request:", error)
    return NextResponse.json({ error: "Failed to update test request" }, { status: 500 })
  }
}

// DELETE - Delete a test request
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("developer_test_requests").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting test request:", error)
    return NextResponse.json({ error: "Failed to delete test request" }, { status: 500 })
  }
}
