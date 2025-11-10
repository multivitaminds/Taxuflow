"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { createClient } from "@/lib/supabase/server"
import { DashboardProvider } from "@/components/dashboard-provider"
import type { User } from "@supabase/supabase-js"
import { redirect } from "next/navigation"

interface DashboardContextType {
  user: User | null
  profile: any | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
})

export function useDashboard() {
  return useContext(DashboardContext)
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabaseServer = await createClient()

  if (!supabaseServer) {
    console.log("[v0] Server: No Supabase client, redirecting to login")
    redirect("/login")
  }

  const {
    data: { user: currentUser },
    error,
  } = await supabaseServer.auth.getUser()

  if (error || !currentUser) {
    console.log("[v0] Server: No authenticated user, redirecting to login")
    redirect("/login")
  }

  // Fetch profile on server
  let serverProfile = null
  try {
    const { data } = await supabaseServer.from("user_profiles").select("*").eq("id", currentUser.id).maybeSingle()

    if (!data) {
      // Create profile if it doesn't exist
      const { data: newProfile } = await supabaseServer
        .from("user_profiles")
        .insert({
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.email?.split("@")[0] || "User",
        })
        .select()
        .maybeSingle()
      serverProfile = newProfile
    } else {
      serverProfile = data
    }
  } catch (error) {
    console.error("[v0] Error fetching profile:", error)
  }

  console.log("[v0] Server: Dashboard layout loaded for user:", currentUser.email)

  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        const {
          data: { user: browserUser },
        } = await supabase.auth.getUser()

        console.log("[v0] Auth check result:", browserUser ? `User found: ${browserUser.email}` : "No user")

        if (!isMounted) return

        if (!browserUser) {
          console.log("[v0] No authenticated user, redirecting to login")
          router.replace("/login")
          return
        }

        setUser(browserUser)
        await fetchProfile(browserUser.id, browserUser.email)
      } catch (error) {
        console.error("[v0] Auth error:", error)
        if (isMounted) {
          router.replace("/login")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    return () => {
      isMounted = false
    }
  }, []) // Empty dependency array to run only once

  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase.from("user_profiles").select("*").eq("id", userId).maybeSingle()

      if (!data) {
        const { data: newProfile } = await supabase
          .from("user_profiles")
          .insert({
            id: userId,
            email: userEmail,
            full_name: userEmail?.split("@")[0] || "User",
          })
          .select()
          .maybeSingle()
        setProfile(newProfile)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0C0E]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2ACBFF] border-t-transparent mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardProvider initialUser={currentUser} initialProfile={serverProfile}>
      {children}
    </DashboardProvider>
  )
}
