import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DeveloperPortalSidebar } from "@/components/developer-portal-sidebar"

export default function DeveloperPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="flex flex-1 pt-16">
        <DeveloperPortalSidebar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
