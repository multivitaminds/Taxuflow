import EstimateDetailClient from "./EstimateDetailClient"

export default async function EstimateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <EstimateDetailClient estimateId={resolvedParams.id} />
}
