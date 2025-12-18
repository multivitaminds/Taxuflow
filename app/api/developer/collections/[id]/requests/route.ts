import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// -------------------------------------------------------
// POST — Add a request to a collection
// -------------------------------------------------------
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15/16 now passes params as a Promise
    const { id: collectionId } = await context.params

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { test_request_id, order_index } = body

    // Verify collection belongs to the user
    const { data: collection } = await supabase
      .from("developer_test_collections")
      .select("id")
      .eq("id", collectionId)
      .eq("user_id", user.id)
      .single()

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    // Insert request into collection
    const { data: collectionRequest, error } = await supabase
      .from("developer_test_collection_requests")
      .insert({
        collection_id: collectionId,
        test_request_id,
        order_index: order_index || 0,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ collectionRequest }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error adding request to collection:", error)
    return NextResponse.json(
      { error: "Failed to add request to collection" },
      { status: 500 }
    )
  }
}

// -------------------------------------------------------
// DELETE — Remove a request from a collection
// -------------------------------------------------------
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15/16 now passes params as a Promise
    const { id: collectionId } = await context.params

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = new URL(request.url).searchParams
    const testRequestId = searchParams.get("test_request_id")

    if (!testRequestId) {
      return NextResponse.json(
        { error: "Test request ID is required" },
        { status: 400 }
      )
    }

    // Verify collection belongs to the user
    const { data: collection } = await supabase
      .from("developer_test_collections")
      .select("id")
      .eq("id", collectionId)
      .eq("user_id", user.id)
      .single()

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    // Delete request
    const { error } = await supabase
      .from("developer_test_collection_requests")
      .delete()
      .eq("collection_id", collectionId)
      .eq("test_request_id", testRequestId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error removing request from collection:", error)
    return NextResponse.json(
      { error: "Failed to remove request from collection" },
      { status: 500 }
    )
  }
}
