import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET - List all test collections for the user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: collections, error } = await supabase
      .from("developer_test_collections")
      .select(
        `
        *,
        requests:developer_test_collection_requests(
          test_request_id,
          order_index,
          test_request:developer_test_requests(*)
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ collections })
  } catch (error) {
    console.error("[v0] Error fetching test collections:", error)
    return NextResponse.json({ error: "Failed to fetch test collections" }, { status: 500 })
  }
}

// POST - Create a new test collection
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
    const { collection_name, description, is_public } = body

    const { data: collection, error } = await supabase
      .from("developer_test_collections")
      .insert({
        user_id: user.id,
        collection_name,
        description,
        is_public: is_public || false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ collection }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating test collection:", error)
    return NextResponse.json({ error: "Failed to create test collection" }, { status: 500 })
  }
}

// PATCH - Update a test collection
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
      return NextResponse.json({ error: "Collection ID is required" }, { status: 400 })
    }

    const { data: collection, error } = await supabase
      .from("developer_test_collections")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ collection })
  } catch (error) {
    console.error("[v0] Error updating test collection:", error)
    return NextResponse.json({ error: "Failed to update test collection" }, { status: 500 })
  }
}

// DELETE - Delete a test collection
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
      return NextResponse.json({ error: "Collection ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("developer_test_collections").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting test collection:", error)
    return NextResponse.json({ error: "Failed to delete test collection" }, { status: 500 })
  }
}
