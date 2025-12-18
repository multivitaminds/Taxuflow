import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { RevenueBreakdownClient } from "@/components/revenue-breakdown-client"

export default async function RevenuePage() {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect("/login")
    }

    const { data: invoices } = await supabase
      .from("invoices")
      .select("*, customers(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    return <RevenueBreakdownClient invoices={invoices || []} />
  } catch (error) {
    console.log("[v0] Auth error:", error)
    redirect("/login")
  }
}
