import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { webhook_type, webhook_code, item_id } = body

    console.log("[v0] Plaid webhook received:", { webhook_type, webhook_code, item_id })

    const supabase = await createServerClient()

    // Handle different webhook types for business financial management
    switch (webhook_type) {
      case "INCOME":
        // Handle income verification updates
        if (webhook_code === "INCOME_VERIFICATION_STATUS") {
          // Update payroll connection status
          await supabase
            .from("payroll_connections")
            .update({
              connection_status: "active",
              last_synced_at: new Date().toISOString(),
            })
            .eq("plaid_item_id", item_id)
        }
        break

      case "EMPLOYMENT":
        // Handle employment data updates
        if (webhook_code === "EMPLOYMENT_DATA_UPDATE") {
          // Trigger payroll sync
          console.log("[v0] Employment data updated for item:", item_id)
        }
        break

      case "ITEM":
        // Handle item status changes
        if (webhook_code === "ERROR") {
          await supabase
            .from("payroll_connections")
            .update({
              connection_status: "error",
              error_message: "Connection error - please reconnect",
            })
            .eq("plaid_item_id", item_id)
        }
        break
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[v0] Plaid webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
