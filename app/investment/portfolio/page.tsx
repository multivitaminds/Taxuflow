import { getUserProfile } from "@/app/actions/get-user-profile"
import { getUser } from "@/app/actions/get-user"
import { PortfolioDashboard } from "@/components/investment/portfolio-dashboard"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PortfolioPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login?redirectTo=/investment/portfolio")
  }

  const profile = await getUserProfile(user.id)

  return <PortfolioDashboard user={user} profile={profile} />
}
