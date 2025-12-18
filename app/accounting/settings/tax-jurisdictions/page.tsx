import { Suspense } from "react"
import { TaxJurisdictionsClient } from "@/components/tax-jurisdictions-client"

export default function TaxJurisdictionsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <TaxJurisdictionsClient />
    </Suspense>
  )
}
