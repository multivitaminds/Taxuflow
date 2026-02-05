import type React from "react"
import { AccountingSidebar } from "@/components/accounting-sidebar"
import { AppHeader } from "@/components/app-header"
import { EnvironmentBanner } from "@/components/environment-banner"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AccountingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/accounting")
  }

  const userName = user.email?.split("@")[0] || "User"

  return (
    <>
      <EnvironmentBanner />
      <div className="min-h-screen bg-white">
        <AppHeader userName={userName} isDemoMode={false} />
        <div className="flex">
          <AccountingSidebar />
          <main className="flex-1 ml-64 pr-8 pt-6 pb-8">{children}</main>
        </div>
      </div>
    </>
  )
}
