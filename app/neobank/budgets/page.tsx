import { DemoModeBanner } from "@/components/demo-mode-banner"
import { BudgetsClient } from "@/components/neobank/budgets-client"

export const metadata = {
  title: "Budget Management | Taxu Banking",
}

export default function BudgetsPage() {
  return (
    <>
      <DemoModeBanner />
      <BudgetsClient />
    </>
  )
}
