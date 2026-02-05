import { Suspense } from "react"
import { AuditSupportClient } from "@/components/audit-support-client"

export default function AuditSupportPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AuditSupportClient />
    </Suspense>
  )
}
