import { Suspense } from "react"
import { VendorsClient } from "@/components/vendors-client"

export default function VendorsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading vendors...</div>}>
      <VendorsClient />
    </Suspense>
  )
}
