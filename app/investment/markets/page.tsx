import { getUserProfile } from "@/app/actions/get-user-profile"
import { getUser } from "@/app/actions/get-user"
import { MarketsDashboard } from "@/components/investment/markets-dashboard"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function MarketsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login?redirectTo=/investment/markets")
  }

  const profile = await getUserProfile(user.id)

  return <MarketsDashboard user={user} profile={profile} />
}
