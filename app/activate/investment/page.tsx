"use client"

import { ActivationWizard } from "@/components/activation-wizard"

const investmentSteps = [
  {
    id: "account-type",
    title: "Account type",
    substeps: ["Individual or Business"],
  },
  {
    id: "investor-profile",
    title: "Investor profile",
    substeps: ["Investment goals", "Risk tolerance", "Experience level"],
  },
  {
    id: "account-setup",
    title: "Account setup",
    substeps: ["Account type", "Tax status", "Beneficiaries"],
  },
  {
    id: "identity",
    title: "Verify your identity",
    substeps: ["Personal details", "Employment info", "Document upload"],
  },
  {
    id: "funding",
    title: "Fund your account",
    substeps: ["Link bank", "Initial deposit"],
  },
  {
    id: "review",
    title: "Review and submit",
    substeps: [],
  },
]

export default function InvestmentActivationPage() {
  return (
    <ActivationWizard platform="investment" platformName="Investment Platform" steps={investmentSteps} color="violet" />
  )
}
