import { Suspense } from "react"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import { UnifiedBankingPortal } from "@/components/unified-banking-portal"

export default function NeobankPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <DemoModeBanner isDemoMode={true} />
      <Suspense fallback={<div className="p-8">Loading banking dashboard...</div>}>
        <UnifiedBankingPortal />
      </Suspense>
    </div>
  )
}
