import { Suspense } from "react"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import { CardsManager } from "@/components/neobank/cards-manager"

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <DemoModeBanner />
      <Suspense fallback={<div className="p-8">Loading cards...</div>}>
        <CardsManager />
      </Suspense>
    </div>
  )
}
