"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, TrendingUp } from "lucide-react"

const existingRules = [
  {
    id: 1,
    name: "AWS Services",
    condition: "Description contains 'AWS'",
    category: "Software & Subscriptions",
    applied: 45,
    status: "active",
  },
  {
    id: 2,
    name: "Client Payments",
    condition: "Description contains 'Invoice' AND Amount > $1000",
    category: "Revenue",
    applied: 128,
    status: "active",
  },
  {
    id: 3,
    name: "Office Supplies",
    condition: "Description contains 'Office Depot' OR 'Staples'",
    category: "Office Expenses",
    applied: 23,
    status: "active",
  },
]

export default function RulesManagementClient() {
  const [showNewRule, setShowNewRule] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Rules</p>
              <p className="text-3xl font-bold">{existingRules.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Rules</p>
              <p className="text-3xl font-bold">{existingRules.filter((r) => r.status === "active").length}</p>
            </div>
            <Badge className="bg-green-500">Active</Badge>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Auto-Categorized</p>
              <p className="text-3xl font-bold">{existingRules.reduce((sum, rule) => sum + rule.applied, 0)}</p>
            </div>
            <Badge variant="outline">This Month</Badge>
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Rules</h2>
        <Button onClick={() => setShowNewRule(!showNewRule)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {showNewRule && (
        <Card className="p-6 border-2 border-dashed">
          <h3 className="font-semibold mb-4">New Categorization Rule</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rule Name</label>
              <Input placeholder="e.g., AWS Services" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Condition</label>
              <Input placeholder="e.g., Description contains 'AWS'" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Input placeholder="e.g., Software & Subscriptions" />
            </div>
            <div className="flex gap-2">
              <Button>Save Rule</Button>
              <Button variant="outline" onClick={() => setShowNewRule(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {existingRules.map((rule) => (
          <Card key={rule.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{rule.name}</h3>
                  <Badge variant={rule.status === "active" ? "default" : "secondary"}>{rule.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rule.condition}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{rule.category}</Badge>
                  <span className="text-sm text-muted-foreground">Applied {rule.applied} times</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
