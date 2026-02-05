import { Suspense } from "react"
import TransactionDetailClient from "./TransactionDetailClient"

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <Suspense fallback={<div>Loading transaction...</div>}>
        <TransactionDetailClient transactionId={params.id} />
      </Suspense>
    </div>
  )
}
