import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BillingClient } from "@/components/billing-client"
import { requirePaidSubscription } from "@/lib/auth/check-subscription"

export default async function BillingPage() {
  await requirePaidSubscription()

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
