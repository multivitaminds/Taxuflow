"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  User,
  Shield,
  Bell,
  Lock,
  Building2,
  SettingsIcon,
  CreditCard,
  CheckSquare,
  FileText,
  Tag,
  Plug,
  Key,
  Vault,
  Users,
  Gift,
} from "lucide-react"

const navigation = [
  {
    name: "Personal",
    items: [
      { name: "My Profile", href: "/dashboard/settings/profile", icon: User },
      { name: "Security", href: "/dashboard/settings/security", icon: Shield },
      { name: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
      { name: "Privacy", href: "/dashboard/settings/privacy", icon: Lock },
    ],
  },
  {
    name: "Company",
    items: [
      { name: "Company Profile", href: "/dashboard/settings/company", icon: Building2 },
      { name: "Controls", href: "/dashboard/settings/controls", icon: SettingsIcon },
      { name: "Plan & Billing", href: "/dashboard/settings/billing", icon: CreditCard },
      { name: "Approvals", href: "/dashboard/settings/approvals", icon: CheckSquare },
      { name: "Policies", href: "/dashboard/settings/policies", icon: FileText },
      { name: "Categories", href: "/dashboard/settings/categories", icon: Tag },
      { name: "Integrations", href: "/dashboard/settings/integrations", icon: Plug },
      { name: "API Tokens", href: "/dashboard/settings/api-tokens", icon: Key },
      { name: "Taxu Vault", href: "/dashboard/settings/vault", icon: Vault },
      { name: "Company Security", href: "/dashboard/settings/company-security", icon: Shield },
      { name: "Team", href: "/dashboard/settings/team", icon: Users },
    ],
  },
  {
    name: "Other",
    items: [{ name: "Referrals", href: "/dashboard/settings/referrals", icon: Gift }],
  },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r border-[#e0e6ed] bg-white">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[#64748b] hover:text-[#0f172a]">
          <span>←</span>
          <span>Settings</span>
        </Link>
      </div>

      <nav className="px-3">
        {navigation.map((section) => (
          <div key={section.name} className="mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-[#64748b] uppercase tracking-wider">{section.name}</h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-[#f1f5f9] text-[#0f172a] font-medium"
                        : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
