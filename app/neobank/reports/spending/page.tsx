import { Suspense } from "react"
import { SpendingReport } from "@/components/neobank/reports/spending-report"

export default function SpendingReportPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading spending report...</div>}>
      <SpendingReport />
    </Suspense>
  )
}
