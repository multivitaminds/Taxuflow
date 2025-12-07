"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function NewBudgetClient() {
  const [budgetName, setBudgetName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [categories, setCategories] = useState([
    { name: "Revenue", amount: "" },
    { name: "Cost of Goods Sold", amount: "" },
    { name: "Operating Expenses", amount: "" },
  ])

  const addCategory = () => {
    setCategories([...categories, { name: "", amount: "" }])
  }

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const updateCategory = (index: number, field: "name" | "amount", value: string) => {
    const updated = [...categories]
    updated[index][field] = value
    setCategories(updated)
  }

  const totalBudget = categories.reduce((sum, cat) => sum + (Number.parseFloat(cat.amount) || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/accounting/budget">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Budgets
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Create New Budget</h1>
          <p className="text-slate-600">Set up a new budget for tracking financial performance</p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Budget Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="budgetName">Budget Name</Label>
              <Input
                id="budgetName"
                placeholder="e.g., Annual Operating Budget 2024"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Budget Categories</h2>
            <Button onClick={addCategory} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          <div className="space-y-4">
            {categories.map((category, idx) => (
              <div key={idx} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>Category Name</Label>
                  <Input
                    placeholder="e.g., Marketing"
                    value={category.name}
                    onChange={(e) => updateCategory(idx, "name", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label>Budget Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={category.amount}
                    onChange={(e) => updateCategory(idx, "amount", e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCategory(idx)}
                  disabled={categories.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-900">Total Budget</span>
              <span className="text-2xl font-bold text-slate-900">${totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            Create Budget
          </Button>
          <Link href="/accounting/budget" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
