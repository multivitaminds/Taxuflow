"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  BarChart3,
  ArrowLeft,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
} from "lucide-react"

export default function AdminAnalyticsClient({ adminUser }: { adminUser: any }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    totalFilings: 0,
    filingsThisMonth: 0,
    revenue: 0,
    avgFilingsPerUser: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const supabase = getSupabaseBrowserClient()

      const { count: totalUsers } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })

      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: newUsersThisMonth } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString())

      const { data: filings } = await supabase
        .from("tax_filings")
        .select("id, created_at, status")

      const totalFilings = filings?.length || 0
      const filingsThisMonth =
        filings?.filter((f) => new Date(f.created_at) >= startOfMonth).length || 0

      setStats({
        totalUsers: totalUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        totalFilings,
        filingsThisMonth,
        revenue: totalFilings * 29.99,
        avgFilingsPerUser: totalUsers ? +(totalFilings / totalUsers).toFixed(1) : 0,
      })
    } catch (error) {
      console.error("[v0] Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      sub: `+${stats.newUsersThisMonth} this month`,
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Total Filings",
      value: stats.totalFilings.toLocaleString(),
      sub: `+${stats.filingsThisMonth} this month`,
      icon: FileText,
      color: "text-purple-400",
    },
    {
      label: "Est. Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      sub: "Lifetime",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      label: "Avg. Filings / User",
      value: String(stats.avgFilingsPerUser),
      sub: "All time",
      icon: TrendingUp,
      color: "text-orange-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Analytics</h1>
                <p className="text-sm text-gray-400">Platform insights and metrics</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card) => (
              <Card key={card.label} className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <card.icon className={`w-8 h-8 ${card.color}`} />
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-gray-400 text-sm mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-white">
                  {loading ? "..." : card.value}
                </p>
                <p className="text-xs text-gray-500 mt-2">{card.sub}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
              <div className="h-48 flex items-end justify-between gap-2 px-4">
                {[35, 45, 40, 55, 65, 50, 70, 80, 75, 90, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] text-gray-500">
                      {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filing Volume</h3>
              <div className="h-48 flex items-end justify-between gap-2 px-4">
                {[20, 30, 50, 45, 60, 55, 70, 90, 85, 95, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] text-gray-500">
                      {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
