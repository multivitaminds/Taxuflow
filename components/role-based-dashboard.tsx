"use client"

import { useDashboard } from "@/components/dashboard-provider"
import { DashboardClient } from "@/components/dashboard-client"
import { BusinessDashboard } from "@/components/business-dashboard"
import { DeveloperDashboard } from "@/components/developer-dashboard"
import { ErrorBoundary } from "@/components/error-boundary"

export function RoleBasedDashboard() {
  const { user, profile } = useDashboard()

  const userType = profile?.user_type || "regular"

  return (
    <ErrorBoundary>
      <div className="mt-3">
        {userType === "regular" && <DashboardClient user={user} profile={profile} />}
        {userType === "business" && <BusinessDashboard user={user} profile={profile} />}
        {userType === "developer" && <DeveloperDashboard user={user} profile={profile} />}
        {userType === "admin" && <DashboardClient user={user} profile={profile} />}
      </div>
    </ErrorBoundary>
  )
}
