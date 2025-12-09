import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET - List all test collections for the current user
export async function GET(request: Request) {
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

    // Get collections with request counts
    const { data: collections, error } = await supabase
      .from("developer_test_collections")
      .select(
        `
        *,
        developer_test_collection_requests (
          count
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching test collections:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the response with request counts
    const formattedCollections = collections?.map((collection) => ({
      ...collection,
      request_count: collection.developer_test_collection_requests?.length || 0,
    }))

    return NextResponse.json({ collections: formattedCollections })
  } catch (error) {
    console.error("[v0] Error in test-collections GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new test collection
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
    const { collection_name, description, is_public = false } = body

    if (!collection_name) {
      return NextResponse.json({ error: "Missing required field: collection_name" }, { status: 400 })
    }

    const { data: collection, error } = await supabase
      .from("developer_test_collections")
      .insert({
        user_id: user.id,
        collection_name,
        description: description || null,
        is_public,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating test collection:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ collection }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in test-collections POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update a test collection
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
    const { id, collection_name, description, is_public } = body

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 })
    }

    // Verify ownership
    const { data: existing } = await supabase.from("developer_test_collections").select("user_id").eq("id", id).single()

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: "Collection not found or access denied" }, { status: 404 })
    }

    const updates: any = { updated_at: new Date().toISOString() }
    if (collection_name) updates.collection_name = collection_name
    if (description !== undefined) updates.description = description
    if (is_public !== undefined) updates.is_public = is_public

    const { data: collection, error } = await supabase
      .from("developer_test_collections")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating test collection:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ collection })
  } catch (error) {
    console.error("[v0] Error in test-collections PATCH:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a test collection
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

    // Verify ownership
    const { data: existing } = await supabase.from("developer_test_collections").select("user_id").eq("id", id).single()

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: "Collection not found or access denied" }, { status: 404 })
    }

    const { error } = await supabase.from("developer_test_collections").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting test collection:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in test-collections DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
