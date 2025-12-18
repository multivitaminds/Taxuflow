"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function AuthButton() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
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
    const supabase = createClient()
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
