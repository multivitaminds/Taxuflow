import { Suspense } from "react"
import { AllTransactionsClient } from "@/components/neobank/all-transactions-client"

export default function AllTransactionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading all transactions...</div>}>
      <AllTransactionsClient />
    </Suspense>
  )
}
