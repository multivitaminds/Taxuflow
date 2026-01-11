import { Suspense } from "react"
import { VendorDetailClient } from "@/components/vendor-detail-client"

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return (
    <Suspense fallback={<div className="p-8">Loading vendor details...</div>}>
      <VendorDetailClient vendorId={resolvedParams.id} />
    </Suspense>
  )
}
