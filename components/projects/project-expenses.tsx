"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign } from "lucide-react"

interface ProjectExpensesProps {
  projectId: string
}

export function ProjectExpenses({ projectId }: ProjectExpensesProps) {
  // Mock expenses
  const expenses = [
    { id: "1", description: "Software licenses", amount: 299, date: "2025-01-15", status: "approved" },
    { id: "2", description: "Cloud hosting", amount: 150, date: "2025-01-10", status: "pending" },
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Project Expenses</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-muted-foreground">{expense.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={expense.status === "approved" ? "default" : "secondary"}>{expense.status}</Badge>
              <p className="font-semibold">${expense.amount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
