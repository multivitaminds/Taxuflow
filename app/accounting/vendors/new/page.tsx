import { VendorFormClient } from "@/components/vendor-form-client"

export default function NewVendorPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Vendor</h1>
      <VendorFormClient />
    </div>
  )
}
