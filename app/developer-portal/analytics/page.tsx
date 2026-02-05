import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AnalyticsClient } from "@/components/analytics-client"

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-20">
        <AnalyticsClient />
      </div>
      <Footer />
    </main>
  )
}
