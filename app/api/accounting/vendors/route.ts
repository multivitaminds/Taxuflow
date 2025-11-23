import { type NextRequest, NextResponse } from "next/server"
import { createBooksServerClient } from "@/lib/supabase/books-server"
import { handleSupabaseError } from "@/lib/supabase/error-handler"
import { getOrganizationContext } from "@/lib/organization/context"

export async function GET() {
  try {
    const orgContext = await getOrganizationContext()
    
    if (!orgContext) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createBooksServerClient()

    let query = supabase
      .from("contacts")
      .select(`
        *,
        bills:bills!vendor_id (
          id,
          total_amount,
          balance_due,
          status
        )
      `)
      .eq("contact_type", "vendor")
      .order("created_at", { ascending: false })

    if (orgContext.hasOrganizationAccess) {
      query = query.in("org_id", orgContext.organizationIds)
    }

    const { data, error } = await query

    if (error) {
      return handleSupabaseError(error, {
        operation: "fetch vendors",
        resource: "vendor",
      })
    }

    const vendorsWithContext = data.map((vendor: any) => ({
      ...vendor,
      is_organization: !!vendor.org_id,
    }))

    return NextResponse.json({ 
      vendors: vendorsWithContext,
      context: {
        hasOrganizations: orgContext.hasOrganizationAccess,
        organizationCount: orgContext.organizationIds.length,
      }
    })
  } catch (error: any) {
    console.error("[v0] Error fetching vendors:", error)
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgContext = await getOrganizationContext()
    
    if (!orgContext) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createBooksServerClient()
    const body = await request.json()

    const targetOrgId = body.org_id || orgContext.organizationId

    if (!targetOrgId) {
      return NextResponse.json({ 
        error: "No organization context. Please create or join an organization first." 
      }, { status: 400 })
    }

    const { data: vendor, error } = await supabase
      .from("contacts")
      .insert({
        ...body,
        contact_type: "vendor",
        org_id: targetOrgId,
      })
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error, {
        operation: "create vendor",
        resource: "vendor",
        details: { org_id: targetOrgId },
      })
    }

    return NextResponse.json({ vendor })
  } catch (error: any) {
    console.error("[v0] Error creating vendor:", error)
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 })
  }
}
