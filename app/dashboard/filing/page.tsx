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

  const { data: w2Filings, error: w2Error } = await supabase
    .from("w2_filings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: nec1099Filings, error: necError } = await supabase
    .from("nec_1099_filings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (w2Error) {
    console.error("[v0] Error fetching W-2 filings:", w2Error)
  }

  if (necError) {
    console.error("[v0] Error fetching 1099-NEC filings:", necError)
  }

  console.log(
    `[v0] Fetched ${w2Filings?.length || 0} W-2 filings and ${nec1099Filings?.length || 0} 1099-NEC filings for user ${user.id}`,
  )

  const transformedW2Filings = (w2Filings || []).map((filing) => {
    // Use the refund_amount from database if it exists, otherwise calculate it
    let refundAmount = filing.refund_amount || null

    if (!refundAmount && filing.irs_status === "accepted") {
      const wages = filing.wages || 0
      const federalWithheld = filing.federal_tax_withheld || 0
      const ssWithheld = filing.social_security_tax || 0
      const medicareWithheld = filing.medicare_tax || 0

      // Simple refund calculation
      const standardDeduction = 13850
      const taxableIncome = Math.max(0, wages - standardDeduction)
      const estimatedTax = taxableIncome * 0.1 // 10% bracket
      const totalWithheld = federalWithheld + ssWithheld + medicareWithheld

      refundAmount = Math.max(0, Math.round(totalWithheld - estimatedTax))
    }

    return {
      id: filing.id,
      tax_year: filing.tax_year,
      form_type: "W-2" as const,
      filing_status:
        filing.irs_status === "accepted" ? "accepted" : filing.irs_status === "rejected" ? "rejected" : "pending",
      submission_id: filing.submission_id || "",
      irs_status: filing.irs_status,
      refund_amount: refundAmount,
      filed_at: filing.submitted_at,
      accepted_at: filing.accepted_at,
      rejected_at: filing.rejected_at,
      rejection_reasons: filing.rejection_reasons,
      provider_name: "TaxBandits",
      created_at: filing.created_at,
      updated_at: filing.updated_at,
    }
  })

  const transformedNecFilings = (nec1099Filings || []).map((filing) => ({
    id: filing.id,
    tax_year: filing.tax_year,
    form_type: "1099-NEC" as const,
    filing_status:
      filing.irs_status === "accepted" ? "accepted" : filing.irs_status === "rejected" ? "rejected" : "pending",
    submission_id: filing.submission_id || "",
    irs_status: filing.irs_status,
    refund_amount: null, // 1099-NEC doesn't have refunds
    filed_at: filing.submitted_at,
    accepted_at: filing.accepted_at,
    rejected_at: filing.rejected_at,
    rejection_reasons: filing.rejection_reasons,
    provider_name: "TaxBandits",
    created_at: filing.created_at,
    updated_at: filing.updated_at,
  }))

  const allFilings = [...transformedW2Filings, ...transformedNecFilings].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  return <FilingDashboardClient user={user} filings={allFilings} />
}
