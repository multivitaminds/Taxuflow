export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Customer Details</h1>
      <p className="text-muted-foreground mt-2">Viewing customer #{params.id}</p>
    </div>
  )
}
