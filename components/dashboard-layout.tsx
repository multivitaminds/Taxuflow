"use client"

import type React from "react"

import { RoleBasedNavigation } from "@/components/role-based-navigation"
import { useDashboard } from "@/components/dashboard-provider"
import { Button } from "@/components/ui/button"
import { Menu, X, Settings, LogOut } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = useDashboard()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-14 left-0 right-0 z-40 bg-white border-b border-slate-200 h-9">
        <div className="flex items-center justify-between h-full px-4 pr-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-7 w-7"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            <Link href="/dashboard" className="text-lg font-bold flex items-center gap-1">
              <span className="text-slate-900">Tax</span>
              <span className="text-indigo-600">u</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-900">
              {profile?.full_name || user?.email?.split("@")[0] || "User"}
            </span>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Settings</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <aside
        className={`fixed left-0 top-[92px] bottom-0 w-64 bg-white border-r border-slate-200 transition-transform duration-300 z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <RoleBasedNavigation />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="lg:ml-64 pt-6 px-6">{children}</main>
    </div>
  )
}
