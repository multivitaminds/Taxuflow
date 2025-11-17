import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { handleSupabaseError } from "@/lib/supabase/error-handler"
import { cookies } from "next/headers"

// GET /api/organizations - List user's organizations
export async function GET() {
  try {
    const cookieStore = await cookies()
    const demoMode = cookieStore.get("demo_mode")?.value === "true"
    
    if (demoMode) {
      // Return demo organizations
      return NextResponse.json({
        organizations: [
          {
            id: "demo-org-1",
            name: "Demo Company LLC",
            description: "Sample organization for demo purposes",
            role: "owner",
          },
        ],
        count: 1,
      })
    }

    const supabase = await createClient()
    
    if (!supabase) {
      console.log("[v0] Supabase not configured, returning empty organizations")
      return NextResponse.json({
        organizations: [],
        count: 0,
      })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get organizations from books.org_members
    const { data: memberships, error: membershipsError } = await supabase
      .from("org_members")
      .select(`
        org_id,
        role,
        orgs:org_id (
          id,
          name,
          description
        )
      `)
      .eq("user_id", user.id)

    if (membershipsError) {
      return handleSupabaseError(membershipsError, "organization memberships", "fetch")
    }

    // Transform data
    const organizations = memberships?.map((m: any) => ({
      id: m.org_id,
      name: m.orgs?.name || "Unnamed Organization",
      description: m.orgs?.description,
      role: m.role,
    })) || []

    return NextResponse.json({
      organizations,
      count: organizations.length,
    })
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    )
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const demoMode = cookieStore.get("demo_mode")?.value === "true"
    
    if (demoMode) {
      return NextResponse.json(
        { error: "Cannot create organizations in demo mode" },
        { status: 403 }
      )
    }

    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      )
    }

    // Create organization in books.orgs
    const { data: org, error: orgError } = await supabase
      .from("orgs")
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
      })
      .select()
      .single()

    if (orgError) {
      return handleSupabaseError(orgError, "organization", "create")
    }

    // Add user as owner/admin in books.org_members
    const { error: memberError } = await supabase
      .from("org_members")
      .insert({
        org_id: org.id,
        user_id: user.id,
        role: "owner",
      })

    if (memberError) {
      // Try to clean up the org if member creation fails
      await supabase.from("orgs").delete().eq("id", org.id)
      return handleSupabaseError(memberError, "organization member", "create")
    }

    return NextResponse.json({
      organization: {
        id: org.id,
        name: org.name,
        description: org.description,
        role: "owner",
      },
    })
  } catch (error) {
    console.error("Error creating organization:", error)
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    )
  }
}
