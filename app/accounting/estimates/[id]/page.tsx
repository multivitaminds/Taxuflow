import EstimateDetailClient from "./EstimateDetailClient"

export default function EstimateDetailPage({ params }: { params: { id: string } }) {
  return <EstimateDetailClient estimateId={params.id} />
}
