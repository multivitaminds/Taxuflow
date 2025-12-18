"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Copy, FileText, DollarSign } from "lucide-react"
import Link from "next/link"

export default function TemplatesClient() {
  const [searchQuery, setSearchQuery] = useState("")

  const templates = [
    {
      id: "TPL-001",
      name: "Website Development Package",
      description: "Standard website development with CMS",
      items: 4,
      amount: 15000,
      timesUsed: 12,
    },
    {
      id: "TPL-002",
      name: "SEO Optimization Package",
      description: "Complete SEO service package",
      items: 6,
      amount: 5000,
      timesUsed: 24,
    },
    {
      id: "TPL-003",
      name: "Mobile App Development",
      description: "iOS and Android app development",
      items: 8,
      amount: 45000,
      timesUsed: 6,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/accounting/estimates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Quote Templates</h1>
            <p className="text-muted-foreground">Reusable templates for faster quote creation</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="secondary">{template.timesUsed} uses</Badge>
            </div>
            <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{template.items} items</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-bold">${template.amount.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                <Copy className="h-4 w-4" />
                Use Template
              </Button>
              <Button variant="ghost">Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
