"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function AuthButton() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn("[v0] Supabase not configured. Auth features will be disabled.")
      setLoading(false)
      return
    }

    const supabase = getSupabaseBrowserClient()

    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session with error handling
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("[v0] Session error:", error.message)
          // If refresh token is invalid, sign out to clear stale tokens
          if (error.message.includes("Invalid Refresh Token") || error.message.includes("Refresh Token Not Found")) {
            console.log("[v0] Clearing invalid session tokens")
            supabase.auth.signOut().catch(console.error)
          }
          setUser(null)
        } else {
          setUser(session?.user ?? null)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Unexpected auth error:", err)
        setUser(null)
        setLoading(false)
      })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return null
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-white hover:text-[#2ACBFF] hover:bg-white/5">
            <User className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        <Button onClick={handleSignOut} variant="ghost" className="text-white hover:text-red-400 hover:bg-white/5">
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login">
        <Button variant="ghost" className="text-white hover:text-[#2ACBFF] hover:bg-white/5">
          Sign in
        </Button>
      </Link>
      <Link href="/signup">
        <Button className="bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold">Get Started</Button>
      </Link>
    </div>
  )
}
