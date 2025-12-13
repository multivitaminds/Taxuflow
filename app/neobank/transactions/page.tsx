import { Suspense } from "react"
import { MercuryTransactionsClient } from "@/components/neobank/mercury-transactions-client"

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading transactions...</div>}>
      <MercuryTransactionsClient />
    </Suspense>
  )
}
