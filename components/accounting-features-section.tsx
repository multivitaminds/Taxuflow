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
      color: "text-blue-500",
      href: "/accounting/invoices",
    },
    {
      icon: Wallet,
      title: "Expense Tracking",
      description: "Automatically categorize expenses and capture receipts with AI",
      color: "text-green-500",
      href: "/accounting/expenses",
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Manage customer relationships and track outstanding balances",
      color: "text-purple-500",
      href: "/accounting/customers",
    },
    {
      icon: Building2,
      title: "Vendor Management",
      description: "Track vendor bills, payments, and purchase orders",
      color: "text-red-500",
      href: "/accounting/vendors",
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      description: "Generate P&L, Balance Sheet, Cash Flow, and tax reports instantly",
      color: "text-orange-500",
      href: "/accounting/reports",
    },
    {
      icon: CreditCard,
      title: "Banking",
      description: "Connect bank accounts and reconcile transactions automatically",
      color: "text-cyan-500",
      href: "/accounting/banking",
    },
    {
      icon: FileText,
      title: "Products & Services",
      description: "Manage your product catalog and service offerings",
      color: "text-yellow-500",
      href: "/accounting/products",
    },
    {
      icon: TrendingUp,
      title: "Project Tracking",
      description: "Track project profitability with time and expense tracking",
      color: "text-pink-500",
      href: "/accounting/projects",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Complete <span className="text-neon">Professional</span> Accounting
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to manage your business finances in one place. From invoicing to financial reports,
            we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 transition-all hover:scale-105 cursor-pointer h-full">
                <feature.icon className={`w-10 h-10 ${feature.color} mb-4`} />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/accounting">
            <Button size="lg" className="bg-neon hover:bg-neon/90 text-background">
              Explore Accounting Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
