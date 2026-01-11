import PaymentDetailClient from "./PaymentDetailClient"

export default async function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  return (
    <div>
      <PaymentDetailClient paymentId={id} />
    </div>
  )
}
