import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { filingId } = await request.json()

    // Get 941 filing
    const { data: filing } = await supabase
      .from("form_941_filings")
      .select("*")
      .eq("id", filingId)
      .eq("user_id", user.id)
      .single()

    if (!filing) {
      return NextResponse.json({ error: "Filing not found" }, { status: 404 })
    }

    const errors: any[] = []
    const warnings: any[] = []

    // Validation Rules

    // 1. Required fields
    if (!filing.business_name) errors.push({ field: "business_name", message: "Business name is required" })
    if (!filing.ein) errors.push({ field: "ein", message: "EIN is required" })
    if (!filing.number_of_employees)
      errors.push({ field: "number_of_employees", message: "Number of employees is required" })

    // 2. EIN format
    if (filing.ein && !/^\d{2}-\d{7}$/.test(filing.ein)) {
      errors.push({ field: "ein", message: "EIN must be in format XX-XXXXXXX" })
    }

    // 3. Tax calculations
    const calculatedSSTax = (filing.taxable_social_security_wages || 0) * 0.124
    const calculatedMedicareTax = (filing.taxable_medicare_wages_tips || 0) * 0.029

    if (Math.abs((filing.social_security_tax || 0) - calculatedSSTax) > 1) {
      warnings.push({
        field: "social_security_tax",
        message: `Social Security tax should be ${calculatedSSTax.toFixed(2)} (12.4% of ${filing.taxable_social_security_wages})`,
      })
    }

    if (Math.abs((filing.medicare_tax || 0) - calculatedMedicareTax) > 1) {
      warnings.push({
        field: "medicare_tax",
        message: `Medicare tax should be ${calculatedMedicareTax.toFixed(2)} (2.9% of ${filing.taxable_medicare_wages_tips})`,
      })
    }

    // 4. Wage relationships
    if ((filing.taxable_social_security_wages || 0) > (filing.wages_tips_compensation || 0)) {
      errors.push({
        field: "taxable_social_security_wages",
        message: "Taxable SS wages cannot exceed total wages",
      })
    }

    if ((filing.taxable_medicare_wages_tips || 0) > (filing.wages_tips_compensation || 0)) {
      errors.push({
        field: "taxable_medicare_wages_tips",
        message: "Taxable Medicare wages cannot exceed total wages",
      })
    }

    // 5. Balance due calculation
    const totalTaxes = filing.total_taxes_after_adjustments || 0
    const totalDeposits = filing.total_deposits_quarter || 0
    const calculatedBalance = totalTaxes - totalDeposits

    if (calculatedBalance > 0 && Math.abs((filing.balance_due || 0) - calculatedBalance) > 1) {
      warnings.push({
        field: "balance_due",
        message: `Balance due should be ${calculatedBalance.toFixed(2)}`,
      })
    }

    // 6. Deposit schedule validation
    if (!filing.deposit_schedule) {
      warnings.push({
        field: "deposit_schedule",
        message: "Deposit schedule not specified (monthly or semiweekly)",
      })
    }

    // 7. Monthly liability validation (for monthly depositors)
    if (filing.deposit_schedule === "monthly") {
      const monthlyTotal =
        (filing.month_1_liability || 0) + (filing.month_2_liability || 0) + (filing.month_3_liability || 0)

      if (Math.abs(monthlyTotal - totalTaxes) > 1) {
        errors.push({
          field: "monthly_liability",
          message: `Monthly liabilities (${monthlyTotal.toFixed(2)}) must equal total taxes (${totalTaxes.toFixed(2)})`,
        })
      }
    }

    const validationPassed = errors.length === 0

    // Update filing with validation results
    await supabase
      .from("form_941_filings")
      .update({
        validation_errors: errors,
        validation_warnings: warnings,
        validation_passed: validationPassed,
        last_validated_at: new Date().toISOString(),
      })
      .eq("id", filingId)

    return NextResponse.json({
      success: true,
      validationPassed,
      errors,
      warnings,
    })
  } catch (error: any) {
    console.error("[v0] Form 941 validation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
