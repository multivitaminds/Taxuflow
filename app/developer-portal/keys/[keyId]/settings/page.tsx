import { DeveloperPortalLayout } from "@/components/developer-portal-layout"
import { KeySettingsClient } from "@/components/key-settings-client"

export default function KeySettingsPage({ params }: { params: { keyId: string } }) {
  return (
    <DeveloperPortalLayout>
      <KeySettingsClient keyId={params.keyId} />
    </DeveloperPortalLayout>
  )
}
