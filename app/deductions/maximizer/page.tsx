import { Suspense } from "react"
import { DeductionMaximizer } from "@/components/deductions/deduction-maximizer"

export const metadata = {
  title: "AI Deduction Maximizer | Taxu",
  description: "Industry-specific deduction finder with audit defense optimization",
}

export default function DeductionMaximizerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="p-8">Loading deduction maximizer...</div>}>
        <DeductionMaximizer />
      </Suspense>
    </div>
  )
}
