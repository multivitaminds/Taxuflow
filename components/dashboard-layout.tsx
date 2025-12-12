"use client"

import type React from "react"

import { RoleBasedNavigation } from "@/components/role-based-navigation"
import { useDashboard } from "@/components/dashboard-provider"
import { Button } from "@/components/ui/button"
import { Menu, X, Settings, LogOut } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

export function DashboardLayout({ children, demoBanner }: { children: React.ReactNode; demoBanner?: React.ReactNode }) {
  const { user, profile } = useDashboard()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {demoBanner && <div className="fixed top-0 left-0 right-0 z-50">{demoBanner}</div>}

      <header className="sticky top-14 left-0 right-0 z-40 bg-white border-b border-slate-200 h-16">
        <div className="flex items-center justify-between h-full px-4 pr-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Link href="/dashboard" className="text-xl font-bold flex items-center gap-1">
              <span className="text-slate-900">Tax</span>
              <span className="text-indigo-600">u</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-slate-900">
              {profile?.full_name || user?.email?.split("@")[0] || "User"}
            </span>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <aside
        className={`fixed left-0 top-30 bottom-0 w-64 bg-white border-r border-slate-200 transition-transform duration-300 z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <RoleBasedNavigation />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="lg:ml-64 pt-30">{children}</main>
    </div>
  )
}
