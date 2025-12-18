"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  BookOpen,
  Building2,
  Calculator,
  BarChartBig as ChartBar,
  Receipt,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  Database,
} from "lucide-react"

const features = [
  {
    id: 1,
    title: "Chart of Accounts",
    description: "Complete account management with journal entries, sub-accounts, and transaction drill-downs",
    icon: BookOpen,
    status: "Completed",
    pages: [
      { name: "Chart of Accounts", path: "/accounting/chart-of-accounts" },
      { name: "Account Details", path: "/accounting/chart-of-accounts/[id]" },
      { name: "Journal Entry Form", path: "/accounting/chart-of-accounts/[id]/journal-entry/new" },
    ],
  },
  {
    id: 2,
    title: "Bank Feeds & Reconciliation",
    description: "Bank feed management with reconciliation workflows, automatic categorization, and rule management",
    icon: Building2,
    status: "Completed",
    pages: [
      { name: "Bank Feeds Dashboard", path: "/accounting/bank-feeds" },
      { name: "Reconciliation Center", path: "/accounting/bank-feeds/reconciliation" },
      { name: "Rules Management", path: "/accounting/bank-feeds/rules" },
    ],
  },
  {
    id: 3,
    title: "Settings & Configuration",
    description: "Comprehensive settings for company profiles, tax settings, payment gateways, and user roles",
    icon: Settings,
    status: "Completed",
    pages: [
      { name: "Accounting Settings", path: "/accounting/settings" },
      { name: "Tax Jurisdictions", path: "/accounting/settings/tax-jurisdictions" },
      { name: "User Roles & Permissions", path: "/accounting/settings/roles" },
      { name: "Currency Settings", path: "/accounting/settings/currencies" },
    ],
  },
  {
    id: 4,
    title: "Dashboard Customization",
    description: "Widget-based dashboard with drag-and-drop, saved views, and real-time data refresh",
    icon: BarChart3,
    status: "Completed",
    pages: [
      { name: "Main Dashboard", path: "/accounting" },
      { name: "Customize Dashboard", path: "/accounting/dashboard/customize" },
    ],
  },
  {
    id: 5,
    title: "Customer & Vendor Portals",
    description: "Self-service portals where customers view invoices and vendors submit bills",
    icon: Users,
    status: "Completed",
    pages: [
      { name: "Customer Portal", path: "/portal/customer" },
      { name: "Vendor Portal", path: "/portal/vendor" },
      { name: "Customers Management", path: "/accounting/customers" },
      { name: "Vendors Management", path: "/accounting/vendors" },
    ],
  },
  {
    id: 6,
    title: "Advanced Features",
    description: "Multi-currency support, recurring transactions, approval workflows, and audit trails",
    icon: ShieldCheck,
    status: "Completed",
    pages: [
      { name: "Recurring Transactions", path: "/accounting/recurring" },
      { name: "Approval Workflows", path: "/accounting/workflows" },
      { name: "Audit Trail", path: "/accounting/audit" },
      { name: "Currency Settings", path: "/accounting/settings/currencies" },
    ],
  },
  {
    id: 7,
    title: "Enhanced Expense Management",
    description: "Receipt scanning, mileage tracking, and employee reimbursement management",
    icon: Receipt,
    status: "Completed",
    pages: [
      { name: "Expenses Overview", path: "/accounting/expenses" },
      { name: "Receipt Scanner", path: "/accounting/expenses/receipts" },
      { name: "Mileage Tracker", path: "/accounting/expenses/mileage" },
      { name: "Reimbursements", path: "/accounting/expenses/reimbursements" },
    ],
  },
  {
    id: 8,
    title: "Tax Management & Filing",
    description: "Quarterly tax estimates, tax filing dashboard, and comprehensive tax reporting",
    icon: Calculator,
    status: "Completed",
    pages: [
      { name: "Tax Management Center", path: "/accounting/tax" },
      { name: "Quarterly Estimates", path: "/accounting/tax/quarterly" },
      { name: "Sales Tax Report", path: "/accounting/reports/sales-tax" },
      { name: "Tax Deductions", path: "/accounting/reports/tax-deductions" },
    ],
  },
]

const additionalPages = [
  {
    category: "Core Accounting",
    icon: Database,
    pages: [
      { name: "Books Central Hub", path: "/accounting/books" },
      { name: "Invoices", path: "/accounting/invoices" },
      { name: "Bills", path: "/accounting/bills" },
      { name: "Payments", path: "/accounting/payments" },
      { name: "Products & Services", path: "/accounting/products" },
    ],
  },
  {
    category: "Reports & Analytics",
    icon: TrendingUp,
    pages: [
      { name: "Reports Dashboard", path: "/accounting/reports/dashboard" },
      { name: "Advanced Analytics", path: "/accounting/reports/analytics" },
      { name: "Business Insights", path: "/accounting/reports/analytics/insights" },
      { name: "Custom Report Builder", path: "/accounting/reports/custom" },
      { name: "Profit & Loss", path: "/accounting/reports/profit-loss" },
      { name: "Balance Sheet", path: "/accounting/reports/balance-sheet" },
      { name: "Cash Flow", path: "/accounting/reports/cash-flow" },
    ],
  },
  {
    category: "Time & Employees",
    icon: Clock,
    pages: [
      { name: "Time Tracking", path: "/accounting/time" },
      { name: "Time Calendar", path: "/accounting/time/calendar" },
      { name: "Employees Overview", path: "/accounting/employees" },
      { name: "Employee Timesheets", path: "/accounting/employees/[id]/timesheet" },
    ],
  },
]

export default function FeaturesDirectoryClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Accounting Platform Directory</h1>
          <p className="text-lg text-slate-600">
            World-class $100B valuation accounting features - fully implemented and ready to use
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              8 Major Features Completed
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
              40+ Pages Built
            </Badge>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Completed Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.id}
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">{feature.status}</Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-700 mb-2">Available Pages:</p>
                      {feature.pages.map((page, index) => (
                        <Link key={index} href={page.path}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left hover:bg-blue-50 hover:text-blue-700"
                            size="sm"
                          >
                            <ChartBar className="h-4 w-4 mr-2" />
                            {page.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Additional Pages */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Additional Pages</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {additionalPages.map((section, idx) => {
              const Icon = section.icon
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{section.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {section.pages.map((page, index) => (
                        <Link key={index} href={page.path}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left text-sm hover:bg-purple-50 hover:text-purple-700"
                            size="sm"
                          >
                            {page.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Platform Valuation</CardTitle>
            <CardDescription className="text-blue-100">
              World-class UI/UX with enterprise-grade functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold">$100B</div>
                <div className="text-sm text-blue-100">Target Valuation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">8</div>
                <div className="text-sm text-blue-100">Major Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">40+</div>
                <div className="text-sm text-blue-100">Pages Built</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-blue-100">Clickable & Interactive</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
