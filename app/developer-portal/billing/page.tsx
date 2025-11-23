import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BillingClient } from "@/components/billing-client"

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-20">
        <BillingClient />
      </div>
      <Footer />
    </main>
  )
}
