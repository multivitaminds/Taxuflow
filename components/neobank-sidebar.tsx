"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  PiggyBank,
  Wallet,
  ChevronLeft,
  History,
  Building2,
  TrendingUp,
  MapPin,
  Bitcoin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "Overview", href: "/neobank", icon: LayoutDashboard },
  { name: "Accounts", href: "/neobank/accounts", icon: Wallet },
  { name: "Cards", href: "/neobank/cards", icon: CreditCard },
  { name: "Transactions", href: "/neobank/transactions", icon: History },
  { name: "Transfers", href: "/neobank/transfers", icon: ArrowLeftRight },
  { name: "Tax Buckets", href: "/neobank/tax-buckets", icon: PiggyBank },
  { name: "Spending", href: "/neobank/spending", icon: TrendingUp },
  { name: "Crypto", href: "/neobank/crypto", icon: Bitcoin }, // Added Crypto link
  { name: "ATMs", href: "/neobank/atms", icon: MapPin },
]

export function NeobankSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#f7f9fc] border-r border-slate-200 transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        {!collapsed && (
          <Link href="/neobank" className="text-xl font-bold flex items-center gap-2">
            <span className="text-[#0a2540]">Tax</span>
            <span className="text-[#635bff]">u</span>
            <span className="text-slate-400 text-sm font-normal ml-1">Banking</span>
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

      <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/neobank" && pathname?.startsWith(item.href + "/"))
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
            <Building2 className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Main Dashboard</span>}
          </Button>
        </Link>
      </div>
    </div>
  )
}
