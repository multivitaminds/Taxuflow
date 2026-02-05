import { Suspense } from "react"
import { InvoicesClient } from "@/components/invoices-client"

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoicesClient />
    </Suspense>
  )
}
