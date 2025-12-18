import { Suspense } from "react"
import { CustomerRiskHub } from "@/components/risk/customer-risk-hub"

export default function CustomerRiskPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      }
    >
      <CustomerRiskHub />
    </Suspense>
  )
}
