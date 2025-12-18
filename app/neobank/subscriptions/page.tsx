import { NeobankLayout } from "@/components/neobank-layout"
import { SubscriptionManagementClient } from "@/components/neobank/subscription-management-client"

export default function SubscriptionsPage() {
  return (
    <NeobankLayout>
      <SubscriptionManagementClient />
    </NeobankLayout>
  )
}
