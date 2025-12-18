import CreditCardDetailClient from "./CreditCardDetailClient"

export default function CreditCardDetailPage({ params }: { params: { id: string } }) {
  return <CreditCardDetailClient cardId={params.id} />
}
