import { Suspense } from "react"
import { IncomeReport } from "@/components/neobank/reports/income-report"

export default function IncomeReportPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading income report...</div>}>
      <IncomeReport />
    </Suspense>
  )
}
