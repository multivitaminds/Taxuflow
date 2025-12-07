import type { Metadata } from "next"
import { NeobankLayout } from "@/components/neobank-layout"
import { RoboAdvisorClient } from "@/components/neobank/robo-advisor-client"

export const metadata: Metadata = {
  title: "Robo-Advisor | Taxu Banking",
  description: "AI-powered investment advisory and automated portfolio management",
}

export default function RoboAdvisorPage() {
  return (
    <NeobankLayout>
      <RoboAdvisorClient />
    </NeobankLayout>
  )
}
