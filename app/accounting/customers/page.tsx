import { Suspense } from "react"
import { CustomersClient } from "@/components/customers-client"

export default function CustomersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomersClient />
    </Suspense>
  )
}
