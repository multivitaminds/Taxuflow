import { Suspense } from "react"
import { CashflowReport } from "@/components/neobank/reports/cashflow-report"

export default function CashflowReportPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading cashflow report...</div>}>
      <CashflowReport />
    </Suspense>
  )
}
