import { Suspense } from "react"
import { BankFeedReconcileClient } from "@/components/accounting/bank-feed-reconcile-client"

export default function BankFeedReconcilePage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <BankFeedReconcileClient feedId={params.id} />
      </Suspense>
    </div>
  )
}
