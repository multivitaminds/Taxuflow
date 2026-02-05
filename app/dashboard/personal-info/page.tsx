"use client"

import { useDashboard } from "@/components/dashboard-provider"
import { PersonalInfoClient } from "@/components/personal-info-client"

export default function PersonalInfoPage() {
  const { user, profile } = useDashboard()

  return <PersonalInfoClient user={user} profile={profile} />
}
