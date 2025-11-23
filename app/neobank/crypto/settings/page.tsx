import { NeobankSidebar } from "@/components/neobank-sidebar"
import { CryptoSettings } from "@/components/neobank/crypto-settings"

export default function CryptoSettingsPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <NeobankSidebar />
      <div className="ml-64 p-8">
        <CryptoSettings />
      </div>
    </div>
  )
}
