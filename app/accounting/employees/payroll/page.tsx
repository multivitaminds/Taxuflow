import type { Metadata } from "next"
import { EmployeesPayrollClient } from "@/components/employees-payroll-client"

export const metadata: Metadata = {
  title: "Payroll | Taxu",
  description: "Manage employee payroll and compensation",
}

export default function EmployeesPayrollPage() {
  return <EmployeesPayrollClient />
}
