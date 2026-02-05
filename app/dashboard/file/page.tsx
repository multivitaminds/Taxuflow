import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TaxFilingHubClient } from "@/components/tax-filing-hub-client"

export default async function TaxFilingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <TaxFilingHubClient />
}
