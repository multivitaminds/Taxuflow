import type { Metadata } from "next"
import { NeobankLayout } from "@/components/neobank-layout"
import { BusinessBankingClient } from "@/components/neobank/business-banking-client"

export const metadata: Metadata = {
  title: "Business Banking | Taxu Banking",
  description: "Comprehensive banking solutions for your business",
}

export default function BusinessBankingPage() {
  return (
    <NeobankLayout>
      <BusinessBankingClient />
    </NeobankLayout>
  )
}
