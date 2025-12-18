"use client"

import { DemoModeBanner } from "@/components/demo-mode-banner"
import { RoleBasedDashboard } from "@/components/role-based-dashboard"

export default function DashboardPage() {
  return (
    <>
      <DemoModeBanner isDemoMode={true} />
      <RoleBasedDashboard />
    </>
  )
}
