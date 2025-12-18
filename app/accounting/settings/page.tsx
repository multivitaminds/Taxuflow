import { Suspense } from "react"
import { AccountingSettingsClient } from "@/components/accounting-settings-client"

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="space-y-4">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      }
    >
      <AccountingSettingsClient />
    </Suspense>
  )
}
