import { Suspense } from "react"
import { DeductionsClient } from "@/components/deductions-client"

export default function DeductionsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <DeductionsClient />
    </Suspense>
  )
}
