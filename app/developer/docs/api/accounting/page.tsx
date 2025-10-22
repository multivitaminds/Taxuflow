"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AccountingAPIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Accounting API</h1>
        <p className="text-lg text-muted-foreground">
          Manage customers, invoices, expenses, and accounting data programmatically.
        </p>
      </div>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Customers</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">GET</Badge>
              <code className="text-lg">/v1/accounting/customers</code>
            </div>
            <p className="text-muted-foreground mb-4">
              List all customers with their revenue stats and invoice counts.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{String.raw`curl https://api.taxu.io/v1/accounting/customers \
  -H "Authorization: Bearer your_api_key"`}</code>
            </pre>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="default">POST</Badge>
              <code className="text-lg">/v1/accounting/customers</code>
            </div>
            <p className="text-muted-foreground mb-4">Create a new customer contact.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{String.raw`curl https://api.taxu.io/v1/accounting/customers \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "contact_name": "John Smith",
    "company_name": "Acme Corp",
    "email": "john@acme.com",
    "phone": "+1-555-0123",
    "tax_id": "12-3456789"
  }'`}</code>
            </pre>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Invoices</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">GET</Badge>
              <code className="text-lg">/v1/accounting/invoices</code>
            </div>
            <p className="text-muted-foreground mb-4">List invoices with optional filtering by status or customer.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{String.raw`curl https://api.taxu.io/v1/accounting/invoices?status=paid \
  -H "Authorization: Bearer your_api_key"`}</code>
            </pre>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="default">POST</Badge>
              <code className="text-lg">/v1/accounting/invoices</code>
            </div>
            <p className="text-muted-foreground mb-4">Create a new invoice with line items.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{String.raw`curl https://api.taxu.io/v1/accounting/invoices \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_123",
    "invoice_number": "INV-001",
    "invoice_date": "2024-01-15",
    "due_date": "2024-02-15",
    "items": [
      {
        "description": "Tax Preparation Services",
        "quantity": 1,
        "unit_price": 500.00,
        "amount": 500.00
      }
    ],
    "notes": "Thank you for your business"
  }'`}</code>
            </pre>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Expenses</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">GET</Badge>
              <code className="text-lg">/v1/accounting/expenses</code>
            </div>
            <p className="text-muted-foreground mb-4">List all expense journal entries.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{String.raw`curl https://api.taxu.io/v1/accounting/expenses \
  -H "Authorization: Bearer your_api_key"`}</code>
            </pre>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="default">POST</Badge>
              <code className="text-lg">/v1/accounting/expenses</code>
            </div>
            <p className="text-muted-foreground mb-4">Record a new expense.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{String.raw`curl https://api.taxu.io/v1/accounting/expenses \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "entry_date": "2024-01-15",
    "amount": 150.00,
    "description": "Office supplies",
    "account_id": "acc_6100",
    "reference_number": "EXP-001"
  }'`}</code>
            </pre>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Vendors</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">GET</Badge>
              <code className="text-lg">/v1/accounting/vendors</code>
            </div>
            <p className="text-muted-foreground mb-4">List all vendor contacts.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{String.raw`curl https://api.taxu.io/v1/accounting/vendors \
  -H "Authorization: Bearer your_api_key"`}</code>
            </pre>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="default">POST</Badge>
              <code className="text-lg">/v1/accounting/vendors</code>
            </div>
            <p className="text-muted-foreground mb-4">Create a new vendor contact.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{String.raw`curl https://api.taxu.io/v1/accounting/vendors \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "contact_name": "Office Depot",
    "email": "billing@officedepot.com",
    "phone": "+1-800-555-0199",
    "contact_type": "vendor"
  }'`}</code>
            </pre>
          </div>
        </div>
      </Card>
    </div>
  )
}
