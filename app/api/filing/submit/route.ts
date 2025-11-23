import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createEFileProvider } from "@/lib/efile/provider-factory"
import type { TaxReturn } from "@/lib/efile/types"
import { encrypt } from "@/lib/crypto"
import { handleApiError, ApiError, ErrorCode } from "@/lib/errors"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new ApiError("Unauthorized", ErrorCode.UNAUTHORIZED)
    }

    const body = await req.json()
    const { taxReturn, bankInfo, consent } = body as {
      taxReturn: TaxReturn
      bankInfo: { routingNumber: string; accountNumber: string; accountType: "checking" | "savings" }
      consent: boolean
    }

    if (!consent) {
      throw new ApiError("User consent required for tax filing", ErrorCode.VALIDATION_ERROR)
    }

    if (!taxReturn || !bankInfo) {
      throw new ApiError("Missing required fields: taxReturn and bankInfo", ErrorCode.VALIDATION_ERROR)
    }

    if (!/^\d{9}$/.test(bankInfo.routingNumber)) {
      throw new ApiError("Invalid routing number format. Must be 9 digits", ErrorCode.VALIDATION_ERROR)
    }

    if (!/^\d{4,17}$/.test(bankInfo.accountNumber)) {
      throw new ApiError("Invalid account number format. Must be 4-17 digits", ErrorCode.VALIDATION_ERROR)
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

    const encryptedRouting = encrypt(bankInfo.routingNumber)
    const encryptedAccount = encrypt(bankInfo.accountNumber)

    // Store filing record in database
    const { data: filing, error: dbError } = await supabase
      .from("tax_filings")
      .insert({
        user_id: user.id,
        tax_year: taxReturn.taxYear,
        filing_status: result.status,
        submission_id: result.submissionId,
        refund_amount: taxReturn.refund.federalRefund + taxReturn.refund.stateRefund,
        bank_routing: encryptedRouting,
        bank_account: encryptedAccount,
        bank_account_type: bankInfo.accountType,
        filed_at: new Date().toISOString(),
        provider_name: provider.name,
        provider_response: result,
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      throw new ApiError(`Failed to save filing record: ${dbError.message}`, ErrorCode.DATABASE_ERROR)
    }

    await supabase.from("admin_activity_logs").insert({
      admin_id: user.id,
      action: "filing_submission",
      resource_type: "tax_filing",
      details: {
        filing_id: filing.id,
        submission_id: result.submissionId,
        tax_year: taxReturn.taxYear,
        status: result.status,
      },
    })

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
    return handleApiError(error)
  }
}
