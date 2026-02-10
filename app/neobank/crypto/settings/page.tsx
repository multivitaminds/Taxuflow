import { CashflowSidebar } from "@/components/cashflow-sidebar"
import { CryptoSettings } from "@/components/cashflow/crypto-settings"

export default function CryptoSettingsPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <CashflowSidebar />
      <div className="ml-64 p-8">
        <CryptoSettings />
      </div>
    </div>
  )
}
