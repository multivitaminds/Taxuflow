import { Suspense } from "react"
import { CryptoTradingPlatform } from "@/components/neobank/crypto-trading-platform"

export default function CryptoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading crypto dashboard...</div>}>
      <CryptoTradingPlatform />
    </Suspense>
  )
}
