import { RecurringFormClient } from "@/components/recurring-form-client"

export default function NewRecurringTransactionPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Recurring Transaction</h1>
      <RecurringFormClient />
    </div>
  )
}
