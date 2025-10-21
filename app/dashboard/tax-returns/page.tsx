import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { TaxReturnsClient } from "@/components/tax-returns-client"

export default async function TaxReturnsPage() {
  const supabase = await getSupabaseServerClient()

  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <TaxReturnsClient />
}
