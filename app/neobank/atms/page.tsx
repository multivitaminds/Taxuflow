import { NeobankSidebar } from "@/components/neobank-sidebar"
import { AtmLocator } from "@/components/neobank/atm-locator"

export default function AtmsPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <NeobankSidebar />
      <div className="ml-64 p-8">
        <AtmLocator />
      </div>
    </div>
  )
}
