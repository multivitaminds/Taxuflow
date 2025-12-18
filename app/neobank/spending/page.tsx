import { Suspense } from "react"
import { SpendingAnalyticsEnhanced } from "@/components/neobank/spending-analytics-enhanced"

export default function SpendingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading analytics...</div>}>
      <SpendingAnalyticsEnhanced />
    </Suspense>
  )
}
