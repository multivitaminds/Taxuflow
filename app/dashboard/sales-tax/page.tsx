import { Suspense } from "react"
import { SalesTaxDashboard } from "@/components/sales-tax/sales-tax-dashboard"

export default function SalesTaxPage() {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<div>Loading sales tax...</div>}>
        <SalesTaxDashboard />
      </Suspense>
    </div>
  )
}
