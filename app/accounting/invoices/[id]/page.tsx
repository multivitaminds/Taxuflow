import { InvoiceDetailClient } from "@/components/invoice-detail-enhanced-client"

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return <InvoiceDetailClient invoiceId={params.id} />
}
