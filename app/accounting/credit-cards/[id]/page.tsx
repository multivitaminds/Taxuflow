import CreditCardDetailClient from "./CreditCardDetailClient"

export default async function CreditCardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <CreditCardDetailClient cardId={resolvedParams.id} />
}
