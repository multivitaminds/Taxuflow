import AssetDetailClient from "./AssetDetailClient"

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <AssetDetailClient assetId={resolvedParams.id} />
}
