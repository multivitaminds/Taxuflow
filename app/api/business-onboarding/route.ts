import { type NextRequest, NextResponse } from "next/server"

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

    // Create a temporary organization ID for the signup flow
    const tempOrgId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`

    return NextResponse.json({
      success: true,
      organizationId: tempOrgId,
      message: "Business information validated successfully",
    })
  } catch (error) {
    console.error("Error in business onboarding:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
