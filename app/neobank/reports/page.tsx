import { Suspense } from "react"
import { ReportsHub } from "@/components/neobank/reports-hub"

export default function NeobankReportsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading reports...</div>}>
      <ReportsHub />
    </Suspense>
  )
}
