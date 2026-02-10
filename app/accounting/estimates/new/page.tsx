import { EstimateFormClient } from "@/components/estimate-form-client"

export default function NewEstimatePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Estimate</h1>
      <EstimateFormClient />
    </div>
  )
}
