import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { plaidClient } from "@/lib/plaid-client"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { connectionId } = await request.json()

    // Get payroll connection
    const { data: connection, error: connError } = await supabase
      .from("payroll_connections")
      .select("*")
      .eq("id", connectionId)
      .eq("user_id", user.id)
      .single()

    if (connError || !connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 })
    }

    // Fetch payroll data from Plaid
    const payrollData = await plaidClient.getPayrollData(connection.plaid_access_token)
    const employeeData = await plaidClient.getEmployeeData(connection.plaid_access_token)

    // Process and store W-2 data
    const w2Forms = []

    for (const income of payrollData.income?.items || []) {
      const w2Data = {
        user_id: user.id,
        payroll_connection_id: connectionId,
        source: "payroll_sync",
        tax_year: new Date().getFullYear() - 1,

        // Employer info
        employer_name: income.employer?.name || "",
        employer_ein: income.employer?.ein || "",
        employer_address: income.employer?.address?.street || "",
        employer_city: income.employer?.address?.city || "",
        employer_state: income.employer?.address?.state || "",
        employer_zip: income.employer?.address?.postal_code || "",

        // Employee info
        employee_first_name: income.employee?.first_name || "",
        employee_last_name: income.employee?.last_name || "",
        employee_ssn_encrypted: income.employee?.ssn || "",

        // Wage info
        wages: income.ytd_gross_income || 0,
        federal_withholding: income.ytd_federal_withholding || 0,
        social_security_wages: income.ytd_gross_income || 0,
        social_security_withholding: income.ytd_social_security_withholding || 0,
        medicare_wages: income.ytd_gross_income || 0,
        medicare_withholding: income.ytd_medicare_withholding || 0,
        state_wages: income.ytd_state_gross_income || 0,
        state_withholding: income.ytd_state_withholding || 0,
        state_code: income.employer?.address?.state || "",

        filing_status: "draft",
      }

      w2Forms.push(w2Data)
    }

    // Insert W-2 forms
    const { data: insertedForms, error: insertError } = await supabase.from("w2_forms").insert(w2Forms).select()

    if (insertError) throw insertError

    // Update connection sync time
    await supabase
      .from("payroll_connections")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", connectionId)

    return NextResponse.json({
      success: true,
      formsCreated: insertedForms.length,
      forms: insertedForms,
    })
  } catch (error: any) {
    console.error("[v0] Payroll sync error:", error)
    return NextResponse.json({ error: error.message || "Failed to sync payroll data" }, { status: 500 })
  }
}
