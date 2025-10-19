import { Suspense } from "react"
import { CustomFieldsManager } from "@/components/custom-fields/custom-fields-manager"

export default function CustomFieldsPage() {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<div>Loading custom fields...</div>}>
        <CustomFieldsManager />
      </Suspense>
    </div>
  )
}
