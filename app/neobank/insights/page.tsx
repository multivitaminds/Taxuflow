import { Suspense } from "react"
import { BusinessInsights } from "@/components/neobank/business-insights"

export default function BusinessInsightsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading insights...</div>}>
      <BusinessInsights />
    </Suspense>
  )
}
