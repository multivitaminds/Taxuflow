import AssetDetailClient from "./AssetDetailClient"

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  return <AssetDetailClient assetId={params.id} />
}
