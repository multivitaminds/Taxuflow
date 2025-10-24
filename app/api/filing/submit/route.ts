import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createEFileProvider } from "@/lib/efile/provider-factory"
import type { TaxReturn } from "@/lib/efile/types"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { taxReturn, bankInfo, consent } = body as {
      taxReturn: TaxReturn
      bankInfo: { routingNumber: string; accountNumber: string; accountType: "checking" | "savings" }
      consent: boolean
    }

    // Validate consent
    if (!consent) {
      return NextResponse.json({ error: "User consent required" }, { status: 400 })
    }

    // Validate required fields
    if (!taxReturn || !bankInfo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Filing return for user:", user.id)

    // Add direct deposit info to tax return
    const completeReturn: TaxReturn = {
      ...taxReturn,
      refund: {
        ...taxReturn.refund,
        directDeposit: bankInfo,
      },
    }

    // Submit to e-file provider
    const provider = createEFileProvider()
    const result = await provider.submitReturn(completeReturn)

    // Store filing record in database
    const { data: filing, error: dbError } = await supabase
      .from("tax_filings")
      .insert({
        user_id: user.id,
        tax_year: taxReturn.taxYear,
        filing_status: result.status,
        submission_id: result.submissionId,
        refund_amount: taxReturn.refund.federalRefund + taxReturn.refund.stateRefund,
        bank_routing: bankInfo.routingNumber,
        bank_account: bankInfo.accountNumber,
        bank_account_type: bankInfo.accountType,
        filed_at: new Date().toISOString(),
        provider_name: provider.name,
        provider_response: result,
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json(
        {
          error: "Failed to save filing record",
          details: dbError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Filing submitted successfully:", filing.id)

    return NextResponse.json({
      success: result.success,
      filingId: filing.id,
      submissionId: result.submissionId,
      status: result.status,
      message: result.message,
      errors: result.errors,
      estimatedProcessingTime: result.estimatedProcessingTime,
    })
  } catch (error) {
    console.error("[v0] Filing submission error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
