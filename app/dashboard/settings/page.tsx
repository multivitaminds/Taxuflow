"use client"

import { useDashboard } from "@/components/dashboard-provider"
import { SettingsClient } from "@/components/settings-client"

export default function SettingsPage() {
  const { user, profile } = useDashboard()

  return <SettingsClient user={user} profile={profile} />
}
