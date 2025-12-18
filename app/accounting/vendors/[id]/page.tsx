import { Suspense } from "react"
import { VendorDetailClient } from "@/components/vendor-detail-client"

export default function VendorDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-8">Loading vendor details...</div>}>
      <VendorDetailClient vendorId={params.id} />
    </Suspense>
  )
}
