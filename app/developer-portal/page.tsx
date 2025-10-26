"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DeveloperPortalClient } from "@/components/developer-portal-client"

export default function DeveloperPortalPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <DeveloperPortalClient />
      <Footer />
    </main>
  )
}
