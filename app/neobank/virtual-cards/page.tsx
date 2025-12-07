import { Suspense } from "react"
import { VirtualCardsClient } from "@/components/neobank/virtual-cards-client"

export default function VirtualCardsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading virtual cards...</div>}>
      <VirtualCardsClient />
    </Suspense>
  )
}
