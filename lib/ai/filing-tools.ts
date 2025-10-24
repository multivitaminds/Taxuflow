import { tool } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export const filingStatusTool = tool({
  description:
    "Get the current status of a tax return filing, including IRS acceptance status, refund status, and estimated timeline",
  parameters: z.object({
    userId: z.string().optional().describe("User ID to check filing status for"),
    filingId: z.string().optional().describe("Specific filing ID to check"),
  }),
  execute: async ({ userId, filingId }) => {
    const supabase = await createClient()

    let query = supabase.from("tax_filings").select("*").order("created_at", { ascending: false })

    if (filingId) {
      query = query.eq("id", filingId)
    } else if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: filings, error } = await query.limit(1).single()

    if (error || !filings) {
      return {
        success: false,
        message: "No filing found",
      }
    }

    return {
      success: true,
      filing: {
        id: filings.id,
        status: filings.status,
        provider_status: filings.provider_status,
        submitted_at: filings.submitted_at,
        irs_accepted_at: filings.irs_accepted_at,
        refund_amount: filings.refund_amount,
        refund_status: filings.refund_status,
        estimated_refund_date: filings.estimated_refund_date,
      },
      statusMessage: getStatusMessage(filings.status, filings.provider_status),
    }
  },
})

export const filingHistoryTool = tool({
  description: "Get the filing history for a user, including all past returns and their statuses",
  parameters: z.object({
    userId: z.string().describe("User ID to get filing history for"),
    limit: z.number().optional().default(5).describe("Number of filings to return"),
  }),
  execute: async ({ userId, limit }) => {
    const supabase = await createClient()

    const { data: filings, error } = await supabase
      .from("tax_filings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      return {
        success: false,
        message: "Failed to fetch filing history",
      }
    }

    return {
      success: true,
      filings: filings.map((f) => ({
        id: f.id,
        tax_year: f.tax_year,
        status: f.status,
        submitted_at: f.submitted_at,
        refund_amount: f.refund_amount,
        refund_status: f.refund_status,
      })),
    }
  },
})

export const estimatedTimelineTool = tool({
  description:
    "Calculate estimated timeline for tax return processing and refund based on current IRS processing times",
  parameters: z.object({
    filingMethod: z.enum(["efile", "paper"]).describe("How the return was filed"),
    refundMethod: z.enum(["direct_deposit", "check"]).describe("How the refund will be received"),
    filingDate: z.string().optional().describe("Date the return was filed (ISO format)"),
  }),
  execute: async ({ filingMethod, refundMethod, filingDate }) => {
    const filed = filingDate ? new Date(filingDate) : new Date()

    // E-file processing times
    const efileAcceptance = 1 // 24 hours
    const efileProcessing = filingMethod === "efile" ? 21 : 42 // 21 days for e-file, 42 for paper
    const refundDelay = refundMethod === "direct_deposit" ? 0 : 7 // 7 extra days for check

    const acceptanceDate = new Date(filed)
    acceptanceDate.setDate(acceptanceDate.getDate() + efileAcceptance)

    const refundDate = new Date(filed)
    refundDate.setDate(refundDate.getDate() + efileProcessing + refundDelay)

    return {
      success: true,
      timeline: {
        filed_date: filed.toISOString(),
        expected_acceptance: acceptanceDate.toISOString(),
        expected_refund: refundDate.toISOString(),
        total_days: efileProcessing + refundDelay,
        filing_method: filingMethod,
        refund_method: refundMethod,
      },
      message: `Your return should be accepted within ${efileAcceptance} day${efileAcceptance > 1 ? "s" : ""}, and you can expect your refund in approximately ${efileProcessing + refundDelay} days via ${refundMethod === "direct_deposit" ? "direct deposit" : "paper check"}.`,
    }
  },
})

function getStatusMessage(status: string, providerStatus: string | null): string {
  switch (status) {
    case "pending":
      return "Your return is being prepared for submission to the IRS."
    case "submitted":
      return "Your return has been submitted to the IRS and is awaiting acceptance."
    case "accepted":
      return "Great news! The IRS has accepted your return and is processing it."
    case "processing":
      return "The IRS is processing your return. Your refund should be issued soon."
    case "refund_approved":
      return "Your refund has been approved! It should arrive in your account within 5 business days."
    case "refund_sent":
      return "Your refund has been sent! Check your bank account for the deposit."
    case "rejected":
      return `Your return was rejected by the IRS. Reason: ${providerStatus || "Unknown"}. Please review and resubmit.`
    case "failed":
      return "There was an error submitting your return. Please contact support."
    default:
      return "Status unknown. Please contact support for assistance."
  }
}
