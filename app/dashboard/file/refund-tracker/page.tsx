import { Suspense } from "react"
import { RefundTrackerClient } from "@/components/refund-tracker-client"

export default function RefundTrackerPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <RefundTrackerClient />
    </Suspense>
  )
}
