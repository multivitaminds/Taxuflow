import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceRoleClient } from "@supabase/supabase-js"

// GET /api/organizations - List user's organizations
export async function GET() {
  try {
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // If we have the service role key, use it to bypass RLS (Preferred)
    if (supabaseUrl && serviceRoleKey) {
      const serviceRoleClient = createServiceRoleClient(supabaseUrl, serviceRoleKey)

      // Use raw SQL query to bypass RLS policies entirely
      const { data: organizations, error } = await serviceRoleClient.rpc("get_user_organizations_direct", {
        p_user_id: user.id,
      })

      if (!error) {
        return NextResponse.json({
          organizations: organizations || [],
          count: (organizations || []).length,
        })
      }

      console.error("[v0] Service role RPC failed:", error.message)
      // If RPC fails, fall through to the fallback logic below
    } else {
      console.warn("[v0] Missing Supabase service role key, falling back to authenticated client")
    }

    // Fallback: Use authenticated client with split queries to avoid RLS recursion on joins
    // Step 1: Get the organization memberships
    const { data: members, error: membersError } = await supabase
      .from("org_members")
      .select("org_id, role")
      .eq("user_id", user.id)

    if (membersError) {
      console.error("[v0] Error fetching org members:", membersError.message)
      return NextResponse.json({
        organizations: [],
        count: 0,
      })
    }

    if (!members || members.length === 0) {
      return NextResponse.json({
        organizations: [],
        count: 0,
      })
    }

    // Step 2: Get the organization details
    const orgIds = members.map((m: any) => m.org_id)
    const { data: orgs, error: orgsError } = await supabase.from("orgs").select("id, name").in("id", orgIds)

    if (orgsError) {
      console.error("[v0] Error fetching org details:", orgsError.message)
      return NextResponse.json({
        organizations: [],
        count: 0,
      })
    }

    // Step 3: Combine the data
    const orgsMap = new Map(orgs?.map((o: any) => [o.id, o]) || [])
    const mappedOrgs = members.map((m: any) => {
      const org = orgsMap.get(m.org_id)
      return {
        id: m.org_id,
        name: org?.name || "Unknown Organization",
        role: m.role,
      }
    })

    return NextResponse.json({
      organizations: mappedOrgs,
      count: mappedOrgs.length,
    })
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({
      organizations: [],
      count: 0,
    })
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      console.error("[v0] Cannot create organization: Supabase client not available")
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
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
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 })
    }

    const { data: org, error: orgError } = await supabase.rpc("create_organization", {
      org_name: name.trim(),
      org_description: description || null,
      owner_id: user.id,
    })

    if (orgError) {
      console.error("[v0] Failed to create organization", {
        error: orgError,
        code: orgError.code,
        message: orgError.message,
      })
      return NextResponse.json({ error: "Failed to create organization. Please try again." }, { status: 500 })
    }

    console.log("[v0] Organization created successfully", { orgId: org })

    return NextResponse.json({
      organization: {
        id: org,
        name: name.trim(),
        role: "owner",
      },
    })
  } catch (error) {
    console.error("[v0] Error creating organization:", error)
    return NextResponse.json(
      { error: "Failed to perform this operation. Please try again or contact support if the problem persists." },
      { status: 500 },
    )
  }
}
