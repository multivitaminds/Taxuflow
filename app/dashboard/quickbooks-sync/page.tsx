import { Suspense } from "react"
import { QuickBooksDesktopSync } from "@/components/quickbooks-sync/quickbooks-desktop-sync"

export default function QuickBooksSyncPage() {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<div>Loading QuickBooks sync...</div>}>
        <QuickBooksDesktopSync />
      </Suspense>
    </div>
  )
}
