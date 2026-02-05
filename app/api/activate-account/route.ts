import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Activating account for user:", user.id)

    const { error: profileError } = await supabase.from("user_profiles").upsert(
      {
        id: user.id,
        email: user.email,
        account_type: "live",
        account_status: "active",
        registration_completed: true,
        live_account_activated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    )

    if (profileError) {
      console.error("[v0] Error upserting profile:", profileError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    console.log("[v0] Profile updated successfully, account_type set to 'live'")

    // Clear demo data from various tables
    const tables = [
      "documents",
      "tax_filings",
      "w2_filings",
      "nec_1099_filings",
      "contacts",
      "customers",
      "vendors",
      "invoices",
      "bills",
      "expenses",
      "neobank_accounts",
      "neobank_transactions",
      "bank_accounts",
      "bank_transactions",
    ]

    for (const table of tables) {
      await supabase.from(table).delete().eq("user_id", user.id)
    }

    console.log("[v0] Account activated successfully for user:", user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error activating account:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
