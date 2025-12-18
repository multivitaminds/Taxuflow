import type React from "react"
import { NeobankSidebar } from "@/components/neobank-sidebar"
import { DashboardProvider } from "@/components/dashboard-provider"
import { AppHeader } from "@/components/app-header"
import { getUserProfile } from "@/app/actions/get-user-profile"
import { getUser } from "@/app/actions/get-user"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function NeobankLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (!user) {
    redirect("/login?redirectTo=/neobank")
  }

  const profile = await getUserProfile(user.id)
  const isDemoMode = profile?.subscription_status !== "active"
  const userName = user.email?.split("@")[0] || "User"

  return (
    <DashboardProvider initialUser={user} initialProfile={profile}>
      <div className="min-h-screen bg-white">
        {/* </CHANGE> */}
        <AppHeader userName={userName} isDemoMode={isDemoMode} />

        <div className="flex">
          <NeobankSidebar />
          <main className="flex-1 ml-64 pr-12 pt-6 bg-[#f7f9fc] min-h-[calc(100vh-36px)] transition-all duration-300 ease-in-out">
            {children}
          </main>
          {/* </CHANGE> */}
        </div>
      </div>
    </DashboardProvider>
  )
}
