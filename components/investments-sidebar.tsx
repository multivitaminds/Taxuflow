"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, TrendingUp, PieChart, BarChart3, DollarSign, Activity, Settings, FileText } from "lucide-react"

const navigation = [
  { name: "Portfolio", href: "/investments", icon: Home },
  { name: "Holdings", href: "/investments/holdings", icon: PieChart },
  { name: "Performance", href: "/investments/performance", icon: TrendingUp },
  { name: "Markets", href: "/investments/markets", icon: BarChart3 },
  { name: "Transactions", href: "/investments/transactions", icon: Activity },
  { name: "Tax Reports", href: "/investments/tax-reports", icon: FileText },
  { name: "Cash Management", href: "/investments/cash", icon: DollarSign },
  { name: "Settings", href: "/investments/settings", icon: Settings },
]

export function InvestmentsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-64 border-r border-slate-200 bg-white overflow-y-auto">
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
