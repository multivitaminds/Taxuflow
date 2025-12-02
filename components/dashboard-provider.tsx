"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { getFeaturesByUserType, type UserType, type FeatureAccess } from "@/lib/role-utils"

interface DashboardContextType {
  user: User | null
  profile: any | null
  loading: boolean
  refreshProfile: () => Promise<void>
  features: FeatureAccess
  userType: UserType
  canAccess: (feature: keyof FeatureAccess) => boolean
}

const DashboardContext = createContext<DashboardContextType>({
  user: null,
  profile: null,
  loading: false,
  refreshProfile: async () => {},
  features: {
    banking: false,
    wallet: false,
    accounting: false,
    tax_filing: false,
    api_access: false,
    developer_portal: false,
    employee_management: false,
  },
  userType: "regular",
  canAccess: () => false,
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

  const userType: UserType = profile?.user_type || "regular"
  const subscriptionTier = profile?.subscription_tier || "free"
  const features = getFeaturesByUserType(userType, subscriptionTier)

  const canAccess = (feature: keyof FeatureAccess) => {
    return features[feature]
  }

  const refreshProfile = async () => {
    console.log("[v0] Profile refresh requested - using initial server data")
    // Use server actions instead of direct Supabase calls on client
  }

  useEffect(() => {
    console.log("[v0] DashboardProvider mounted", {
      hasUser: !!user,
      userType,
      subscriptionTier,
    })
  }, [user, userType, subscriptionTier])

  return (
    <DashboardContext.Provider value={{ user, profile, loading, refreshProfile, features, userType, canAccess }}>
      {children}
    </DashboardContext.Provider>
  )
}
