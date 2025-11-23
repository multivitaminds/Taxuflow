import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { plaidClient } from "@/lib/plaid-client"

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

    const { payrollConnectionId, taxYear, quarter } = await request.json()

    // Get payroll connection
    const { data: connection } = await supabase
      .from("payroll_connections")
      .select("*")
      .eq("id", payrollConnectionId)
      .eq("user_id", user.id)
      .single()

    if (!connection) {
      return NextResponse.json({ error: "Payroll connection not found" }, { status: 404 })
    }

    // Fetch payroll data from Plaid
    const startDate = getQuarterStartDate(taxYear, quarter)
    const endDate = getQuarterEndDate(taxYear, quarter)

    const payrollData = await plaidClient.employmentGet({
      access_token: connection.plaid_access_token,
    })

    // Calculate 941 data from payroll
    const form941Data = calculateForm941FromPayroll(payrollData, taxYear, quarter)

    // Create or update 941 filing
    const { data: filing, error } = await supabase
      .from("form_941_filings")
      .upsert(
        {
          user_id: user.id,
          organization_id: connection.organization_id,
          tax_year: taxYear,
          quarter: quarter,
          payroll_connection_id: payrollConnectionId,
          source: "payroll_sync",
          ...form941Data,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,tax_year,quarter,filing_type",
        },
      )
      .select()
      .single()

    if (error) throw error

    // Update connection last synced
    await supabase
      .from("payroll_connections")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", payrollConnectionId)

    return NextResponse.json({ success: true, filing })
  } catch (error: any) {
    console.error("[v0] Form 941 sync error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function getQuarterStartDate(year: number, quarter: number): string {
  const month = (quarter - 1) * 3
  return `${year}-${String(month + 1).padStart(2, "0")}-01`
}

function getQuarterEndDate(year: number, quarter: number): string {
  const month = quarter * 3
  const lastDay = new Date(year, month, 0).getDate()
  return `${year}-${String(month).padStart(2, "0")}-${lastDay}`
}

function calculateForm941FromPayroll(payrollData: any, taxYear: number, quarter: number): any {
  // Extract payroll data and calculate 941 fields
  const employees = payrollData.employees || []

  let totalWages = 0
  let totalFederalWithholding = 0
  let totalSSWages = 0
  let totalMedicareWages = 0

  employees.forEach((emp: any) => {
    totalWages += emp.gross_pay || 0
    totalFederalWithholding += emp.federal_withholding || 0
    totalSSWages += emp.social_security_wages || 0
    totalMedicareWages += emp.medicare_wages || 0
  })

  // Calculate taxes
  const socialSecurityTax = totalSSWages * 0.124 // 12.4% (employer + employee)
  const medicareTax = totalMedicareWages * 0.029 // 2.9% (employer + employee)
  const totalTaxes = totalFederalWithholding + socialSecurityTax + medicareTax

  return {
    number_of_employees: employees.length,
    wages_tips_compensation: totalWages,
    federal_income_tax_withheld: totalFederalWithholding,
    taxable_social_security_wages: totalSSWages,
    social_security_tax: socialSecurityTax,
    taxable_medicare_wages_tips: totalMedicareWages,
    medicare_tax: medicareTax,
    total_taxes_before_adjustments: totalTaxes,
    total_taxes_after_adjustments: totalTaxes,
    validation_passed: false,
    filing_status: "draft",
  }
}
