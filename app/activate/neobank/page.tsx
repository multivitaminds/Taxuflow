"use client"
import { ActivationWizard } from "@/components/activation-wizard"

const neobankSteps = [
  {
    id: "account-type",
    title: "Account type",
    substeps: ["Individual or Business"],
  },
  {
    id: "personal-info",
    title: "Account information",
    substeps: ["Identity details", "Address", "SSN/EIN"],
  },
  {
    id: "verify",
    title: "Verify identity",
    substeps: ["Document upload", "Photo verification"],
  },
  {
    id: "funding",
    title: "Initial funding",
    substeps: ["Link bank", "Set up direct deposit"],
  },
  {
    id: "review",
    title: "Review and submit",
    substeps: [],
  },
]

export default function NeobankActivationPage() {
  return <ActivationWizard platform="neobank" platformName="Neobank" steps={neobankSteps} color="emerald" />
}
