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
        invoices:invoices!customer_id (
          id,
          total_amount,
          balance_due,
          status
        )
      `)
      .order("created_at", { ascending: false })

    if (orgContext.hasOrganizationAccess) {
      query = query.or(`user_id.eq.${orgContext.userId},org_id.in.(${orgContext.organizationIds.join(",")})`)
    } else {
      query = query.eq("user_id", orgContext.userId)
    }

    const { data, error } = await query

    if (error) {
      return handleSupabaseError(error, {
        operation: "fetch customers",
        resource: "customer",
      })
    }

    // Calculate customer stats
    const customersWithStats = data.map((customer: any) => {
      const totalRevenue = customer.invoices.reduce((sum: number, inv: any) => sum + (inv.total_amount || 0), 0)
      const outstandingBalance = customer.invoices.reduce((sum: number, inv: any) => sum + (inv.balance_due || 0), 0)
      const invoiceCount = customer.invoices.length

      return {
        ...customer,
        total_revenue: totalRevenue,
        outstanding_balance: outstandingBalance,
        invoice_count: invoiceCount,
        is_organization: !!customer.org_id,
      }
    })

    return NextResponse.json({
      customers: customersWithStats,
      context: {
        hasOrganizations: orgContext.hasOrganizationAccess,
        organizationCount: orgContext.organizationIds.length,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Customer creation request received")

    const orgContext = await getOrganizationContext()

    if (!orgContext) {
      console.error("[v0] Customer creation failed - No organization context (user not authenticated)")
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "You must be signed in to create customers. Please refresh the page and try again.",
        },
        { status: 401 },
      )
    }

    console.log("[v0] Customer creation - Authenticated user:", {
      userId: orgContext.userId,
      hasOrgAccess: orgContext.hasOrganizationAccess,
      orgCount: orgContext.organizationIds.length,
    })

    const supabase = await createBooksServerClient()
    const body = await request.json()

    if (!body.contact_name || !body.email) {
      return NextResponse.json({ error: "Customer name and email are required" }, { status: 400 })
    }

    const targetOrgId = body.org_id || orgContext.organizationId || null

    const customerData = {
      contact_name: body.contact_name,
      company_name: body.company_name || null,
      email: body.email,
      phone: body.phone || null,
      tax_id: body.tax_id || null,
      contact_type: body.contact_type || "customer",
      org_id: targetOrgId, // Can be null for personal customers
      user_id: orgContext.userId,
    }

    console.log("[v0] Inserting customer with data:", customerData)

    const { data: customer, error } = await supabase.from("contacts").insert(customerData).select().single()

    if (error) {
      console.error("[v0] Supabase error creating customer:", error)
      return handleSupabaseError(error, {
        operation: "create customer",
        resource: "customer",
        userId: orgContext.userId,
        details: { email: body.email, org_id: targetOrgId },
      })
    }

    console.log("[v0] Customer created successfully:", customer.id)
    return NextResponse.json({ customer }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error creating customer:", error)
    return NextResponse.json(
      {
        error: "Failed to create customer",
        message: "An unexpected error occurred. Please try again or contact support if the issue persists.",
      },
      { status: 500 },
    )
  }
}
