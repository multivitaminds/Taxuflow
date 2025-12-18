import { getUserProfile } from "@/app/actions/get-user-profile"
import { getUser } from "@/app/actions/get-user"
import { InvestingDashboard } from "@/components/investment/investing-dashboard"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function InvestmentPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login?redirectTo=/investment")
  }

  const profile = await getUserProfile(user.id)

  return <InvestingDashboard user={user} profile={profile} />
}
