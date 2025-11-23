import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductsDashboardClient } from "@/components/products-dashboard-client"

export default async function ProductsDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <ProductsDashboardClient user={user} />
}
