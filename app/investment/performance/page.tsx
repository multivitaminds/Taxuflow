import { getUserProfile } from "@/app/actions/get-user-profile"
import { getUser } from "@/app/actions/get-user"
import { PerformanceDashboard } from "@/components/investment/performance-dashboard"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PerformancePage() {
  const user = await getUser()

  if (!user) {
    redirect("/login?redirectTo=/investment/performance")
  }

  const profile = await getUserProfile(user.id)

  return <PerformanceDashboard user={user} profile={profile} />
}
