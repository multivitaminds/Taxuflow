import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { checkDemoMode } from "@/lib/demo-mode"

export async function POST(request: Request) {
  try {
    const { isDemoMode } = await checkDemoMode()

    if (isDemoMode) {
      return NextResponse.json(
        {
          success: false,
          error: "Filing is not available in demo mode. Please create a free account to file tax forms.",
          isDemoMode: true,
        },
        { status: 403 },
      )
    }

    const supabase = await getSupabaseServerClient()

    if (!supabase) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 })
    }

    const formData = await request.json()

    const wages = Number.parseFloat(formData.wagesAndTips || "0")
    const federalTax = Number.parseFloat(formData.federalIncomeTax || "0")
    const ssWages = Number.parseFloat(formData.taxableSSWages || "0")
    const medicareWages = Number.parseFloat(formData.taxableMedicareWages || "0")

    const ssTax = ssWages * 0.124 // 12.4% SS tax
    const medicareTax = medicareWages * 0.029 // 2.9% Medicare tax
    const totalTaxes = federalTax + ssTax + medicareTax

    const { data: filing, error: filingError } = await supabase
      .from("form_941_filings")
      .insert({
        user_id: user.id,
        tax_year: Number.parseInt(formData.taxYear),
        quarter: Number.parseInt(formData.quarter),
        business_name: formData.businessName,
        ein: formData.ein,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        number_of_employees: Number.parseInt(formData.numberOfEmployees || "0"),
        wages_tips_compensation: wages,
        federal_income_tax_withheld: federalTax,
        taxable_social_security_wages: ssWages,
        taxable_medicare_wages_tips: medicareWages,
        social_security_tax: ssTax,
        medicare_tax: medicareTax,
        total_taxes_after_adjustments: totalTaxes,
        filing_status: "submitted",
        source: "manual",
        validation_passed: true,
      })
      .select()
      .single()

    if (filingError) {
      console.error("[v0] Error storing 941 filing:", filingError)
      return NextResponse.json({ success: false, error: filingError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      submissionId: `941-${filing.id}`,
      filingId: filing.id,
      message: "Form 941 submitted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Form 941 submission error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
