"use client"

import { useDashboard } from "../layout"
import { PersonalInfoClient } from "@/components/personal-info-client"

export default function PersonalInfoPage() {
  const { user, profile } = useDashboard()

  return <PersonalInfoClient user={user} profile={profile} />
}
