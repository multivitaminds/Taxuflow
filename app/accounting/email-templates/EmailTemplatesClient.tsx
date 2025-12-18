"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Mail,
  Search,
  Plus,
  FileText,
  Receipt,
  Bell,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Eye,
  Edit,
  Copy,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const templates = [
  {
    id: 1,
    name: "Invoice Email",
    category: "invoice",
    subject: "Invoice {{invoice_number}} from {{company_name}}",
    description: "Standard invoice email with payment details",
    usageCount: 1247,
    lastModified: "2024-01-15",
    isActive: true,
  },
  {
    id: 2,
    name: "Receipt Confirmation",
    category: "receipt",
    subject: "Payment Receipt - {{receipt_number}}",
    description: "Automatic receipt sent after payment",
    usageCount: 892,
    lastModified: "2024-01-10",
    isActive: true,
  },
  {
    id: 3,
    name: "Payment Reminder",
    category: "reminder",
    subject: "Payment Reminder: Invoice {{invoice_number}} Due",
    description: "Friendly reminder for overdue invoices",
    usageCount: 456,
    lastModified: "2024-01-12",
    isActive: true,
  },
  {
    id: 4,
    name: "Payment Confirmation",
    category: "payment",
    subject: "Payment Received - Thank You!",
    description: "Confirmation email after successful payment",
    usageCount: 823,
    lastModified: "2024-01-08",
    isActive: true,
  },
  {
    id: 5,
    name: "Estimate/Quote",
    category: "estimate",
    subject: "Quote {{quote_number}} from {{company_name}}",
    description: "Professional quote email template",
    usageCount: 634,
    lastModified: "2024-01-14",
    isActive: true,
  },
  {
    id: 6,
    name: "Welcome Email",
    category: "system",
    subject: "Welcome to {{company_name}}!",
    description: "Welcome email for new customers",
    usageCount: 234,
    lastModified: "2024-01-05",
    isActive: false,
  },
  {
    id: 7,
    name: "Statement Email",
    category: "statement",
    subject: "Your Monthly Statement from {{company_name}}",
    description: "Monthly account statement email",
    usageCount: 156,
    lastModified: "2024-01-09",
    isActive: true,
  },
  {
    id: 8,
    name: "Overdue Notice",
    category: "reminder",
    subject: "Overdue Payment Notice - Action Required",
    description: "Urgent reminder for significantly overdue invoices",
    usageCount: 89,
    lastModified: "2024-01-11",
    isActive: true,
  },
]

const categories = [
  { id: "all", label: "All Templates", icon: Mail, count: 8 },
  { id: "invoice", label: "Invoices", icon: FileText, count: 1 },
  { id: "receipt", label: "Receipts", icon: Receipt, count: 1 },
  { id: "reminder", label: "Reminders", icon: Bell, count: 2 },
  { id: "payment", label: "Payments", icon: CheckCircle2, count: 1 },
  { id: "estimate", label: "Estimates", icon: Calendar, count: 1 },
  { id: "statement", label: "Statements", icon: FileText, count: 1 },
  { id: "system", label: "System", icon: AlertCircle, count: 1 },
]

function EmailTemplatesClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Email Templates</h1>
            <p className="text-slate-600">Manage and customize email templates for all communications</p>
          </div>
          <Link href="/accounting/email-templates/new">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Templates</p>
                <p className="text-3xl font-bold mt-1">8</p>
              </div>
              <Mail className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Templates</p>
                <p className="text-3xl font-bold mt-1">7</p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Emails Sent (30d)</p>
                <p className="text-3xl font-bold mt-1">4,531</p>
              </div>
              <Mail className="h-12 w-12 text-purple-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Open Rate</p>
                <p className="text-3xl font-bold mt-1">68%</p>
              </div>
              <Eye className="h-12 w-12 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search templates by name or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.label}
                    <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs">
                      {category.count}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const categoryInfo = categories.find((c) => c.id === template.category)
            const CategoryIcon = categoryInfo?.icon || Mail

            return (
              <Card
                key={template.id}
                className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 border-l-blue-500"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CategoryIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            template.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {template.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium">SUBJECT</p>
                    <p className="text-sm text-slate-700 font-mono bg-slate-50 p-2 rounded">{template.subject}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600">{template.description}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
                    <span>Used {template.usageCount.toLocaleString()} times</span>
                    <span>Modified {template.lastModified}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/accounting/email-templates/${template.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/accounting/email-templates/${template.id}/preview`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <Card className="p-12 text-center">
            <Mail className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default EmailTemplatesClient
