"use client"

import { useDashboard } from "@/components/dashboard-provider"
import { SubscriptionManagementClient } from "@/components/subscription-management-client"
import { ErrorBoundary } from "@/components/error-boundary"

export default function SubscriptionPage() {
  const { profile } = useDashboard()

  return (
    <ErrorBoundary>
      <SubscriptionManagementClient profile={profile} />
    </ErrorBoundary>
  )
}
