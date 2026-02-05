import { Suspense } from "react"
import { FormsLibraryClient } from "@/components/forms-library-client"

export default function FormsLibraryPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <FormsLibraryClient />
    </Suspense>
  )
}
