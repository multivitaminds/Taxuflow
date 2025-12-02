import { Suspense } from "react"
import { TransfersManager } from "@/components/neobank/transfers-manager"

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading transactions...</div>}>
      <TransfersManager />
    </Suspense>
  )
}
