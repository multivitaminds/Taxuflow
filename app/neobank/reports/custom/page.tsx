import { Suspense } from "react"
import { CustomReportBuilder } from "@/components/neobank/custom-report-builder"

export default function CustomReportPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading report builder...</div>}>
      <CustomReportBuilder />
    </Suspense>
  )
}
