import { Suspense } from "react"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import { ExpensesClient } from "@/components/expenses-client"

export default function ExpensesPage() {
  return (
    <>
      <DemoModeBanner isDemoMode={true} />
      <Suspense
        fallback={
          <div className="min-h-screen bg-background p-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-48"></div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        }
      >
        <ExpensesClient />
      </Suspense>
    </>
  )
}
