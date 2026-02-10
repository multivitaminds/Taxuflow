import { BillFormClient } from "@/components/bill-form-client"

export default function NewBillPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Bill</h1>
      <BillFormClient />
    </div>
  )
}
