import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { validateW2Filing, validate1099Filing, validateForm941 } from "@/lib/irs-sim/validation-engine"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { filingId, filingType } = await req.json()

    if (!filingId || !filingType) {
      return NextResponse.json({ error: "Filing ID and type required" }, { status: 400 })
    }

    let validationResult

    // Route to appropriate validator based on form type
    switch (filingType) {
      case "W2": {
        const { data: w2Filing } = await supabase
          .from("w2_filings")
          .select("*")
          .eq("id", filingId)
          .eq("user_id", user.id)
          .single()

        if (!w2Filing) {
          return NextResponse.json({ error: "Filing not found" }, { status: 404 })
        }

        // Get prior year W-2s for comparison
        const { data: priorW2s } = await supabase
          .from("w2_filings")
          .select("*")
          .eq("user_id", user.id)
          .eq("tax_year", w2Filing.tax_year - 1)
          .eq("irs_status", "accepted")

        validationResult = await validateW2Filing(w2Filing, priorW2s || [])
        break
      }

      case "1099-NEC": {
        const { data: nec1099Filing } = await supabase
          .from("nec_1099_filings")
          .select("*")
          .eq("id", filingId)
          .eq("user_id", user.id)
          .single()

        if (!nec1099Filing) {
          return NextResponse.json({ error: "Filing not found" }, { status: 404 })
        }

        const { data: prior1099s } = await supabase
          .from("nec_1099_filings")
          .select("*")
          .eq("user_id", user.id)
          .eq("tax_year", nec1099Filing.tax_year - 1)
          .eq("irs_status", "accepted")

        validationResult = await validate1099Filing(nec1099Filing, prior1099s || [])
        break
      }

      case "941": {
        const { data: form941 } = await supabase
          .from("form_941_filings")
          .select("*, schedule_b_data")
          .eq("id", filingId)
          .eq("user_id", user.id)
          .single()

        if (!form941) {
          return NextResponse.json({ error: "Filing not found" }, { status: 404 })
        }

        validationResult = await validateForm941(form941, form941.schedule_b_data || [])
        break
      }

      default:
        return NextResponse.json({ error: "Unsupported filing type" }, { status: 400 })
    }

    // Store validation result
    await supabase.from("irs_sim_validations").insert({
      user_id: user.id,
      filing_id: filingId,
      filing_type: filingType,
      validation_result: validationResult,
      risk_score: validationResult.riskScore,
      can_file: validationResult.canFile,
      requires_attention: validationResult.requiresAttention,
    })

    return NextResponse.json({
      success: true,
      validation: validationResult,
    })
  } catch (error) {
    console.error("[IRS-Sim] Validation API error:", error)
    return NextResponse.json(
      { error: "Validation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
