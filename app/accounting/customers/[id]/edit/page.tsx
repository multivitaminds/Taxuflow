import { CustomerFormClient } from "@/components/customer-form-client"

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Customer</h1>
      <CustomerFormClient />
    </div>
  )
}
