import { CustomerFormClient } from "@/components/customer-form-client"

export default function NewCustomerPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Customer</h1>
      <CustomerFormClient />
    </div>
  )
}
