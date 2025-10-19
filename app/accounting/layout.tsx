import type React from "react"
import { AccountingSidebar } from "@/components/accounting-sidebar"

export default function AccountingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AccountingSidebar />
      <main className="flex-1 ml-64">{children}</main>
    </div>
  )
}
