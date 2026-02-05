import { Suspense } from "react"
import { NeobankDashboard } from "@/components/neobank/neobank-dashboard"

export default function NeobankPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading banking dashboard...</div>}>
      <NeobankDashboard />
    </Suspense>
  )
}
