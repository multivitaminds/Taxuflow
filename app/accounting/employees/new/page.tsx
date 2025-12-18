import type { Metadata } from "next"
import { NewEmployeeClient } from "@/components/new-employee-client"

export const metadata: Metadata = {
  title: "Add New Employee | Taxu",
  description: "Add a new employee to your team",
}

export default function NewEmployeePage() {
  return <NewEmployeeClient />
}
