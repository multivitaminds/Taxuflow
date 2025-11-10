import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import FilingDetailClient from "@/components/filing-detail-client"

export default async function FilingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const { data: w2Filing, error } = await supabase
    .from("w2_filings")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !w2Filing) {
    console.error("[v0] Filing not found:", error)
    notFound()
  }

  const filing = {
    id: w2Filing.id,
    tax_year: w2Filing.tax_year,
    filing_status: w2Filing.taxbandits_status || "pending",
    provider_name: "TaxBandits",
    submission_id: w2Filing.submission_id || "",
    irs_status: w2Filing.irs_status || "pending",
    state_status: null,
    rejection_reasons: w2Filing.rejection_reasons || [],
    refund_amount: null, // W-2s don't have refunds
    filed_at: w2Filing.submitted_at,
    accepted_at: w2Filing.accepted_at,
    rejected_at: w2Filing.rejected_at,
    provider_response: w2Filing.provider_response,
  }

  return <FilingDetailClient filing={filing} />
}
