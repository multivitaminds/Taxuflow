import { Suspense } from "react"
import { ExpensesClient } from "@/components/expenses-client"

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExpensesClient />
    </Suspense>
  )
}
