import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FilingDashboardClient } from "@/components/filing-dashboard-client"

export default async function FilingDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login?redirect=/dashboard/filing")
  }

  // The W-2 submissions save to w2_filings, not tax_filings
  const { data: filings, error: filingsError } = await supabase
    .from("w2_filings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (filingsError) {
    console.error("[v0] Error fetching W-2 filings:", filingsError)
  }

  console.log(`[v0] Fetched ${filings?.length || 0} W-2 filings for user ${user.id}`)

  const transformedFilings = (filings || []).map((filing) => {
    let refundAmount = null
    if (filing.taxbandits_status === "accepted") {
      const wages = filing.wages || 0
      const federalWithheld = filing.federal_tax_withheld || 0

      // Simple refund calculation
      const standardDeduction = 13850
      const taxableIncome = Math.max(0, wages - standardDeduction)
      const estimatedTax = taxableIncome * 0.1 // 10% bracket

      refundAmount = Math.max(0, Math.round(federalWithheld - estimatedTax))
    }

    return {
      id: filing.id,
      tax_year: filing.tax_year,
      filing_status:
        filing.taxbandits_status === "accepted"
          ? "accepted"
          : filing.taxbandits_status === "rejected"
            ? "rejected"
            : "pending",
      submission_id: filing.submission_id || "",
      irs_status: filing.irs_status,
      refund_amount: refundAmount, // Include calculated refund
      filed_at: filing.submitted_at,
      accepted_at: filing.accepted_at,
      rejected_at: filing.rejected_at,
      rejection_reasons: filing.rejection_reasons,
      provider_name: "TaxBandits",
      created_at: filing.created_at,
      updated_at: filing.updated_at,
    }
  })

  return <FilingDashboardClient user={user} filings={transformedFilings} />
}
