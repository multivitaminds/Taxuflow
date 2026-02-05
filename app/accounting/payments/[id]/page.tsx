import PaymentDetailClient from "./PaymentDetailClient"

export default async function PaymentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <div>
      <PaymentDetailClient paymentId={id} />
    </div>
  )
}
