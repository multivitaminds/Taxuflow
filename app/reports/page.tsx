import { Suspense } from "react"
import ReportGenerationHub from "@/components/reports/report-generation-hub"

export default function ReportsHubPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportGenerationHub />
    </Suspense>
  )
}
