import BudgetDetailClient from "./BudgetDetailClient"

export default async function BudgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <BudgetDetailClient budgetId={resolvedParams.id} />
}
