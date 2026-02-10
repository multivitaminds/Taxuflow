"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import DiagnosticsClient from "@/components/diagnostics-client"

export default function AdminDiagnosticsPage() {
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
        console.error("[v0] Admin diagnostics: Error during auth check", error)
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
          <p className="text-muted-foreground">Loading diagnostics...</p>
        </div>
      </div>
    )
  }

  if (!adminUser) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <DiagnosticsClient userEmail={adminUser.email} />
      </div>
    </div>
  )
}
