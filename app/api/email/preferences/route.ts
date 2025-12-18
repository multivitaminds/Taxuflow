import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let { data: prefs, error } = await supabase.from("email_preferences").select("*").eq("user_id", user.id).single()

    if (error || !prefs) {
      // Create default preferences
      const { data: newPrefs, error: insertError } = await supabase
        .from("email_preferences")
        .insert({
          user_id: user.id,
          filing_updates: true,
          document_processing: true,
          invoice_payments: true,
          api_alerts: true,
          tax_reminders: true,
          marketing: false,
        })
        .select()
        .single()

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      prefs = newPrefs
    }

    return NextResponse.json(prefs)
  } catch (error) {
    console.error("[v0] Error fetching email preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const { data, error } = await supabase
      .from("email_preferences")
      .update({
        filing_updates: body.filing_updates,
        document_processing: body.document_processing,
        invoice_payments: body.invoice_payments,
        api_alerts: body.api_alerts,
        tax_reminders: body.tax_reminders,
        marketing: body.marketing,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating email preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
