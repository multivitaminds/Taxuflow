import { DemoModeBanner } from "@/components/demo-mode-banner"
import { InvestmentDashboard } from "@/components/investments/investment-dashboard"

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <DemoModeBanner isDemoMode={true} />
      <InvestmentDashboard />
    </div>
  )
}
