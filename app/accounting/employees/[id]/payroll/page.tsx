import type { Metadata } from "next"
import EmployeePayrollDetailClient from "./EmployeePayrollDetailClient"

export const metadata: Metadata = {
  title: "Employee Payroll Details | Taxu",
  description: "View employee payroll information and pay stubs",
}

export default async function EmployeePayrollPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { id } = resolvedParams
  return <EmployeePayrollDetailClient employeeId={id} />
}
