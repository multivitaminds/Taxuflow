import type { Metadata } from "next"
import EmployeePayrollDetailClient from "./EmployeePayrollDetailClient"

export const metadata: Metadata = {
  title: "Employee Payroll Details | Taxu",
  description: "View employee payroll information and pay stubs",
}

export default async function EmployeePayrollPage({ params }: { params: { id: string } }) {
  const { id } = params
  return <EmployeePayrollDetailClient employeeId={id} />
}
