import { CustomerFormClient } from "@/components/customer-form-client"

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Customer</h1>
      <CustomerFormClient customerId={params.id} />
    </div>
  )
}
