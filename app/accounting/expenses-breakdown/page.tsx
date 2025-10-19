import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ExpensesBreakdownClient } from "@/components/expenses-breakdown-client"

export default async function ExpensesBreakdownPage() {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect("/login")
    }

    const { data: expenses } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("expense_date", { ascending: false })

    return <ExpensesBreakdownClient expenses={expenses || []} />
  } catch (error) {
    console.log("[v0] Auth error:", error)
    redirect("/login")
  }
}
