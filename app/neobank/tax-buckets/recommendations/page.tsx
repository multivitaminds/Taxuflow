import { Suspense } from "react"
import { RecommendationsClient } from "@/components/neobank/recommendations-client"

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading recommendations...</div>}>
      <RecommendationsClient />
    </Suspense>
  )
}
