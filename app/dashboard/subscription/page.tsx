"use client"

import { Suspense } from "react"
import { useDashboard } from "@/components/dashboard-provider"
import { SubscriptionManagementClient } from "@/components/subscription-management-client"
import { ErrorBoundary } from "@/components/error-boundary"
import { Loader2 } from "lucide-react"

function SubscriptionContent() {
  const { profile } = useDashboard()

  return <SubscriptionManagementClient profile={profile} />
}

export default function SubscriptionPage() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <SubscriptionContent />
      </Suspense>
    </ErrorBoundary>
  )
}
