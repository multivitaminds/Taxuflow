import { Suspense } from "react"
import ComparativeReportsClient from "@/components/comparative-reports-client"

export default function ComparativeReportsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading comparative reports...</div>}>
      <ComparativeReportsClient />
    </Suspense>
  )
}
