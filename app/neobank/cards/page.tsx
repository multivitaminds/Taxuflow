import { Suspense } from "react"
import { CardsManager } from "@/components/neobank/cards-manager"

export default function CardsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading cards...</div>}>
      <CardsManager />
    </Suspense>
  )
}
