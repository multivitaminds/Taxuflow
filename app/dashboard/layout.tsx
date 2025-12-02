import type React from "react"
import { DashboardProvider } from "@/components/dashboard-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getUser } from "@/app/actions/get-user"
import { getUserProfile } from "@/app/actions/get-user-profile"
import { redirect } from "next/navigation"
import { DemoModeBanner } from "@/components/demo-mode-banner"

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  try {
    const user = await getUser()

    if (!user) {
      redirect("/login")
    }

    const profile = await getUserProfile()

    const isDemoMode = profile?.user_type === "demo" || profile?.subscription_tier === "free"

    return (
      <DashboardProvider initialUser={user} initialProfile={profile}>
        <DashboardLayout demoBanner={<DemoModeBanner isDemoMode={isDemoMode} userName={user.email} />}>
          {children}
        </DashboardLayout>
      </DashboardProvider>
    )
  } catch (error) {
    console.error("[v0] Dashboard layout error:", error)
    redirect("/login?error=session_expired")
  }
}
