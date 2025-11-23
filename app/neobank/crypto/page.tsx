import { NeobankSidebar } from "@/components/neobank-sidebar"
import { CryptoDashboard } from "@/components/neobank/crypto-dashboard"

export default function CryptoPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <NeobankSidebar />
      <div className="ml-64 p-8">
        <CryptoDashboard />
      </div>
    </div>
  )
}
