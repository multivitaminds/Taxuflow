import { Suspense } from "react"
import { TaxStrategyPlanner } from "@/components/tax-strategy/tax-strategy-planner"

export default function TaxStrategyPlannerPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Tax Strategy Planner...</div>}>
      <TaxStrategyPlanner />
    </Suspense>
  )
}
