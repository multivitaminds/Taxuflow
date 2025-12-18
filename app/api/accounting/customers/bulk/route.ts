import { type NextRequest, NextResponse } from "next/server"
import { createBooksServerClient } from "@/lib/supabase/books-server"
import { handleApiError, ApiError, ErrorCode } from "@/lib/errors"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createBooksServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new ApiError("Unauthorized", ErrorCode.UNAUTHORIZED)
    }

    const { customers } = await request.json()

    if (!Array.isArray(customers) || customers.length === 0) {
      throw new ApiError("Invalid request: customers array is required", ErrorCode.VALIDATION_ERROR)
    }

    // Validate and prepare customer data
    const customerData = customers.map((customer) => ({
      user_id: user.id,
      type: "customer",
      contact_name: customer.contact_name,
      company_name: customer.company_name || null,
      email: customer.email || null,
      phone: customer.phone || null,
      address_line1: customer.address_line1 || null,
      address_line2: customer.address_line2 || null,
      city: customer.city || null,
      state: customer.state || null,
      zip_code: customer.zip_code || null,
      country: customer.country || "US",
      tax_id: customer.tax_id || null,
      notes: customer.notes || null,
    }))

    // Insert customers in batch
    const { data, error } = await supabase.from("contacts").insert(customerData).select()

    if (error) {
      console.error("[v0] Bulk insert error:", error)
      throw new ApiError("Failed to insert customers", ErrorCode.DATABASE_ERROR)
    }

    return NextResponse.json({
      success: true,
      inserted: data.length,
      customers: data,
    })
  } catch (error) {
    return handleApiError(error, "bulk customer upload")
  }
}
