import { getUserProfile } from "@/app/actions/get-user-profile"
import { getUser } from "@/app/actions/get-user"
import { TaxOptimizerDashboard } from "@/components/investment/tax-optimizer-dashboard"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TaxOptimizerPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login?redirectTo=/investment/tax-optimizer")
  }

  const profile = await getUserProfile(user.id)

  return <TaxOptimizerDashboard user={user} profile={profile} />
}
