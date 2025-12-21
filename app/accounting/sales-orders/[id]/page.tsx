import SalesOrderDetailClient from "./SalesOrderDetailClient"

export default function SalesOrderDetailPage({ params }: { params: { id: string } }) {
  return <SalesOrderDetailClient orderId={params.id} />
}
