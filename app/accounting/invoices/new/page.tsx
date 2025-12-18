import { InvoiceFormClient } from "@/components/invoice-form-client"

export default function NewInvoicePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Invoice</h1>
      <InvoiceFormClient />
    </div>
  )
}
