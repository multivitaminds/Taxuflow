import { StripeIntegration } from "@/components/integrations/stripe-integration"

export const metadata = {
  title: "Stripe Integration - Taxu",
  description: "Manage Stripe payments and subscriptions",
}

export default function StripeIntegrationPage() {
  return (
    <div className="container mx-auto py-8">
      <StripeIntegration />
    </div>
  )
}
