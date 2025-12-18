import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { OutstandingClient } from "@/components/outstanding-client"

export default async function OutstandingPage() {
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
      .neq("status", "paid")
      .neq("status", "cancelled")
      .order("due_date", { ascending: true })

    return <OutstandingClient invoices={invoices || []} />
  } catch (error) {
    console.log("[v0] Auth error:", error)
    redirect("/login")
  }
}
