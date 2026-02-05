import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RateLimitsClient } from "@/components/rate-limits-client"

export default function RateLimitsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-20">
        <RateLimitsClient />
      </div>
      <Footer />
    </main>
  )
}
