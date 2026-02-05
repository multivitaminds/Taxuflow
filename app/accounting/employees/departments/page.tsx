import type { Metadata } from "next"
import { DepartmentsClient } from "@/components/departments-client"

export const metadata: Metadata = {
  title: "Departments | Taxu",
  description: "Manage departments and organizational structure",
}

export default function DepartmentsPage() {
  return <DepartmentsClient />
}
