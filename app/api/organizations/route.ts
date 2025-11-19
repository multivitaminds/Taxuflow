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

    const { data: memberships, error: membershipsError } = await supabase
      .from("organization_memberships")
      .select("organization_id, role")
      .eq("user_id", user.id)

    if (membershipsError) {
      console.error("[v0] Supabase Error:", membershipsError.message)
      return handleSupabaseError(membershipsError, "organization memberships", "fetch")
    }

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({
        organizations: [],
        count: 0,
      })
    }

    const orgIds = memberships.map(m => m.organization_id)
    const { data: orgs, error: orgsError } = await supabase
      .from("organizations")
      .select("id, name")
      .in("id", orgIds)

    if (orgsError) {
      console.error("[v0] Error fetching organizations:", orgsError)
      return handleSupabaseError(orgsError, "organizations", "fetch")
    }

    const organizations = orgs?.map((org) => {
      const membership = memberships.find(m => m.organization_id === org.id)
      return {
        id: org.id,
        name: org.name,
        role: membership?.role || "member",
      }
    }) || []

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
      console.error("[v0] Cannot create organization: Supabase client not available")
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("[v0] Cannot create organization: User not authenticated")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    console.log("[v0] Creating organization", { name, userId: user.id })

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      )
    }

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: name.trim(),
        is_active: true,
        plan_type: "free",
      })
      .select()
      .single()

    if (orgError) {
      console.error("[v0] Failed to create organization", { 
        error: orgError,
        code: orgError.code,
        message: orgError.message,
        details: orgError.details,
        hint: orgError.hint
      })
      return handleSupabaseError(orgError, "organization", "create")
    }

    console.log("[v0] Organization created successfully", { orgId: org.id })

    const { error: memberError } = await supabase
      .from("organization_memberships")
      .insert({
        organization_id: org.id,
        user_id: user.id,
        role: "owner",
      })

    if (memberError) {
      console.error("[v0] Failed to add user as org member", {
        error: memberError,
        code: memberError.code,
        message: memberError.message,
        details: memberError.details,
        hint: memberError.hint,
        orgId: org.id,
        userId: user.id
      })
      // Rollback: delete the organization if membership creation fails
      await supabase.from("organizations").delete().eq("id", org.id)
      return handleSupabaseError(memberError, "organization member", "create")
    }

    console.log("[v0] User added as org owner successfully")

    return NextResponse.json({
      organization: {
        id: org.id,
        name: org.name,
        role: "owner",
      },
    })
  } catch (error) {
    console.error("[v0] Error creating organization:", error)
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    )
  }
}
