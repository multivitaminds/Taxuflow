import { Suspense } from "react"
import EstimatesClient from "@/components/estimates-client"

export default function EstimatesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading estimates...</div>}>
      <EstimatesClient />
    </Suspense>
  )
}
