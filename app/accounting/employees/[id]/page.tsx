import type { Metadata } from "next"
import { EmployeeDetailClient } from "@/components/employee-detail-client"

export const metadata: Metadata = {
  title: "Employee Details | Taxu",
  description: "View and manage employee information",
}

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <EmployeeDetailClient employeeId={resolvedParams.id} />
}
