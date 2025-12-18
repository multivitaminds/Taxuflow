import type { Metadata } from "next"
import { EmployeesOverviewClient } from "@/components/employees-overview-client"

export const metadata: Metadata = {
  title: "Employees Overview | Taxu",
  description: "Overview of employee statistics and analytics",
}

export default function EmployeesOverviewPage() {
  return <EmployeesOverviewClient />
}
