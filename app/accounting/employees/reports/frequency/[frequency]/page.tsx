import type { Metadata } from "next"
import { FrequencyReportsClient } from "@/components/frequency-reports-client"

export const metadata: Metadata = {
  title: "Reports by Frequency | Taxu",
  description: "View reports filtered by frequency",
}

export default async function FrequencyReportsPage({ params }: { params: Promise<{ frequency: string }> }) {
  const resolvedParams = await params
  return <FrequencyReportsClient frequency={resolvedParams.frequency} />
}
