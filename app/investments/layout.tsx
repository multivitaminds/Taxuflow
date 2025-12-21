import type React from "react"
import { InvestmentsSidebar } from "@/components/investments-sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function InvestmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/investments")
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-14">
      <InvestmentsSidebar />
      <main className="flex-1 ml-64 pr-12 pt-6">{children}</main>
    </div>
  )
}
