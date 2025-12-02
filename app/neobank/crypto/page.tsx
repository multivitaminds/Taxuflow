import { Suspense } from "react"
import { CryptoDashboard } from "@/components/neobank/crypto-dashboard"

export default function CryptoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading crypto dashboard...</div>}>
      <CryptoDashboard />
    </Suspense>
  )
}
