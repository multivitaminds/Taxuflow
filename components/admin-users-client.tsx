"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Users,
  ArrowLeft,
  Search,
  Mail,
  Calendar,
} from "lucide-react"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  subscription_tier: string | null
}

export default function AdminUsersClient({ adminUser }: { adminUser: any }) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, email, full_name, created_at, subscription_tier")
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("[v0] Failed to load users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">User Management</h1>
                  <p className="text-sm text-gray-400">{filteredUsers.length} users</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(user.full_name || user.email || "?")[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.full_name || "No name"}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="border-white/20 text-gray-300"
                      >
                        {user.subscription_tier || "Free"}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No users found.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
