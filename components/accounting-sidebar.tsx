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
  UserCog,
  Calculator,
  FolderOpen,
  Warehouse,
  Wallet,
  FolderClosed,
  Activity,
  Mail,
  Import,
  Target,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/accounting", icon: LayoutDashboard },
  { name: "Features Directory", href: "/accounting/directory", icon: FolderOpen },
  { name: "Activity Feed", href: "/accounting/activity", icon: Activity },
  { name: "Books", href: "/books", icon: BookOpen },
  { name: "Invoices", href: "/accounting/invoices", icon: FileText },
  { name: "Estimates", href: "/accounting/estimates", icon: FileText },
  { name: "Sales Orders", href: "/accounting/sales-orders", icon: FileText },
  { name: "Bills", href: "/accounting/bills", icon: Receipt },
  { name: "Expenses", href: "/accounting/expenses", icon: Receipt },
  { name: "Customers", href: "/accounting/customers", icon: Users },
  { name: "Vendors", href: "/accounting/vendors", icon: Building2 },
  { name: "Employees", href: "/accounting/employees", icon: UserCog },
  { name: "Chart of Accounts", href: "/accounting/chart-of-accounts", icon: TrendingUp },
  { name: "Bank Feeds", href: "/accounting/bank-feeds", icon: Landmark },
  { name: "Credit Cards", href: "/accounting/credit-cards", icon: CreditCard },
  { name: "Budget & Forecasting", href: "/accounting/budget", icon: Wallet },
  { name: "Financial Ratios", href: "/accounting/ratios", icon: Calculator },
  { name: "Performance Metrics", href: "/accounting/performance", icon: Target },
  { name: "Reports", href: "/accounting/reports", icon: PieChart },
  { name: "Products", href: "/accounting/products", icon: Package },
  { name: "Inventory", href: "/accounting/inventory", icon: Warehouse },
  { name: "Fixed Assets", href: "/accounting/assets", icon: Package },
  { name: "Purchase Orders", href: "/accounting/purchase-orders", icon: FileText },
  { name: "Documents", href: "/accounting/documents", icon: FolderClosed },
  { name: "Email Templates", href: "/accounting/email-templates", icon: Mail },
  { name: "Import/Export", href: "/accounting/import-export", icon: Import },
  { name: "Backup & Restore", href: "/accounting/backup", icon: Database },
  { name: "Time Tracking", href: "/accounting/time", icon: Clock },
  { name: "Payments", href: "/accounting/payments", icon: CreditCard },
  { name: "Tax Management", href: "/accounting/tax", icon: Calculator },
  { name: "Settings", href: "/accounting/settings", icon: Settings },
]

export function AccountingSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "fixed left-0 top-[48px] h-[calc(100vh-48px)] bg-[#f7f9fc] border-r border-slate-200 transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        {!collapsed && (
          <Link href="/accounting" className="text-xl font-bold flex items-center gap-2">
            <span className="text-[#0a2540]">Tax</span>
            <span className="text-[#635bff]">u</span>
            <span className="text-slate-400 text-sm font-normal ml-1">Accounting</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-400 hover:text-[#0a2540]"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-188px)]">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#e3e8ee] text-[#0a2540]"
                  : "text-slate-600 hover:bg-white hover:text-[#0a2540] hover:shadow-sm",
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-[#635bff]" : "text-slate-400")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="w-full bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0a2540]"
            size={collapsed ? "icon" : "default"}
          >
            <TrendingUp className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Tax Dashboard</span>}
          </Button>
        </Link>
      </div>
    </div>
  )
}
