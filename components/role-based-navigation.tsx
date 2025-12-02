"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useDashboard } from "@/components/dashboard-provider"
import {
  LayoutDashboard,
  Building2,
  Wallet,
  FileText,
  Code2,
  Settings,
  CreditCard,
  Users,
  ChevronDown,
  ChevronRight,
  Home,
  Repeat,
  PiggyBank,
  TrendingUp,
  Bitcoin,
  MapPin,
  Receipt,
  FileSpreadsheet,
  ShoppingCart,
  BarChart3,
  Upload,
  FileCheck,
  List,
  PlusCircle,
  PieChart,
  Search,
  Shield,
  Zap,
} from "lucide-react"
import { useState } from "react"

export function RoleBasedNavigation() {
  const pathname = usePathname()
  const { userType, features, canAccess } = useDashboard()
  const [neobankExpanded, setNeobankExpanded] = useState(pathname?.startsWith("/neobank"))
  const [accountingExpanded, setAccountingExpanded] = useState(
    pathname?.startsWith("/accounting") || pathname?.startsWith("/books"),
  )
  const [taxFilingExpanded, setTaxFilingExpanded] = useState(
    pathname?.startsWith("/dashboard/filing") ||
      pathname?.startsWith("/dashboard/file/") ||
      pathname?.startsWith("/1099-filing"),
  )
  const [investmentExpanded, setInvestmentExpanded] = useState(pathname?.startsWith("/investment"))

  const getNavigationItems = () => {
    const taxFilingItem = {
      name: "Tax Filing",
      icon: FileText,
      show: true,
      isExpandable: true,
      expanded: taxFilingExpanded,
      onToggle: () => setTaxFilingExpanded(!taxFilingExpanded),
      subItems: [
        {
          name: "Filing Dashboard",
          href: "/dashboard/filing",
          icon: LayoutDashboard,
        },
        {
          name: "New Filing",
          href: "/dashboard/filing/new",
          icon: PlusCircle,
        },
        {
          name: "File W-2",
          href: "/dashboard/file/w2",
          icon: FileCheck,
        },
        {
          name: "File 1099-NEC",
          href: "/dashboard/file/1099-nec",
          icon: FileSpreadsheet,
        },
        {
          name: "File Form 941",
          href: "/dashboard/file/941",
          icon: Receipt,
        },
        {
          name: "Upload Documents",
          href: "/dashboard/documents/upload",
          icon: Upload,
        },
        {
          name: "View All Filings",
          href: "/1099-filing",
          icon: List,
        },
      ],
    }

    const neobankItem = {
      name: "Neobank",
      icon: Wallet,
      show: true,
      isExpandable: true,
      expanded: neobankExpanded,
      onToggle: () => setNeobankExpanded(!neobankExpanded),
      subItems: [
        {
          name: "Overview",
          href: "/neobank",
          icon: Home,
        },
        {
          name: "Accounts",
          href: "/neobank/accounts",
          icon: Wallet,
        },
        {
          name: "Cards",
          href: "/neobank/cards",
          icon: CreditCard,
        },
        {
          name: "Transfers",
          href: "/neobank/transfers",
          icon: Repeat,
        },
        {
          name: "Tax Buckets",
          href: "/neobank/tax-buckets",
          icon: PiggyBank,
        },
        {
          name: "Spending",
          href: "/neobank/spending",
          icon: TrendingUp,
        },
        {
          name: "Crypto",
          href: "/neobank/crypto",
          icon: Bitcoin,
        },
        {
          name: "ATM Locator",
          href: "/neobank/atms",
          icon: MapPin,
        },
      ],
    }

    const investmentItem = {
      name: "Investment",
      icon: TrendingUp,
      show: true,
      isExpandable: true,
      expanded: investmentExpanded,
      onToggle: () => setInvestmentExpanded(!investmentExpanded),
      subItems: [
        {
          name: "Investing",
          href: "/investment",
          icon: LayoutDashboard,
        },
        {
          name: "Portfolio",
          href: "/investment/portfolio",
          icon: PieChart,
        },
        {
          name: "Markets",
          href: "/investment/markets",
          icon: Search,
        },
        {
          name: "Tax Optimizer",
          href: "/investment/tax-optimizer",
          icon: Shield,
        },
        {
          name: "Auto-Invest",
          href: "/investment/auto-invest",
          icon: Zap,
        },
        {
          name: "Performance",
          href: "/investment/performance",
          icon: TrendingUp,
        },
      ],
    }

    const accountingItem = {
      name: "Accounting",
      icon: Building2,
      show: true,
      isExpandable: true,
      expanded: accountingExpanded,
      onToggle: () => setAccountingExpanded(!accountingExpanded),
      subItems: [
        {
          name: "Overview",
          href: "/books",
          icon: LayoutDashboard,
        },
        {
          name: "Invoices",
          href: "/accounting/invoices",
          icon: Receipt,
        },
        {
          name: "Expenses",
          href: "/accounting/expenses",
          icon: FileSpreadsheet,
        },
        {
          name: "Customers",
          href: "/accounting/customers",
          icon: Users,
        },
        {
          name: "Vendors",
          href: "/accounting/vendors",
          icon: ShoppingCart,
        },
        {
          name: "Reports",
          href: "/accounting/reports",
          icon: BarChart3,
        },
        {
          name: "Banking",
          href: "/accounting/banking",
          icon: Wallet,
        },
      ],
    }

    const navigationItems = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        show: true,
      },
      taxFilingItem,
      neobankItem,
      investmentItem,
      accountingItem,
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        show: true,
      },
    ]

    // Add developer-specific items
    if (userType === "developer" && canAccess("developer_portal")) {
      navigationItems.splice(1, 0, {
        name: "Developer Portal",
        href: "/developer-portal",
        icon: Code2,
        show: true,
      })
    }

    return navigationItems.filter((item) => item.show)
  }

  const navigationItems = getNavigationItems()

  return (
    <nav className="flex flex-col gap-1 p-4">
      {navigationItems.map((item) => {
        if (item.isExpandable) {
          // Render expandable section
          return (
            <div key={item.name}>
              <button
                onClick={item.onToggle}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  (item.name === "Neobank" && pathname?.startsWith("/neobank")) ||
                    (item.name === "Accounting" &&
                      (pathname?.startsWith("/accounting") || pathname?.startsWith("/books"))) ||
                    (item.name === "Tax Filing" &&
                      (pathname?.startsWith("/dashboard/filing") ||
                        pathname?.startsWith("/dashboard/file/") ||
                        pathname?.startsWith("/1099-filing"))) ||
                    (item.name === "Investment" && pathname?.startsWith("/investment"))
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                {item.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {item.expanded && item.subItems && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 pl-2">
                  {item.subItems.map((subItem) => {
                    const isActive = pathname === subItem.href
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-indigo-100 text-indigo-700 font-medium"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span>{subItem.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        }

        // Regular navigation item
        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
