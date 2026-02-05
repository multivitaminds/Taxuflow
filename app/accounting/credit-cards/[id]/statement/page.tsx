import { Suspense } from "react"
import { CreditCardStatementClient } from "@/components/accounting/credit-card-statement-client"

export default function CreditCardStatementPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <CreditCardStatementClient cardId={params.id} />
      </Suspense>
    </div>
  )
}
