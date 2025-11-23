"use client"

import { Card } from "@/components/ui/card"
import { Calculator, Users, Receipt, CreditCard } from "lucide-react"

export default function AccountingAPIPage() {
  return (
    <div className="space-y-10 pb-20 px-6 md:px-12 lg:px-36">
      <div className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 text-[#635BFF] font-medium mb-2">
          <Calculator className="w-5 h-5" />
          <span>API Reference</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Accounting API</h1>
        <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
          Manage customers, invoices, expenses, and accounting data programmatically.
        </p>
      </div>

      {/* Customers Section */}
      <section id="customers" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 md:p-8 bg-white border-b border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-md bg-green-100 text-green-700 font-mono font-bold text-sm">GET</div>
              <code className="text-lg text-slate-900 font-mono">/v1/accounting/customers</code>
            </div>
            <p className="text-slate-600">List all customers with their revenue stats and invoice counts.</p>
          </div>
          <div className="bg-[#1a1f36] p-6 overflow-x-auto">
            <code className="text-sm font-mono text-blue-300">curl</code>{" "}
            <code className="text-sm font-mono text-white">https://api.taxu.io/v1/accounting/customers \</code>
            <br />
            <code className="text-sm font-mono text-white pl-4">-H "Authorization: Bearer sk_test_..."</code>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 bg-white border-b border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 font-mono font-bold text-sm">POST</div>
              <code className="text-lg text-slate-900 font-mono">/v1/accounting/customers</code>
            </div>
            <p className="text-slate-600">Create a new customer contact.</p>
          </div>
          <div className="bg-[#1a1f36] p-6 overflow-x-auto">
            <pre className="text-sm font-mono text-white">{`curl https://api.taxu.io/v1/accounting/customers \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "contact_name": "John Smith",
    "company_name": "Acme Corp",
    "email": "john@acme.com"
  }'`}</pre>
          </div>
        </Card>
      </section>

      {/* Invoices Section */}
      <section id="invoices" className="scroll-mt-24 pt-8 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <Receipt className="w-6 h-6 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 md:p-8 bg-white border-b border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 font-mono font-bold text-sm">POST</div>
              <code className="text-lg text-slate-900 font-mono">/v1/accounting/invoices</code>
            </div>
            <p className="text-slate-600">Create a new invoice with line items.</p>
          </div>
          <div className="bg-[#1a1f36] p-6 overflow-x-auto">
            <pre className="text-sm font-mono text-white">{`curl https://api.taxu.io/v1/accounting/invoices \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "cust_123",
    "items": [
      { "description": "Service", "amount": 500.00 }
    ]
  }'`}</pre>
          </div>
        </Card>
      </section>

      {/* Expenses Section */}
      <section id="expenses" className="scroll-mt-24 pt-8 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900">Expenses</h2>
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 bg-white border-b border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 font-mono font-bold text-sm">POST</div>
              <code className="text-lg text-slate-900 font-mono">/v1/accounting/expenses</code>
            </div>
            <p className="text-slate-600">Record a new expense.</p>
          </div>
          <div className="bg-[#1a1f36] p-6 overflow-x-auto">
            <pre className="text-sm font-mono text-white">{`curl https://api.taxu.io/v1/accounting/expenses \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 150.00,
    "description": "Office supplies",
    "account_id": "acc_6100"
  }'`}</pre>
          </div>
        </Card>
      </section>
    </div>
  )
}
