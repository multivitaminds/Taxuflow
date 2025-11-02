"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, TrendingUp, DollarSign, PieChart, Download, Calendar } from "lucide-react"
import Link from "next/link"

export function ReportsClient() {
  const reportCategories = [
    {
      title: "Financial Statements",
      reports: [
        {
          name: "Profit & Loss",
          description: "Income and expenses over time",
          icon: TrendingUp,
          href: "/accounting/reports/profit-loss",
        },
        {
          name: "Balance Sheet",
          description: "Assets, liabilities, and equity",
          icon: PieChart,
          href: "/accounting/reports/balance-sheet",
        },
        {
          name: "Cash Flow Statement",
          description: "Cash inflows and outflows",
          icon: DollarSign,
          href: "/accounting/reports/cash-flow",
        },
      ],
    },
    {
      title: "Sales Reports",
      reports: [
        {
          name: "Sales by Customer",
          description: "Revenue breakdown by customer",
          icon: FileText,
          href: "/accounting/reports/sales-by-customer",
        },
        {
          name: "Sales by Product",
          description: "Revenue breakdown by product/service",
          icon: FileText,
          href: "/accounting/reports/sales-by-product",
        },
        {
          name: "Invoice List",
          description: "All invoices with status",
          icon: FileText,
          href: "/accounting/reports/invoice-list",
        },
      ],
    },
    {
      title: "Expense Reports",
      reports: [
        {
          name: "Expenses by Category",
          description: "Spending breakdown by category",
          icon: FileText,
          href: "/accounting/reports/expenses-by-category",
        },
        {
          name: "Expenses by Vendor",
          description: "Spending breakdown by vendor",
          icon: FileText,
          href: "/accounting/reports/expenses-by-vendor",
        },
        {
          name: "Bill List",
          description: "All bills with payment status",
          icon: FileText,
          href: "/accounting/reports/bill-list",
        },
      ],
    },
    {
      title: "Accounts Receivable",
      reports: [
        {
          name: "A/R Aging Summary",
          description: "Outstanding invoices by age",
          icon: Calendar,
          href: "/accounting/reports/ar-aging",
        },
        {
          name: "Customer Balance Detail",
          description: "Detailed customer balances",
          icon: FileText,
          href: "/accounting/reports/customer-balance",
        },
      ],
    },
    {
      title: "Accounts Payable",
      reports: [
        {
          name: "A/P Aging Summary",
          description: "Outstanding bills by age",
          icon: Calendar,
          href: "/accounting/reports/ap-aging",
        },
        {
          name: "Vendor Balance Detail",
          description: "Detailed vendor balances",
          icon: FileText,
          href: "/accounting/reports/vendor-balance",
        },
      ],
    },
    {
      title: "Tax Reports",
      reports: [
        {
          name: "Sales Tax Summary",
          description: "Sales tax collected and owed",
          icon: FileText,
          href: "/accounting/reports/sales-tax",
        },
        {
          name: "Tax Deductions",
          description: "Tax-deductible expenses",
          icon: FileText,
          href: "/accounting/reports/tax-deductions",
        },
      ],
    },
  ]

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Financial reports and analytics</p>
      </div>

      {/* Report Categories */}
      <div className="space-y-8">
        {reportCategories.map((category) => (
          <div key={category.title}>
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.reports.map((report) => (
                <Link key={report.name} href={report.href}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <report.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{report.name}</h3>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="ghost" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
