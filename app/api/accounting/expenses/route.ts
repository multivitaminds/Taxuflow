import { type NextRequest, NextResponse } from "next/server"
import { createBooksServerClient } from "@/lib/supabase/books-server"
import { handleSupabaseError } from "@/lib/supabase/error-handler"
import { getOrganizationContext } from "@/lib/organization/context"

export async function GET(request: NextRequest) {
  try {
    const orgContext = await getOrganizationContext()
    
    if (!orgContext) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createBooksServerClient()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const vendorId = searchParams.get("vendor_id")

    let query = supabase
      .from("journal_entries")
      .select(`
        *,
        accounts (
          id,
          name,
          type
        )
      `)
      .eq("entry_type", "expense")
      .order("entry_date", { ascending: false })

    if (orgContext.hasOrganizationAccess) {
      query = query.in("org_id", orgContext.organizationIds)
    }

    if (vendorId) {
      query = query.eq("contact_id", vendorId)
    }

    const { data, error } = await query

    if (error) {
      return handleSupabaseError(error, {
        operation: "fetch expenses",
        resource: "expense",
      })
    }

    const expensesWithContext = data.map((expense: any) => ({
      ...expense,
      is_organization: !!expense.org_id,
    }))

    return NextResponse.json({ 
      expenses: expensesWithContext,
      context: {
        hasOrganizations: orgContext.hasOrganizationAccess,
        organizationCount: orgContext.organizationIds.length,
      }
    })
  } catch (error: any) {
    console.error("[v0] Error fetching expenses:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch expenses" }, { status: 500 })
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

    const { data: expense, error } = await supabase
      .from("journal_entries")
      .insert({
        ...body,
        entry_type: "expense",
        org_id: targetOrgId,
      })
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error, {
        operation: "create expense",
        resource: "expense",
        details: { org_id: targetOrgId },
      })
    }

    return NextResponse.json({ expense })
  } catch (error: any) {
    console.error("[v0] Error creating expense:", error)
    return NextResponse.json({ error: error.message || "Failed to create expense" }, { status: 500 })
  }
}
