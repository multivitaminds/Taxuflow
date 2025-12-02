import { Suspense } from "react"
import { WalletManager } from "@/components/neobank/wallet-manager"

export default function AccountsPage() {
  return (
    <div className="mt-8">
      <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading accounts...</div>}>
        <WalletManager />
      </Suspense>
    </div>
  )
}
