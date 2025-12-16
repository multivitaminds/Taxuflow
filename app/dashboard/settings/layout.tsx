"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ChevronLeft,
  User,
  Shield,
  Bell,
  Eye,
  Building2,
  Sliders,
  CreditCard,
  CheckSquare,
  FileText,
  LayoutGrid,
  Plug,
  Key,
  Lock,
  BarChart3,
  Users,
  Gift,
  UserCog,
  Briefcase,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = {
  team: [
    { name: "Users", href: "/dashboard/settings/users", icon: UserCog },
    { name: "Departments", href: "/dashboard/settings/departments", icon: Briefcase },
    { name: "Advisors", href: "/dashboard/settings/advisors", icon: UserCheck, badge: "1" },
  ],
  personal: [
    { name: "My Profile", href: "/dashboard/settings/profile", icon: User },
    { name: "Security", href: "/dashboard/settings/security", icon: Shield },
    { name: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
    { name: "Privacy", href: "/dashboard/settings/privacy", icon: Eye },
  ],
  company: [
    { name: "Company Profile", href: "/dashboard/settings/company", icon: Building2 },
    { name: "Controls", href: "/dashboard/settings/controls", icon: Sliders },
    { name: "Plan & Billing", href: "/dashboard/settings/billing", icon: CreditCard },
    { name: "Approvals", href: "/dashboard/settings/approvals", icon: CheckSquare },
    { name: "Policies", href: "/dashboard/settings/policies", icon: FileText },
    { name: "Categories", href: "/dashboard/settings/categories", icon: LayoutGrid },
    { name: "Integrations", href: "/dashboard/settings/integrations", icon: Plug },
    { name: "API Tokens", href: "/dashboard/settings/api-tokens", icon: Key },
    { name: "Taxu Vault", href: "/dashboard/settings/vault", icon: Lock },
    { name: "Company Security", href: "/dashboard/settings/company-security", icon: BarChart3 },
  ],
  other: [
    { name: "Team", href: "/dashboard/settings/team", icon: Users },
    { name: "Referrals", href: "/dashboard/settings/referrals", icon: Gift },
  ],
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
            sidebarCollapsed ? "w-16" : "w-64",
          )}
        >
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-slate-200">
            {!sidebarCollapsed && (
              <Link href="/dashboard" className="text-xl font-bold text-slate-900">
                Taxu
              </Link>
            )}
          </div>

          {/* Back Button */}
          <div className="p-3 border-b border-slate-200">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {!sidebarCollapsed && "Settings"}
              </Link>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-6">
            {/* Team Section */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Team</div>
              )}
              <div className="space-y-1">
                {navigation.team.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-slate-100 text-slate-900 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!sidebarCollapsed && <span className="flex-1">{item.name}</span>}
                      {!sidebarCollapsed && item.badge && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-200">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Personal Section */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Personal</div>
              )}
              <div className="space-y-1">
                {navigation.personal.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-slate-100 text-slate-900 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Company Section */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</div>
              )}
              <div className="space-y-1">
                {navigation.company.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-slate-100 text-slate-900 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Other Section */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Other</div>
              )}
              <div className="space-y-1">
                {navigation.other.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-slate-100 text-slate-900 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* Collapse Button */}
          <div className="p-3 border-t border-slate-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full justify-center text-slate-600 hover:text-slate-900"
            >
              <ChevronLeft className={cn("w-4 h-4 transition-transform", sidebarCollapsed && "rotate-180")} />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className={cn("flex-1 transition-all duration-300", sidebarCollapsed ? "ml-16" : "ml-64")}>
          <div className="max-w-5xl mx-auto p-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
