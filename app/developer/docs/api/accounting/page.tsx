"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Users, Receipt, CreditCard, FileText, DollarSign } from "lucide-react"

export default function AccountingAPIPage() {
  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      <header className="border-b border-slate-200 bg-white px-6 pt-24 pb-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="border-[#635bff]/30 bg-[#635bff]/10 text-[#635bff] hover:bg-[#635bff]/20"
            >
              <Calculator className="mr-1.5 h-3 w-3" />
              API Reference
            </Badge>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-50 text-emerald-700">
              v1.0
            </Badge>
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-[#0a2540]">Accounting API</h1>
          <p className="text-xl leading-relaxed text-slate-600 max-w-3xl">
            Manage customers, invoices, expenses, and accounting data programmatically. Full double-entry bookkeeping
            with real-time reconciliation.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-12">
        <div className="space-y-24">
          {/* Customers Section */}
          <section id="customers" className="scroll-mt-24 space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#635bff]/10 text-[#635bff]">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#0a2540]">Customers</h2>
            </div>

            {/* GET /customers */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    GET
                  </span>
                  <h3 className="font-mono text-xl font-medium text-[#0a2540]">/v1/accounting/customers</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Retrieve a list of all customers with their associated revenue statistics, invoice counts, and payment
                  history.
                </p>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <h4 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Query Parameters
                  </h4>
                  <div className="divide-y divide-slate-100">
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">limit</code>
                        <span className="text-xs font-medium text-slate-400">OPTIONAL</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        Maximum number of customers to return (default: 100, max: 1000)
                      </p>
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">offset</code>
                        <span className="text-xs font-medium text-slate-400">OPTIONAL</span>
                      </div>
                      <p className="text-sm text-slate-500">Pagination offset for retrieving subsequent pages</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky top-24 overflow-hidden rounded-lg bg-[#0a2540] shadow-xl ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="text-xs font-medium text-white/50">Request</div>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono leading-relaxed text-white">
                  <code>
                    <span className="text-[#c792ea]">curl</span> https://api.taxu.io/v1/accounting/customers \{"\n"}
                    <span className="pl-4 text-white/60">-H</span>{" "}
                    <span className="text-[#c3e88d]">"Authorization: Bearer sk_test_..."</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* POST /customers */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-blue-600 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    POST
                  </span>
                  <h3 className="font-mono text-xl font-medium text-[#0a2540]">/v1/accounting/customers</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Create a new customer contact with billing and payment information.
                </p>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <h4 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Request Body
                  </h4>
                  <div className="divide-y divide-slate-100">
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">contact_name</code>
                        <span className="text-xs font-medium text-red-500">REQUIRED</span>
                      </div>
                      <p className="text-sm text-slate-500">Full name of the customer contact</p>
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">company_name</code>
                        <span className="text-xs font-medium text-slate-400">OPTIONAL</span>
                      </div>
                      <p className="text-sm text-slate-500">Company or business name</p>
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">email</code>
                        <span className="text-xs font-medium text-red-500">REQUIRED</span>
                      </div>
                      <p className="text-sm text-slate-500">Customer email address for invoicing</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky top-24 overflow-hidden rounded-lg bg-[#0a2540] shadow-xl ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="text-xs font-medium text-white/50">Request</div>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono leading-relaxed text-white">
                  <code>
                    <span className="text-[#c792ea]">curl</span> https://api.taxu.io/v1/accounting/customers \{"\n"}
                    <span className="pl-4 text-white/60">-H</span>{" "}
                    <span className="text-[#c3e88d]">"Authorization: Bearer sk_test_..."</span> \{"\n"}
                    <span className="pl-4 text-white/60">-H</span>{" "}
                    <span className="text-[#c3e88d]">"Content-Type: application/json"</span> \{"\n"}
                    <span className="pl-4 text-white/60">-d</span>{" "}
                    <span className="text-[#c3e88d]">
                      '
                      {`{
  "contact_name": "John Smith",
  "company_name": "Acme Corp",
  "email": "john@acme.com"
}`}
                      '
                    </span>
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Invoices Section */}
          <section id="invoices" className="scroll-mt-24 space-y-8 border-t border-slate-200 pt-16">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Receipt className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#0a2540]">Invoices</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-blue-600 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    POST
                  </span>
                  <h3 className="font-mono text-xl font-medium text-[#0a2540]">/v1/accounting/invoices</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Create a new invoice with line items, tax calculations, and payment terms.
                </p>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <h4 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Request Body
                  </h4>
                  <div className="divide-y divide-slate-100">
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">customer_id</code>
                        <span className="text-xs font-medium text-red-500">REQUIRED</span>
                      </div>
                      <p className="text-sm text-slate-500">The customer ID to invoice</p>
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">items</code>
                        <span className="text-xs font-medium text-red-500">REQUIRED</span>
                      </div>
                      <p className="text-sm text-slate-500">Array of line items with description and amount</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky top-24 overflow-hidden rounded-lg bg-[#0a2540] shadow-xl ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="text-xs font-medium text-white/50">Request</div>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono leading-relaxed text-white">
                  <code>
                    <span className="text-[#c792ea]">curl</span> https://api.taxu.io/v1/accounting/invoices \{"\n"}
                    <span className="pl-4 text-white/60">-H</span>{" "}
                    <span className="text-[#c3e88d]">"Authorization: Bearer sk_test_..."</span> \{"\n"}
                    <span className="pl-4 text-white/60">-H</span>{" "}
                    <span className="text-[#c3e88d]">"Content-Type: application/json"</span> \{"\n"}
                    <span className="pl-4 text-white/60">-d</span>{" "}
                    <span className="text-[#c3e88d]">
                      '
                      {`{
  "customer_id": "cust_123",
  "items": [
    {
      "description": "Consulting Services",
      "amount": 500.00
    }
  ]
}`}
                      '
                    </span>
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Expenses Section */}
          <section id="expenses" className="scroll-mt-24 space-y-8 border-t border-slate-200 pt-16">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <CreditCard className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#0a2540]">Expenses</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-blue-600 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    POST
                  </span>
                  <h3 className="font-mono text-xl font-medium text-[#0a2540]">/v1/accounting/expenses</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Record a new business expense with automatic categorization and tax deduction tracking.
                </p>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <h4 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Request Body
                  </h4>
                  <div className="divide-y divide-slate-100">
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">amount</code>
                        <span className="text-xs font-medium text-red-500">REQUIRED</span>
                      </div>
                      <p className="text-sm text-slate-500">Expense amount in dollars</p>
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">description</code>
                        <span className="text-xs font-medium text-red-500">REQUIRED</span>
                      </div>
                      <p className="text-sm text-slate-500">Description of the expense</p>
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">account_id</code>
                        <span className="text-xs font-medium text-red-500">REQUIRED</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        Chart of accounts ID (e.g., acc_6100 for office expenses)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky top-24 overflow-hidden rounded-lg bg-[#0a2540] shadow-xl ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="text-xs font-medium text-white/50">Request</div>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono leading-relaxed text-white">
                  <code>
                    <span className="text-[#c792ea]">curl</span> https://api.taxu.io/v1/accounting/expenses \{"\n"}
                    <span className="pl-4 text-white/60">-H</span>{" "}
                    <span className="text-[#c3e88d]">"Authorization: Bearer sk_test_..."</span> \{"\n"}
                    <span className="pl-4 text-white/60">-H</span>{" "}
                    <span className="text-[#c3e88d]">"Content-Type: application/json"</span> \{"\n"}
                    <span className="pl-4 text-white/60">-d</span>{" "}
                    <span className="text-[#c3e88d]">
                      '
                      {`{
  "amount": 150.00,
  "description": "Office supplies",
  "account_id": "acc_6100"
}`}
                      '
                    </span>
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Feature Cards Section */}
          <section className="scroll-mt-24 space-y-8 border-t border-slate-200 pt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#0a2540] mb-4">Full Accounting Features</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Beyond basic CRUD operations, Taxu provides complete accounting infrastructure
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group border-slate-200 bg-white p-6 transition-all hover:border-[#635bff]/50 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#635bff]">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#0a2540]">Double-Entry</h3>
                <p className="text-slate-500 leading-relaxed">
                  Automatic journal entries with debits and credits for all transactions
                </p>
              </Card>

              <Card className="group border-slate-200 bg-white p-6 transition-all hover:border-[#635bff]/50 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#0a2540]">Real-Time Reconciliation</h3>
                <p className="text-slate-500 leading-relaxed">
                  Match bank transactions to invoices and bills automatically
                </p>
              </Card>

              <Card className="group border-slate-200 bg-white p-6 transition-all hover:border-[#635bff]/50 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Calculator className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#0a2540]">Tax Calculations</h3>
                <p className="text-slate-500 leading-relaxed">Automatic sales tax, VAT, and income tax calculations</p>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
