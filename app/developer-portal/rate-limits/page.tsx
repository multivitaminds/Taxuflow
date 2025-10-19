import { DeveloperPortalLayout } from "@/components/developer-portal-layout"
import { RateLimitsClient } from "@/components/rate-limits-client"

export default function RateLimitsPage() {
  return (
    <DeveloperPortalLayout>
      <RateLimitsClient />
    </DeveloperPortalLayout>
  )
}
