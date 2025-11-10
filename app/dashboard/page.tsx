"use client"

import { useDashboard } from "./layout"
import { DashboardClient } from "@/components/dashboard-client"
import { ErrorBoundary } from "@/components/error-boundary"

export default function DashboardPage() {
  const { user, profile } = useDashboard()

  return (
    <ErrorBoundary>
      <DashboardClient user={user} profile={profile} />
    </ErrorBoundary>
  )
}
