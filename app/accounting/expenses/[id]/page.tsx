export default function ExpenseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Expense Details</h1>
      <p className="text-muted-foreground mt-2">Viewing expense #{params.id}</p>
    </div>
  )
}
