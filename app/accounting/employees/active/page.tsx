import type { Metadata } from "next"
import { ActiveEmployeesClient } from "@/components/active-employees-client"

export const metadata: Metadata = {
  title: "Active Employees | Taxu",
  description: "View and manage active employees",
}

export default function ActiveEmployeesPage() {
  return <ActiveEmployeesClient />
}
