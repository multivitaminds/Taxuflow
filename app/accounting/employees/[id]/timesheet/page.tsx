import type { Metadata } from "next"
import { TimesheetDetailClient } from "@/components/timesheet-detail-client"

export const metadata: Metadata = {
  title: "Employee Timesheet | Taxu",
  description: "View and manage employee time entries",
}

export default async function TimesheetPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <TimesheetDetailClient employeeId={resolvedParams.id} />
}
