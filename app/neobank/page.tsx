import { Suspense } from "react"
import { CashflowDashboard } from "@/components/cashflow/cashflow-dashboard"

export default function CashflowPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading Cashflow dashboard...</div>}>
      <CashflowDashboard />
    </Suspense>
  )
}
