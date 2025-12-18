import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProfitBreakdownClient } from "@/components/profit-breakdown-client"

export default async function ProfitBreakdownPage() {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect("/login")
    }

    const [{ data: invoices }, { data: expenses }] = await Promise.all([
      supabase.from("invoices").select("*").eq("user_id", user.id),
      supabase.from("expenses").select("*").eq("user_id", user.id),
    ])

    return <ProfitBreakdownClient invoices={invoices || []} expenses={expenses || []} />
  } catch (error) {
    console.log("[v0] Auth error:", error)
    redirect("/login")
  }
}
