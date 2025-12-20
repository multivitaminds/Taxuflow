import { InvoiceDetailClient } from "@/components/invoice-detail-enhanced-client"

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <InvoiceDetailClient invoiceId={resolvedParams.id} />
}
