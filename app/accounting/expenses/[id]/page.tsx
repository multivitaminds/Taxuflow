export default async function ExpenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Expense Details</h1>
      <p className="text-muted-foreground mt-2">Viewing expense #{resolvedParams.id}</p>
    </div>
  )
}
