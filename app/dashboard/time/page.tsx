import { Suspense } from "react"
import { TimeTrackingDashboard } from "@/components/time/time-tracking-dashboard"

export default function TimePage() {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<div>Loading time tracking...</div>}>
        <TimeTrackingDashboard />
      </Suspense>
    </div>
  )
}
