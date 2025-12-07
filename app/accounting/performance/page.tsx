import type { Metadata } from "next"
import PerformanceMetricsClient from "./PerformanceMetricsClient"

export const metadata: Metadata = {
  title: "Performance Metrics | Accounting",
}

export default function PerformanceMetricsPage() {
  return <PerformanceMetricsClient />
}
