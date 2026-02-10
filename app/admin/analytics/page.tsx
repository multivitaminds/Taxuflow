"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import AdminAnalyticsClient from "@/components/admin-analytics-client"

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createBrowserClient()

      if (!supabase) {
        router.push("/admin/login")
        return
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/admin/login")
          return
        }

        const { data: admin } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (!admin) {
          router.push("/admin/unauthorized")
          return
        }

        setAdminUser(admin)
      } catch (error) {
        console.error("[v0] Admin analytics: Error during auth check", error)
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!adminUser) return null

  return <AdminAnalyticsClient adminUser={adminUser} />
}
