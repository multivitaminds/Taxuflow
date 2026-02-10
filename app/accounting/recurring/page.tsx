import { Suspense } from "react"
import { RecurringTransactionsClient } from "@/components/recurring-transactions-client"

export default function RecurringTransactionsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading recurring transactions...</div>}>
      <RecurringTransactionsClient />
    </Suspense>
  )
}
