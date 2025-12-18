"use client"

import { ActivationWizard } from "@/components/activation-wizard"

const accountingSteps = [
  {
    id: "account-type",
    title: "Account type",
    substeps: ["Individual or Business"],
  },
  {
    id: "business-setup",
    title: "Account setup",
    substeps: ["Basic information", "Tax ID", "Fiscal year"],
  },
  {
    id: "chart-of-accounts",
    title: "Chart of accounts",
    substeps: ["Industry template", "Customize accounts"],
  },
  {
    id: "integrations",
    title: "Connect accounts",
    substeps: ["Bank connections", "Import data"],
  },
  {
    id: "team",
    title: "Add your team",
    substeps: ["Invite users", "Set permissions"],
  },
  {
    id: "review",
    title: "Review and submit",
    substeps: [],
  },
]

export default function AccountingActivationPage() {
  return (
    <ActivationWizard platform="accounting" platformName="Accounting Suite" steps={accountingSteps} color="amber" />
  )
}
