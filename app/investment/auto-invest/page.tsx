import { getUserProfile } from "@/app/actions/get-user-profile"
import { getUser } from "@/app/actions/get-user"
import { AutoInvestDashboard } from "@/components/investment/auto-invest-dashboard"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AutoInvestPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login?redirectTo=/investment/auto-invest")
  }

  const profile = await getUserProfile(user.id)

  return <AutoInvestDashboard user={user} profile={profile} />
}
