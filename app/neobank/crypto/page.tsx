import { CashflowSidebar } from "@/components/cashflow-sidebar"
import { CryptoDashboard } from "@/components/cashflow/crypto-dashboard"

export default function CryptoPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <CashflowSidebar />
      <div className="ml-64 p-8">
        <CryptoDashboard />
      </div>
    </div>
  )
}
