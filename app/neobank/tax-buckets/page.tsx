import { Suspense } from "react"
import { TaxBucketsManager } from "@/components/cashflow/tax-buckets-manager"

export default function TaxBucketsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#0a2540]">Loading tax buckets...</div>}>
      <TaxBucketsManager />
    </Suspense>
  )
}
