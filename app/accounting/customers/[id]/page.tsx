import { CustomerDetailClient } from "@/components/customer-detail-client"

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <CustomerDetailClient customerId={resolvedParams.id} />
}
