import type { Metadata } from "next"
import { FrequencyReportsClient } from "@/components/frequency-reports-client"

export const metadata: Metadata = {
  title: "Reports by Frequency | Taxu",
  description: "View reports filtered by frequency",
}

export default function FrequencyReportsPage({ params }: { params: { frequency: string } }) {
  return <FrequencyReportsClient frequency={params.frequency} />
}
