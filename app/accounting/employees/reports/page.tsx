import type { Metadata } from "next"
import { EmployeesReportsClient } from "@/components/employees-reports-client"

export const metadata: Metadata = {
  title: "Employee Reports | Taxu",
  description: "Generate and export employee reports",
}

export default function EmployeesReportsPage() {
  return <EmployeesReportsClient />
}
