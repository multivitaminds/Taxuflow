import { Code2, FileText, Zap, Shield, Database, Webhook } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const apiCategories = [
  {
    name: "Tax Filing APIs",
    description: "Create, manage, and file tax returns programmatically",
    icon: FileText,
    color: "text-blue-600",
    endpoints: [
      { method: "POST", path: "/v1/tax-returns", description: "Create a new tax return" },
      { method: "GET", path: "/v1/tax-returns/:id", description: "Retrieve a tax return" },
      { method: "PUT", path: "/v1/tax-returns/:id", description: "Update a tax return" },
      { method: "POST", path: "/v1/tax-returns/:id/file", description: "File a tax return with IRS" },
      { method: "GET", path: "/v1/tax-returns/:id/status", description: "Check filing status" },
    ],
  },
  {
    name: "Document Intelligence APIs",
    description: "Upload, process, and extract data from tax documents",
    icon: Database,
    color: "text-green-600",
    endpoints: [
      { method: "POST", path: "/v1/documents/upload", description: "Upload tax documents" },
      { method: "GET", path: "/v1/documents/:id", description: "Retrieve document details" },
      { method: "POST", path: "/v1/documents/:id/extract", description: "Extract data from document" },
      { method: "GET", path: "/v1/documents/:id/data", description: "Get extracted data" },
    ],
  },
  {
    name: "Tax Calculation APIs",
    description: "Calculate taxes, deductions, and refunds in real-time",
    icon: Zap,
    color: "text-yellow-600",
    endpoints: [
      { method: "POST", path: "/v1/calculations/estimate", description: "Estimate tax liability" },
      { method: "POST", path: "/v1/calculations/refund", description: "Calculate refund amount" },
      { method: "POST", path: "/v1/calculations/quarterly", description: "Calculate quarterly taxes" },
      { method: "GET", path: "/v1/calculations/brackets", description: "Get current tax brackets" },
    ],
  },
  {
    name: "Accounting APIs",
    description: "Manage invoices, expenses, and financial records",
    icon: Database,
    color: "text-purple-600",
    endpoints: [
      { method: "POST", path: "/v1/invoices", description: "Create an invoice" },
      { method: "GET", path: "/v1/invoices", description: "List all invoices" },
      { method: "POST", path: "/v1/expenses", description: "Record an expense" },
      { method: "GET", path: "/v1/reports/profit-loss", description: "Generate P&L report" },
    ],
  },
  {
    name: "Compliance APIs",
    description: "Ensure tax compliance and audit readiness",
    icon: Shield,
    color: "text-red-600",
    endpoints: [
      { method: "GET", path: "/v1/compliance/check", description: "Run compliance check" },
      { method: "GET", path: "/v1/compliance/deadlines", description: "Get tax deadlines" },
      { method: "POST", path: "/v1/compliance/audit-trail", description: "Generate audit trail" },
    ],
  },
  {
    name: "Webhook APIs",
    description: "Receive real-time notifications for events",
    icon: Webhook,
    color: "text-orange-600",
    endpoints: [
      { method: "POST", path: "/v1/webhooks", description: "Create webhook endpoint" },
      { method: "GET", path: "/v1/webhooks", description: "List webhook endpoints" },
      { method: "DELETE", path: "/v1/webhooks/:id", description: "Delete webhook endpoint" },
    ],
  },
]

const methodColors = {
  GET: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  POST: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  PUT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export default function APIReferencePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">API Reference</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Complete reference documentation for all Taxu APIs. Build powerful tax and accounting integrations with our
          RESTful APIs.
        </p>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Base URL: https://api.taxu.io
          </Badge>
          <Badge variant="outline" className="text-sm">
            Version: v1
          </Badge>
          <Badge variant="outline" className="text-sm">
            Format: JSON
          </Badge>
        </div>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Get started with Taxu APIs in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/developer/docs" className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <Code2 className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Getting Started</h3>
              <p className="text-sm text-muted-foreground">Learn the basics and make your first API call</p>
            </Link>
            <Link href="/developer/dashboard" className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <Shield className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Get API Keys</h3>
              <p className="text-sm text-muted-foreground">Generate your API keys in the dashboard</p>
            </Link>
            <Link href="/developer/sandbox" className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <Zap className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Try Sandbox</h3>
              <p className="text-sm text-muted-foreground">Test APIs with sample data</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* API Categories */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">API Categories</h2>
        {apiCategories.map((category) => {
          const Icon = category.icon
          return (
            <Card key={category.name}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className={`h-6 w-6 ${category.color}`} />
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.endpoints.map((endpoint) => (
                    <div
                      key={endpoint.path}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Badge className={methodColors[endpoint.method as keyof typeof methodColors]}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono flex-1">{endpoint.path}</code>
                      <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>All API requests require authentication using API keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">API Key Authentication</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Include your API key in the Authorization header of every request:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`curl https://api.taxu.io/v1/tax-returns \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              </code>
            </pre>
          </div>
          <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Shield className="h-5 w-5 text-blue-600" />
            <p className="text-sm">
              <strong>Security:</strong> Never expose your API keys in client-side code. Always make API calls from your
              server.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
