import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { handleSupabaseError } from "@/lib/supabase/error-handler"
import { getOrganizationContext } from "@/lib/organization/context"

export async function GET() {
  try {
    const orgContext = await getOrganizationContext()
    
    if (!orgContext) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerClient()

    let query = supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (orgContext.hasOrganizationAccess) {
      query = query.or(`user_id.eq.${orgContext.userId},organization_id.in.(${orgContext.organizationIds.join(",")})`)
    } else {
      query = query.eq("user_id", orgContext.userId)
    }

    const { data: projects, error } = await query

    if (error) {
      return handleSupabaseError(error, {
        operation: "fetch projects",
        resource: "project",
      })
    }

    const projectsWithContext = projects.map((project: any) => ({
      ...project,
      is_organization: !!project.organization_id,
    }))

    return NextResponse.json({ 
      projects: projectsWithContext,
      context: {
        hasOrganizations: orgContext.hasOrganizationAccess,
        organizationCount: orgContext.organizationIds.length,
      }
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const orgContext = await getOrganizationContext()
    
    if (!orgContext) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerClient()
    const body = await request.json()

    const targetOrgId = body.organization_id || null

    const { data: project, error } = await supabase
      .from("projects")
      .insert([
        {
          name: body.name,
          customer_id: body.customer_id,
          status: body.status || "active",
          budget: body.budget,
          start_date: body.start_date,
          end_date: body.end_date,
          description: body.description,
          user_id: orgContext.userId,
          organization_id: targetOrgId,
        },
      ])
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error, {
        operation: "create project",
        resource: "project",
        details: { organization_id: targetOrgId },
      })
    }

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
