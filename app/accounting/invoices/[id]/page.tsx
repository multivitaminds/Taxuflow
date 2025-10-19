export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Invoice #{params.id}</h1>
      <p className="text-muted-foreground mt-2">View and manage invoice details</p>
    </div>
  )
}
