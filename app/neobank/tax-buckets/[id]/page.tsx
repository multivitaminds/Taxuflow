import { Suspense } from "react"
import { BucketDetailClient } from "@/components/neobank/bucket-detail-client"

export default async function BucketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading bucket details...</div>}>
      <BucketDetailClient bucketId={resolvedParams.id} />
    </Suspense>
  )
}
