"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface DashboardContextType {
  user: User | null
  profile: any | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType>({
  user: null,
  profile: null,
  loading: false,
  refreshProfile: async () => {},
})

export function useDashboard() {
  return useContext(DashboardContext)
}

export function DashboardProvider({
  children,
  initialUser,
  initialProfile,
}: {
  children: ReactNode
  initialUser: User
  initialProfile: any
}) {
  const [user] = useState<User | null>(initialUser)
  const [profile, setProfile] = useState<any>(initialProfile)
  const [loading] = useState(false)

  const refreshProfile = async () => {
    if (user) {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data } = await supabase.from("user_profiles").select("*").eq("id", user.id).maybeSingle()
        if (data) {
          setProfile(data)
        }
      } catch (error) {
        console.error("[v0] Error refreshing profile:", error)
      }
    }
  }

  return (
    <DashboardContext.Provider value={{ user, profile, loading, refreshProfile }}>{children}</DashboardContext.Provider>
  )
}
