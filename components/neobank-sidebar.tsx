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
  ChevronDown,
  History,
  Building2,
  TrendingUp,
  MapPin,
  Bitcoin,
  FileText,
  Sparkles,
  Target,
  Globe,
  Store,
  Shield,
  Smartphone,
  BarChart3,
  Repeat,
  Coins,
  ChevronRight,
  Zap,
  DollarSign,
  Receipt,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigationGroups = [
  {
    name: "Overview",
    href: "/neobank",
    icon: LayoutDashboard,
    type: "single" as const,
  },
  {
    name: "Accounts & Cards",
    icon: Wallet,
    type: "group" as const,
    items: [
      { name: "Accounts", href: "/neobank/accounts", icon: Wallet },
      { name: "All Cards", href: "/neobank/cards", icon: CreditCard },
      { name: "Virtual Cards", href: "/neobank/virtual-cards", icon: Smartphone },
    ],
  },
  {
    name: "Transactions",
    icon: History,
    type: "group" as const,
    items: [
      { name: "All Transactions", href: "/neobank/transactions", icon: History },
      { name: "Transfers", href: "/neobank/transfers", icon: ArrowLeftRight },
      { name: "International", href: "/neobank/international", icon: Globe },
      { name: "Multi-Currency", href: "/neobank/multi-currency", icon: Coins },
    ],
  },
  {
    name: "Payments & Bills",
    icon: Receipt,
    type: "group" as const,
    items: [
      { name: "Bill Pay", href: "/neobank/bill-pay", icon: FileText },
      { name: "Subscriptions", href: "/neobank/subscriptions", icon: Repeat },
    ],
  },
  {
    name: "Money Management",
    icon: Target,
    type: "group" as const,
    items: [
      { name: "Budgets", href: "/neobank/budgets", icon: BarChart3 },
      { name: "Goals", href: "/neobank/goals", icon: Target },
      { name: "Tax Buckets", href: "/neobank/tax-buckets", icon: PiggyBank },
      { name: "Cash Flow", href: "/neobank/cash-flow", icon: TrendingUp },
    ],
  },
  {
    name: "Wealth & Investments",
    icon: TrendingUp,
    type: "group" as const,
    items: [
      { name: "Investments", href: "/neobank/investments", icon: TrendingUp },
      { name: "Wealth Hub", href: "/neobank/wealth", icon: Sparkles },
      { name: "Savings Auto", href: "/neobank/savings-automation", icon: PiggyBank },
      { name: "Robo-Advisor", href: "/neobank/robo-advisor", icon: Zap },
    ],
  },
  {
    name: "Business Services",
    icon: Building2,
    type: "group" as const,
    items: [
      { name: "Business Hub", href: "/neobank/business", icon: Building2 },
      { name: "Merchant", href: "/neobank/merchant", icon: Store },
    ],
  },
  {
    name: "Credit & Lending",
    icon: DollarSign,
    type: "group" as const,
    items: [
      { name: "Credit Score", href: "/neobank/credit-score", icon: Shield },
      { name: "Loans", href: "/neobank/loans", icon: CreditCard },
      { name: "Insurance", href: "/neobank/insurance", icon: Shield },
    ],
  },
  {
    name: "Analytics & Reports",
    icon: Lightbulb,
    type: "group" as const,
    items: [
      { name: "Insights", href: "/neobank/insights", icon: Sparkles },
      { name: "Spending", href: "/neobank/spending", icon: BarChart3 },
      { name: "Reports", href: "/neobank/reports", icon: FileText },
    ],
  },
  {
    name: "More Services",
    icon: MapPin,
    type: "group" as const,
    items: [
      { name: "Crypto", href: "/neobank/crypto", icon: Bitcoin },
      { name: "ATM Locator", href: "/neobank/atms", icon: MapPin },
    ],
  },
]
// </CHANGE>

export function NeobankSidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Accounts & Cards": true,
  })

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }))
  }

  const isGroupActive = (items: { href: string }[]) => {
    return items.some((item) => pathname === item.href || pathname?.startsWith(item.href + "/"))
  }

  return (
    <div className="fixed left-0 top-[38px] h-[calc(100vh-38px)] bg-white border-r border-slate-200/60 transition-all duration-300 z-40 w-64 shadow-[0_0_40px_rgba(0,0,0,0.04)]">
      <div className="relative p-5 border-b border-slate-100/80 bg-gradient-to-br from-slate-50/80 via-white to-indigo-50/20">
        <Link href="/neobank" className="text-xl font-bold flex items-center gap-2">
          <span className="text-[#0f172a] tracking-tight">Tax</span>
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
            u
          </span>
          <span className="text-slate-400 text-[10px] font-semibold ml-1.5 uppercase tracking-widest">Banking</span>
        </Link>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>
      {/* </CHANGE> */}

      <nav className="p-3 space-y-0.5 overflow-y-auto h-[calc(100vh-180px)] custom-scrollbar">
        {/* </CHANGE> */}
        {navigationGroups.map((item) => {
          if (item.type === "single") {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 to-violet-50/80 text-indigo-700 shadow-sm shadow-indigo-100/50"
                    : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900",
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 rounded-xl" />
                )}
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] flex-shrink-0 transition-colors relative z-10",
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600",
                  )}
                />
                <span className="relative z-10">{item.name}</span>
              </Link>
              // </CHANGE>
            )
          }

          const isExpanded = expandedGroups[item.name]
          const hasActiveChild = item.items && isGroupActive(item.items)

          return (
            <div key={item.name} className="space-y-0.5">
              <button
                onClick={() => toggleGroup(item.name)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  hasActiveChild
                    ? "bg-gradient-to-r from-indigo-50/70 to-violet-50/50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50/80 hover:text-slate-900",
                )}
              >
                {hasActiveChild && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 rounded-xl" />
                )}
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] flex-shrink-0 transition-colors relative z-10",
                    hasActiveChild ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600",
                  )}
                />
                <span className="flex-1 text-left relative z-10">{item.name}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-all duration-200 relative z-10",
                    isExpanded ? "rotate-180" : "",
                    hasActiveChild ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600",
                  )}
                />
              </button>
              {/* </CHANGE> */}

              {isExpanded && item.items && (
                <div className="ml-4 pl-4 border-l border-slate-100/80 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                  {item.items.map((subItem) => {
                    const isActive = pathname === subItem.href || pathname?.startsWith(subItem.href + "/")
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 relative group",
                          isActive
                            ? "bg-gradient-to-r from-indigo-50 to-violet-50/60 text-indigo-700 shadow-sm"
                            : "text-slate-600 hover:bg-slate-50/60 hover:text-slate-900",
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-[2px] h-4 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
                        )}
                        <subItem.icon
                          className={cn(
                            "h-[16px] w-[16px] flex-shrink-0 transition-colors",
                            isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600",
                          )}
                        />
                        <span>{subItem.name}</span>
                      </Link>
                      // </CHANGE>
                    )
                  })}
                </div>
                // </CHANGE>
              )}
            </div>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100/80 bg-gradient-to-t from-slate-50/60 via-white/80 to-white backdrop-blur-sm">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="w-full bg-white/80 border-slate-200/80 text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/30 hover:text-slate-900 hover:border-indigo-200/50 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <Building2 className="h-4 w-4 mr-2 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            <span className="font-semibold">Main Dashboard</span>
            <ChevronRight className="h-3.5 w-3.5 ml-auto text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </Button>
        </Link>
      </div>
      {/* </CHANGE> */}
    </div>
  )
}
