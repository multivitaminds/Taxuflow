import { PlaidConnect } from "@/components/integrations/plaid-connect"

export const metadata = {
  title: "Plaid Integration - Taxu",
  description: "Connect your bank accounts securely with Plaid",
}

export default function PlaidIntegrationPage() {
  return (
    <div className="container mx-auto py-8">
      <PlaidConnect />
    </div>
  )
}
