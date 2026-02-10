import type React from "react"
import { CashflowSidebar } from "@/components/cashflow-sidebar"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function CashflowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f7f9fc]">
      <CashflowSidebar />
      <main className="flex-1 ml-64 transition-all duration-300 ease-in-out">{children}</main>
    </div>
  )
}
