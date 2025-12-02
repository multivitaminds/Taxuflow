import type React from "react"
import { InvestmentSidebar } from "@/components/investment-sidebar"
import { DashboardProvider } from "@/components/dashboard-provider"
import { AppHeader } from "@/components/app-header"
import { getUserProfile } from "@/app/actions/get-user-profile"
import { getUser } from "@/app/actions/get-user"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function InvestmentLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (!user) {
    redirect("/login?redirectTo=/investment")
  }

  const profile = await getUserProfile(user.id)
  const isDemoMode = profile?.subscription_status !== "active"
  const userName = user.email?.split("@")[0] || "User"

  return (
    <DashboardProvider initialUser={user} initialProfile={profile}>
      <div className="min-h-screen bg-[#f7f9fc]">
        <AppHeader userName={userName} isDemoMode={isDemoMode} />

        <div className="flex">
          <InvestmentSidebar />
          <main className="flex-1 ml-64 pr-12 transition-all duration-300 ease-in-out">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  )
}
