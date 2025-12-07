import type { Metadata } from "next"
import { EmployeesAnalyticsClient } from "@/components/employees-analytics-client"

export const metadata: Metadata = {
  title: "Employee Analytics | Taxu",
  description: "Detailed employee analytics and workforce insights",
}

export default function EmployeesAnalyticsPage() {
  return <EmployeesAnalyticsClient />
}
