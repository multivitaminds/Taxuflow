import { Suspense } from "react"
import { FraudDetectionHub } from "@/components/fraud/fraud-detection-hub"

export const metadata = {
  title: "Fraud Detection - Taxu",
  description: "Real-time fraud detection and risk monitoring",
}

export default function FraudDetectionPage() {
  return (
    <Suspense fallback={<div>Loading fraud detection...</div>}>
      <FraudDetectionHub />
    </Suspense>
  )
}
