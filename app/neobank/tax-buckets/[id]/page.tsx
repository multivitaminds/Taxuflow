import { Suspense } from "react"
import { BucketDetailClient } from "@/components/neobank/bucket-detail-client"

export default function BucketDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading bucket details...</div>}>
      <BucketDetailClient bucketId={params.id} />
    </Suspense>
  )
}
