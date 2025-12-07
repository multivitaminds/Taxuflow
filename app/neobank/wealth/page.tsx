import type { Metadata } from "next"
import { NeobankLayout } from "@/components/neobank-layout"
import { WealthManagementClient } from "@/components/neobank/wealth-management-client"

export const metadata: Metadata = {
  title: "Wealth Management | Taxu Banking",
  description: "Comprehensive wealth management dashboard with portfolio insights and advisory services",
}

export default function WealthManagementPage() {
  return (
    <NeobankLayout>
      <WealthManagementClient />
    </NeobankLayout>
  )
}
