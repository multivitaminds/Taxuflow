import { Suspense } from "react"
import { UnifiedBankingPortal } from "@/components/unified-banking-portal"

export default function NeobankPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading banking dashboard...</div>}>
      <UnifiedBankingPortal />
    </Suspense>
  )
}
