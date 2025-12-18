import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createEFileProvider } from "@/lib/efile/provider-factory"

export async function GET(req: NextRequest) {
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

    const searchParams = req.nextUrl.searchParams
    const filingId = searchParams.get("filingId")
    const submissionId = searchParams.get("submissionId")

    if (!filingId && !submissionId) {
      return NextResponse.json({ error: "Filing ID or Submission ID required" }, { status: 400 })
    }

    // Get filing record from database
    let query = supabase.from("tax_filings").select("*").eq("user_id", user.id)

    if (filingId) {
      query = query.eq("id", filingId)
    } else if (submissionId) {
      query = query.eq("submission_id", submissionId)
    }

    const { data: filing, error: dbError } = await query.single()

    if (dbError || !filing) {
      return NextResponse.json({ error: "Filing not found" }, { status: 404 })
    }

    // Get latest status from provider
    const provider = createEFileProvider()
    const status = await provider.getFilingStatus(filing.submission_id)

    // Update database with latest status
    if (status.status !== filing.filing_status) {
      await supabase
        .from("tax_filings")
        .update({
          filing_status: status.status,
          irs_status: status.irsStatus,
          state_status: status.stateStatus,
          accepted_at: status.acceptedAt,
          rejected_at: status.rejectedAt,
          rejection_reasons: status.rejectionReasons,
          updated_at: new Date().toISOString(),
        })
        .eq("id", filing.id)
    }

    return NextResponse.json({
      filingId: filing.id,
      submissionId: filing.submission_id,
      status: status.status,
      irsStatus: status.irsStatus,
      stateStatus: status.stateStatus,
      acceptedAt: status.acceptedAt,
      rejectedAt: status.rejectedAt,
      rejectionReasons: status.rejectionReasons,
      refundStatus: status.refundStatus,
      filedAt: filing.filed_at,
    })
  } catch (error) {
    console.error("[v0] Status check error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
