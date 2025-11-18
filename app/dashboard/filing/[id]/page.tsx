import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from 'next/navigation'
import FilingDetailClient from "@/components/filing-detail-client"

export default async function FilingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (id === "new") {
    redirect("/dashboard/filing")
  }

  const supabase = await createClient()

  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let filing = null
  let formType = "W-2"

  const { data: w2Filing } = await supabase.from("w2_filings").select("*").eq("id", id).eq("user_id", user.id).single()

  if (w2Filing) {
    filing = {
      id: w2Filing.id,
      tax_year: w2Filing.tax_year,
      filing_status: w2Filing.taxbandits_status || "pending",
      provider_name: "IRS E-File", // Removed TaxBandits branding
      submission_id: w2Filing.submission_id || "",
      irs_status: w2Filing.irs_status || "pending",
      state_status: null,
      rejection_reasons: w2Filing.rejection_reasons || [],
      refund_amount: w2Filing.refund_amount || null,
      filed_at: w2Filing.submitted_at,
      accepted_at: w2Filing.accepted_at,
      rejected_at: w2Filing.rejected_at,
      provider_response: null,
    }
    formType = "W-2"
  } else {
    const { data: nec1099Filing } = await supabase
      .from("nec_1099_filings")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (nec1099Filing) {
      filing = {
        id: nec1099Filing.id,
        tax_year: nec1099Filing.tax_year,
        filing_status: nec1099Filing.taxbandits_status || "pending",
        provider_name: "IRS E-File", // Removed TaxBandits branding
        submission_id: nec1099Filing.submission_id || "",
        irs_status: nec1099Filing.irs_status || "pending",
        state_status: null,
        rejection_reasons: nec1099Filing.rejection_reasons || [],
        refund_amount: null,
        filed_at: nec1099Filing.submitted_at,
        accepted_at: nec1099Filing.accepted_at,
        rejected_at: nec1099Filing.rejected_at,
        provider_response: null,
      }
      formType = "1099-NEC"
    }
  }

  if (!filing) {
    console.error("[v0] Filing not found:", id)
    notFound()
  }

  return <FilingDetailClient filing={filing} formType={formType} />
}
