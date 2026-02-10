import { Suspense } from "react"
import { BillsClient } from "@/components/bills-client"

export default function BillsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading bills...</div>}>
      <BillsClient />
    </Suspense>
  )
}
