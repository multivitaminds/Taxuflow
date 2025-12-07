import BudgetDetailClient from "./BudgetDetailClient"

export default function BudgetDetailPage({ params }: { params: { id: string } }) {
  return <BudgetDetailClient budgetId={params.id} />
}
