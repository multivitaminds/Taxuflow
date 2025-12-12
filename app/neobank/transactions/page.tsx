import { Suspense } from "react"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import { TransfersManager } from "@/components/neobank/transfers-manager"

export default function TransactionsPage() {
  return (
    <>
      <DemoModeBanner isDemoMode={true} />
      <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading transactions...</div>}>
        <TransfersManager />
      </Suspense>
    </>
  )
}
