import { ProductFormClient } from "@/components/product-form-client"

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductFormClient />
    </div>
  )
}
