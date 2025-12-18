import { ExpenseFormClient } from "@/components/expense-form-client"

export default function NewExpensePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Expense</h1>
      <ExpenseFormClient />
    </div>
  )
}
