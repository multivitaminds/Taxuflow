import { Suspense } from "react"
import { InternationalTransfersClient } from "@/components/neobank/international-transfers-client"

export default function InternationalTransfersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading international transfers...</div>}>
      <InternationalTransfersClient />
    </Suspense>
  )
}
