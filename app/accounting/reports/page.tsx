import { Suspense } from "react"
import ReportsClient from "@/components/reports-client"

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading reports...</div>}>
      <ReportsClient />
    </Suspense>
  )
}
