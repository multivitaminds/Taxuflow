import { CashflowSidebar } from "@/components/cashflow-sidebar"
import { AtmLocator } from "@/components/cashflow/atm-locator"

export default function AtmsPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <CashflowSidebar />
      <div className="ml-64 p-8">
        <AtmLocator />
      </div>
    </div>
  )
}
