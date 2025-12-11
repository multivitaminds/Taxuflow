import { Suspense } from "react"
import { TransactionDetailClient } from "@/components/neobank/transaction-detail-client"

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading transaction details...</div>}>
      <TransactionDetailClient transactionId={params.id} />
    </Suspense>
  )
}
