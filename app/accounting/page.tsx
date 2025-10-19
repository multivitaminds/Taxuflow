import { AccountingDashboardClient } from "@/components/accounting-dashboard-client"

export default async function AccountingPage() {
  return <AccountingDashboardClient user={null} invoices={[]} expenses={[]} customers={[]} recentTransactions={[]} />
}
