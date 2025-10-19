import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      businessType,
      businessName,
      ein,
      businessStructure,
      industry,
      annualRevenue,
      employeeCount,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
    } = body

    // Validate required fields
    if (!businessName || !businessStructure || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Check if organization already exists with this email
    const { data: existingOrg } = await supabase
      .from("organizations")
      .select("id")
      .eq("billing_email", email)
      .maybeSingle()

    if (existingOrg) {
      return NextResponse.json({ error: "An organization with this email already exists" }, { status: 409 })
    }

    // Create slug from business name
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    // Create organization record
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: businessName,
        slug: slug,
        billing_email: email,
        plan_type: "business_trial",
        is_active: true,
        features: {
          businessType,
          ein,
          businessStructure,
          industry,
          annualRevenue,
          employeeCount,
          phone,
          address: {
            street: address,
            city,
            state,
            zipCode,
          },
        },
        max_users: 5,
        max_documents: 100,
      })
      .select()
      .single()

    if (orgError) {
      console.error("Error creating organization:", orgError)
      return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      organizationId: organization.id,
      message: "Business information saved successfully",
    })
  } catch (error) {
    console.error("Error in business onboarding:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
