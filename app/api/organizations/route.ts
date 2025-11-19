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

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[v0] Missing Supabase credentials", { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!serviceRoleKey 
      })
      return NextResponse.json({
        organizations: [],
        count: 0,
      })
    }

    const serviceRoleClient = createServiceRoleClient(
      supabaseUrl,
      serviceRoleKey
    )

    // Query org_members and orgs using service role to bypass RLS
    const { data: memberData, error: memberError } = await serviceRoleClient
      .from('org_members')
      .select(`
        org_id,
        role,
        orgs:org_id (
          id,
          name
        )
      `)
      .eq('user_id', user.id)

    if (memberError) {
      console.error("[v0] Error fetching org memberships:", memberError.message)
      return NextResponse.json({
        organizations: [],
        count: 0,
      })
    }

    if (!memberData || memberData.length === 0) {
      return NextResponse.json({
        organizations: [],
        count: 0,
      })
    }

    // Map the data to the expected format
    const organizations = memberData.map((member: any) => ({
      id: member.org_id,
      name: member.orgs?.name || 'Unknown Organization',
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
