"use client"

import Link from "next/link"
import { FileText, Wallet, Users, BarChart3, Building2, CreditCard, Package, TrendingUp } from "lucide-react"

const menuItems = [
  {
    title: "Invoices",
    icon: FileText,
    href: "/accounting/invoices",
    description: "Create professional invoices and get paid faster",
    color: "blue",
  },
  {
    title: "Expenses",
    icon: Wallet,
    href: "/accounting/expenses",
    description: "Capture receipts and categorize expenses automatically",
    color: "green",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/accounting/customers",
    description: "Track customer relationships and payment history",
    color: "purple",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/accounting/reports",
    description: "Real-time P&L, balance sheets, and cash flow",
    color: "orange",
  },
  {
    title: "Vendors",
    icon: Building2,
    href: "/accounting/vendors",
    description: "Manage bills and vendor relationships",
    color: "red",
  },
  {
    title: "Banking",
    icon: CreditCard,
    href: "/accounting/banking",
    description: "Connect accounts and reconcile transactions",
    color: "cyan",
  },
  {
    title: "Products",
    icon: Package,
    href: "/accounting/products",
    description: "Manage your product catalog and pricing",
    color: "yellow",
  },
  {
    title: "Projects",
    icon: TrendingUp,
    href: "/accounting/projects",
    description: "Track project progress and profitability",
    color: "pink",
  },
]

const colorClasses = {
  blue: "text-blue-600 bg-blue-50 group-hover:bg-blue-100",
  green: "text-green-600 bg-green-50 group-hover:bg-green-100",
  purple: "text-purple-600 bg-purple-50 group-hover:bg-purple-100",
  orange: "text-orange-600 bg-orange-50 group-hover:bg-orange-100",
  red: "text-red-600 bg-red-50 group-hover:bg-red-100",
  cyan: "text-cyan-600 bg-cyan-50 group-hover:bg-cyan-100",
  yellow: "text-yellow-600 bg-yellow-50 group-hover:bg-yellow-100",
  pink: "text-pink-600 bg-pink-50 group-hover:bg-pink-100",
}

export function AccountingMenuGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {menuItems.map((item) => {
        const Icon = item.icon
        const colorClass = colorClasses[item.color as keyof typeof colorClasses]
        return (
          <Link
            key={item.title}
            href={item.href}
            className="group relative flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-md transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer"
          >
            <div className={`mb-4 p-4 rounded-xl ${colorClass} transition-colors`}>
              <Icon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </Link>
        )
      })}
    </div>
  )
}
