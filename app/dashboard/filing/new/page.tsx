import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NewFilingClient } from "@/components/new-filing-client"

export default async function NewFilingPage() {
  const supabase = await getSupabaseServerClient()

  if (!supabase) {
    redirect("/login")
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      console.error("[v0] Error fetching user in NewFilingPage:", error)
      redirect("/login")
    }

    return <NewFilingClient userId={user.id} />
  } catch (err) {
    console.error("[v0] Exception in NewFilingPage:", err)
    redirect("/login")
  }
}
