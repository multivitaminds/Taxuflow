import { Suspense } from "react"
import DocumentIntelligenceHub from "@/components/documents/document-intelligence-hub"

export default function DocumentIntelligencePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentIntelligenceHub />
    </Suspense>
  )
}
