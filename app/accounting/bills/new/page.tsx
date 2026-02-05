import { Suspense } from "react"
import { NewBillClient } from "./NewBillClient"

export default function NewBillPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      }
    >
      <NewBillClient />
    </Suspense>
  )
}
