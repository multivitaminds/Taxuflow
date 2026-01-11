import { Suspense } from "react"
import { TransactionDetailClient } from "@/components/neobank/transaction-detail-client"

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading transaction details...</div>}>
      <TransactionDetailClient transactionId={resolvedParams.id} />
    </Suspense>
  )
}
