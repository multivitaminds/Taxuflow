import { Suspense } from "react"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import { WalletManagerEnhanced } from "@/components/neobank/wallet-manager-enhanced"

export default function AccountsPage() {
  return (
    <>
      <DemoModeBanner isDemoMode={true} />
      <div className="mt-8">
        <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading accounts...</div>}>
          <WalletManagerEnhanced />
        </Suspense>
      </div>
    </>
  )
}
