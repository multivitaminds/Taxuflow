import SalesOrderDetailClient from "./SalesOrderDetailClient"

export default async function SalesOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <SalesOrderDetailClient orderId={resolvedParams.id} />
}
