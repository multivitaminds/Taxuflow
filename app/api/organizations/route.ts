import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceRoleClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// GET /api/organizations - List user's organizations
export async function GET() {
  try {
    const cookieStore = await cookies()
    const demoMode = cookieStore.get("demo_mode")?.value === "true"
    
    if (demoMode) {
      return NextResponse.json({
        organizations: [
          {
            id: "demo-org-1",
            name: "Demo Company LLC",
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    let members = []
    let orgs = []
    let fetchError = null

    // Strategy 1: Try Service Role (Bypasses RLS)
    if (supabaseUrl && serviceRoleKey) {
      try {
        const serviceRoleClient = createServiceRoleClient(
          supabaseUrl,
          serviceRoleKey
        )

        // Step 1: Get memberships
        const { data: memberData, error: memberErr } = await serviceRoleClient
          .from('org_members')
          .select('org_id, role')
          .eq('user_id', user.id)

        if (memberErr) throw memberErr
        members = memberData || []

        // Step 2: Get org details (if any members found)
        if (members.length > 0) {
          const orgIds = members.map((m: any) => m.org_id)
          const { data: orgData, error: orgErr } = await serviceRoleClient
            .from('orgs')
            .select('id, name')
            .in('id', orgIds)

          if (orgErr) throw orgErr
          orgs = orgData || []
        }
      } catch (error) {
        console.error("[v0] Service role query failed, falling back to user context:", error)
        fetchError = error
      }
    }

    // Strategy 2: Fallback to Authenticated User Client (if Service Role failed or missing)
    // We use the split query approach here too to avoid RLS recursion
    if ((!members.length && !fetchError) || (!serviceRoleKey && !members.length)) {
      // Step 1: Get memberships
      const { data: memberData, error: memberErr } = await supabase
        .from('org_members')
        .select('org_id, role')
        .eq('user_id', user.id)

      if (memberErr) {
        console.error("[v0] Error fetching org memberships:", memberErr.message)
      } else {
        members = memberData || []

        // Step 2: Get org details
        if (members.length > 0) {
          const orgIds = members.map((m: any) => m.org_id)
          const { data: orgData, error: orgErr } = await supabase
            .from('orgs')
            .select('id, name')
            .in('id', orgIds)

          if (orgErr) {
            console.error("[v0] Error fetching org details:", orgErr.message)
          } else {
            orgs = orgData || []
          }
        }
      }
    }

    // Map the data to the expected format
    const organizations = members.map((member: any) => ({
      id: member.org_id,
      name: orgs.find((o: any) => o.id === member.org_id)?.name || 'Unknown Organization',
      role: member.role,
    }))

    return NextResponse.json({
      organizations,
      count: organizations.length,
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
      .rpc('create_organization', {
        org_name: name.trim(),
        org_description: description || null,
        owner_id: user.id
      })

    if (orgError) {
      console.error("[v0] Failed to create organization", { 
        error: orgError,
        code: orgError.code,
        message: orgError.message,
      })
      return NextResponse.json(
        { error: "Failed to create organization. Please try again." },
        { status: 500 }
      )
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
      { status: 500 }
    )
  }
}
