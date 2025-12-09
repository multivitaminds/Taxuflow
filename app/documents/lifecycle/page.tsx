import { Suspense } from "react"
import { DocumentLifecycleHub } from "@/components/documents/document-lifecycle-hub"

export default function DocumentLifecyclePage() {
  return (
    <div className="min-h-screen bg-black">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <DocumentLifecycleHub />
      </Suspense>
    </div>
  )
}
