import { NextResponse } from "next/server"
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
      .from("invoices")
      .select("*, customer:contacts!customer_id(*)")
      .eq("status", "draft")
      .order("created_at", { ascending: false })

    if (orgContext.hasOrganizationAccess) {
      query = query.in("org_id", orgContext.organizationIds)
    }

    const { data: estimates, error } = await query

    if (error) {
      return handleSupabaseError(error, {
        operation: "fetch estimates",
        resource: "estimate",
      })
    }

    return NextResponse.json({ 
      estimates,
      context: {
        hasOrganizations: orgContext.hasOrganizationAccess,
        organizationCount: orgContext.organizationIds.length,
      }
    })
  } catch (error) {
    console.error("Error fetching estimates:", error)
    return NextResponse.json({ error: "Failed to fetch estimates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    const { data: estimate, error } = await supabase
      .from("invoices")
      .insert([
        {
          customer_id: body.customer_id,
          invoice_number: body.estimate_number,
          invoice_date: body.estimate_date,
          due_date: body.expiry_date,
          subtotal_amount: body.subtotal,
          tax_amount: body.tax_amount,
          total_amount: body.total_amount,
          status: "draft",
          notes: body.notes,
          org_id: targetOrgId,
        },
      ])
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error, {
        operation: "create estimate",
        resource: "estimate",
        details: { org_id: targetOrgId },
      })
    }

    return NextResponse.json({ estimate }, { status: 201 })
  } catch (error) {
    console.error("Error creating estimate:", error)
    return NextResponse.json({ error: "Failed to create estimate" }, { status: 500 })
  }
}
