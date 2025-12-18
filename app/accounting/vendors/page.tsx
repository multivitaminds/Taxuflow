import { Suspense } from "react"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import { VendorsClient } from "@/components/vendors-client"

export default function VendorsPage() {
  return (
    <>
      <DemoModeBanner isDemoMode={true} />
      <Suspense fallback={<div className="p-8">Loading vendors...</div>}>
        <VendorsClient />
      </Suspense>
    </>
  )
}
