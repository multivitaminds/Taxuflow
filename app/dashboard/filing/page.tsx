import { redirect } from 'next/navigation'
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { FilingDashboardClient } from "@/components/filing-dashboard-client"

export const dynamic = 'force-dynamic'

export default async function FilingDashboardPage() {
  console.log("[v0] Filing page: Starting to load")
  
  const cookieStore = await cookies()
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true"
  
  if (isDemoMode) {
    console.log("[v0] Filing page: Using demo mode, showing demo filings")
    const demoUser = {
      id: "demo-user-id",
      email: "demo@taxu.com",
    }
    
    const demoFilings = [
      {
        id: "demo-filing-1",
        tax_year: 2024,
        form_type: "W-2" as const,
        filing_status: "accepted" as const,
        submission_id: "DEMO-W2-2024-001",
        irs_status: "accepted",
        refund_amount: 1250,
        filed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        accepted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        rejected_at: null,
        rejection_reasons: null,
        provider_name: "IRS E-File",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-filing-2",
        tax_year: 2024,
        form_type: "1099-NEC" as const,
        filing_status: "pending" as const,
        submission_id: "DEMO-1099-2024-001",
        irs_status: "pending",
        refund_amount: null,
        filed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        accepted_at: null,
        rejected_at: null,
        rejection_reasons: null,
        provider_name: "IRS E-File",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
    
    return <FilingDashboardClient user={demoUser as any} filings={demoFilings} />
  }

  let supabase
  try {
    supabase = await createClient()
  } catch (error) {
    console.error("[v0] Filing page: Error creating Supabase client:", error)
    redirect("/login?redirect=/dashboard/filing")
  }

  if (!supabase) {
    console.log("[v0] Filing page: No Supabase client, redirecting to login")
    redirect("/login?redirect=/dashboard/filing")
  }

  let user
  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      console.log("[v0] Filing page: No authenticated user, redirecting to login", authError)
      redirect("/login?redirect=/dashboard/filing")
    }
    
    user = authUser
  } catch (error) {
    console.error("[v0] Filing page: Error getting user:", error)
    redirect("/login?redirect=/dashboard/filing")
  }

  let w2Filings = []
  let nec1099Filings = []
  
  try {
    const { data: w2Data, error: w2Error } = await supabase
      .from("w2_filings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (w2Error) {
      console.error("[v0] Error fetching W-2 filings:", w2Error)
    } else {
      w2Filings = w2Data || []
    }
  } catch (error) {
    console.error("[v0] Exception fetching W-2 filings:", error)
  }

  try {
    const { data: necData, error: necError } = await supabase
      .from("nec_1099_filings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (necError) {
      console.error("[v0] Error fetching 1099-NEC filings:", necError)
    } else {
      nec1099Filings = necData || []
    }
  } catch (error) {
    console.error("[v0] Exception fetching 1099-NEC filings:", error)
  }

  console.log(
    `[v0] Fetched ${w2Filings.length} W-2 filings and ${nec1099Filings.length} 1099-NEC filings for user ${user.id}`,
  )

  const transformedW2Filings = w2Filings.map((filing) => {
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
      provider_name: "IRS E-File",
      created_at: filing.created_at,
      updated_at: filing.updated_at,
    }
  })

  const transformedNecFilings = nec1099Filings.map((filing) => ({
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
    provider_name: "IRS E-File",
    created_at: filing.created_at,
    updated_at: filing.updated_at,
  }))

  const allFilings = [...transformedW2Filings, ...transformedNecFilings].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  console.log(`[v0] Filing page: Rendering with ${allFilings.length} total filings`)
  
  return <FilingDashboardClient user={user} filings={allFilings} />
}
