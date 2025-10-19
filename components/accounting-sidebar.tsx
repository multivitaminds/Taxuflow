"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  Building2,
  CreditCard,
  PieChart,
  Settings,
  ChevronLeft,
  Landmark,
  Package,
  Clock,
  TrendingUp,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/accounting", icon: LayoutDashboard },
  { name: "Books", href: "/books", icon: BookOpen },
  { name: "Invoices", href: "/accounting/invoices", icon: FileText },
  { name: "Bills", href: "/accounting/bills", icon: Receipt },
  { name: "Expenses", href: "/accounting/expenses", icon: Receipt },
  { name: "Customers", href: "/accounting/customers", icon: Users },
  { name: "Vendors", href: "/accounting/vendors", icon: Building2 },
  { name: "Chart of Accounts", href: "/accounting/chart-of-accounts", icon: TrendingUp },
  { name: "Bank Feeds", href: "/accounting/bank-feeds", icon: Landmark },
  { name: "Reports", href: "/accounting/reports", icon: PieChart },
  { name: "Products", href: "/accounting/products", icon: Package },
  { name: "Time Tracking", href: "/accounting/time", icon: Clock },
  { name: "Payments", href: "/accounting/payments", icon: CreditCard },
  { name: "Settings", href: "/accounting/settings", icon: Settings },
]

export function AccountingSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Link href="/accounting" className="text-xl font-bold">
            <span className="text-foreground">Tax</span>
            <span className="text-accent">u</span>
            <span className="text-muted-foreground text-sm ml-2">Accounting</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="p-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full bg-transparent" size={collapsed ? "icon" : "default"}>
            <TrendingUp className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Tax Dashboard</span>}
          </Button>
        </Link>
      </div>
    </div>
  )
}
