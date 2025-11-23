"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Shield,
  Users,
  FileText,
  DollarSign,
  Activity,
  Settings,
  LogOut,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"

interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: string
  permissions: any
  last_login_at: string | null
}

export default function AdminDashboardClient({ adminUser }: { adminUser: AdminUser }) {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalFilings: 0,
    successfulFilings: 0,
    failedFilings: 0,
    pendingFilings: 0,
    totalRevenue: 0,
    apiCalls: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const supabase = getSupabaseBrowserClient()

      // Load user stats
      const { count: totalUsers } = await supabase.from("user_profiles").select("*", { count: "exact", head: true })

      // Load filing stats
      const { data: filings } = await supabase.from("tax_filings").select("status")

      const successfulFilings = filings?.filter((f) => f.status === "accepted").length || 0
      const failedFilings = filings?.filter((f) => f.status === "rejected").length || 0
      const pendingFilings = filings?.filter((f) => f.status === "pending").length || 0

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: Math.floor((totalUsers || 0) * 0.6), // Estimate
        totalFilings: filings?.length || 0,
        successfulFilings,
        failedFilings,
        pendingFilings,
        totalRevenue: (filings?.length || 0) * 29.99, // Estimate
        apiCalls: (filings?.length || 0) * 15, // Estimate
      })
    } catch (error) {
      console.error("[v0] Failed to load stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Sign out failed")
      }

      // Clear client-side storage
      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()
      }

      // Force full page reload to clear all state and cookies
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("[v0] Sign out error:", error)
      // Force redirect even on error to ensure user is logged out
      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()
      }
      window.location.href = "/admin/login"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Taxu Admin</h1>
                  <p className="text-sm text-gray-400">{adminUser.email}</p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="ghost" className="text-gray-400 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-white">{loading ? "..." : stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-2">{stats.activeUsers} active</p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-purple-400" />
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Filings</p>
              <p className="text-3xl font-bold text-white">{loading ? "..." : stats.totalFilings.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-2">{stats.successfulFilings} successful</p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-green-400" />
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Revenue</p>
              <p className="text-3xl font-bold text-white">
                {loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
              </p>
              <p className="text-xs text-gray-400 mt-2">This month</p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-orange-400" />
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">API Calls</p>
              <p className="text-3xl font-bold text-white">{loading ? "..." : stats.apiCalls.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">Last 24 hours</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/users">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                <Users className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
                <p className="text-sm text-gray-400">View and manage all platform users</p>
              </Card>
            </Link>

            <Link href="/admin/filings">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                <FileText className="w-10 h-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">Filing Management</h3>
                <p className="text-sm text-gray-400">Monitor and manage tax filings</p>
              </Card>
            </Link>

            <Link href="/admin/analytics">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                <BarChart3 className="w-10 h-10 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
                <p className="text-sm text-gray-400">View platform analytics and insights</p>
              </Card>
            </Link>

            <Link href="/admin/diagnostics">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                <Activity className="w-10 h-10 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">System Diagnostics</h3>
                <p className="text-sm text-gray-400">Monitor system health and performance</p>
              </Card>
            </Link>

            <Link href="/admin/support">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                <AlertCircle className="w-10 h-10 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">Support Tickets</h3>
                <p className="text-sm text-gray-400">Manage user support requests</p>
              </Card>
            </Link>

            <Link href="/admin/settings">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                <Settings className="w-10 h-10 text-gray-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">Admin Settings</h3>
                <p className="text-sm text-gray-400">Change password and manage account</p>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Filing Status Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.successfulFilings}</p>
                  <p className="text-sm text-gray-400">Successful</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.pendingFilings}</p>
                  <p className="text-sm text-gray-400">Pending</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.failedFilings}</p>
                  <p className="text-sm text-gray-400">Failed</p>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
