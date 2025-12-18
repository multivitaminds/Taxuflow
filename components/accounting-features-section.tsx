"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Receipt,
  Wallet,
  Users,
  Building2,
  BarChart3,
  CreditCard,
  FileText,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export function AccountingFeaturesSection() {
  const features = [
    {
      icon: Receipt,
      title: "Invoicing",
      description: "Create, send, and track professional invoices with automatic payment reminders",
      color: "text-blue-600",
      bg: "bg-blue-100",
      href: "/accounting/invoices",
    },
    {
      icon: Wallet,
      title: "Expense Tracking",
      description: "Automatically categorize expenses and capture receipts with AI",
      color: "text-green-600",
      bg: "bg-green-100",
      href: "/accounting/expenses",
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Manage customer relationships and track outstanding balances",
      color: "text-purple-600",
      bg: "bg-purple-100",
      href: "/accounting/customers",
    },
    {
      icon: Building2,
      title: "Vendor Management",
      description: "Track vendor bills, payments, and purchase orders",
      color: "text-red-600",
      bg: "bg-red-100",
      href: "/accounting/vendors",
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      description: "Generate P&L, Balance Sheet, Cash Flow, and tax reports instantly",
      color: "text-orange-600",
      bg: "bg-orange-100",
      href: "/accounting/reports",
    },
    {
      icon: CreditCard,
      title: "Banking",
      description: "Connect bank accounts and reconcile transactions automatically",
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      href: "/accounting/banking",
    },
    {
      icon: FileText,
      title: "Products & Services",
      description: "Manage your product catalog and service offerings",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      href: "/accounting/products",
    },
    {
      icon: TrendingUp,
      title: "Project Tracking",
      description: "Track project profitability with time and expense tracking",
      color: "text-pink-600",
      bg: "bg-pink-100",
      href: "/accounting/projects",
    },
  ]

  return (
    <section className="py-24 bg-[#f6f9fc] clip-diagonal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#0a2540]">
            Complete <span className="text-[#635bff]">QuickBooks-Style</span> Accounting
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to manage your business finances in one place. From invoicing to financial reports,
            we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="p-6 border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-1 cursor-pointer h-full bg-white group">
                <div
                  className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#0a2540]">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/accounting">
            <Button
              size="lg"
              className="bg-[#635bff] hover:bg-[#5851df] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Explore Accounting Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
