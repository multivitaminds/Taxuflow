"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Key, BarChart3, FileText, Settings, Shield, Webhook, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Overview",
    href: "/developer-portal",
    icon: LayoutDashboard,
  },
  {
    title: "API Keys",
    href: "/developer-portal/keys",
    icon: Key,
  },
  {
    title: "Analytics",
    href: "/developer-portal/analytics",
    icon: BarChart3,
  },
  {
    title: "Logs",
    href: "/developer-portal/logs",
    icon: FileText,
  },
  {
    title: "Webhooks",
    href: "/developer-portal/webhooks",
    icon: Webhook,
  },
  {
    title: "Status",
    href: "/developer-portal/status",
    icon: Activity,
  },
  {
    title: "Rate Limits",
    href: "/developer-portal/rate-limits",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/developer-portal/settings",
    icon: Settings,
  },
]

export function DeveloperPortalSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-card hidden lg:block min-h-[calc(100vh-4rem)]">
      <div className="p-6">
        <h2 className="font-semibold text-lg mb-6 px-2">Developer Console</h2>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t mt-auto">
        <div className="bg-accent/10 rounded-lg p-4">
          <p className="text-xs font-medium text-accent mb-2">Current Plan: Starter</p>
          <div className="w-full bg-background rounded-full h-1.5 mb-2">
            <div className="bg-accent h-1.5 rounded-full w-[45%]" />
          </div>
          <p className="text-[10px] text-muted-foreground">4.5k / 10k API calls</p>
        </div>
      </div>
    </div>
  )
}
