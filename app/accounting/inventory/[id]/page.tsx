import InventoryDetailClient from "./InventoryDetailClient"

export default function InventoryDetailPage({ params }: { params: { id: string } }) {
  return <InventoryDetailClient itemId={params.id} />
}
