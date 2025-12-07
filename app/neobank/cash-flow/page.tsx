import { NeobankLayout } from "@/components/neobank-layout"
import { CashFlowForecastClient } from "@/components/neobank/cash-flow-forecast-client"

export default function CashFlowForecastPage() {
  return (
    <NeobankLayout>
      <CashFlowForecastClient />
    </NeobankLayout>
  )
}
