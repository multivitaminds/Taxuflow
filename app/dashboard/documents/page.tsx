"use client"

import { useDashboard } from "@/components/dashboard-provider"
import { DocumentsDetailsClient } from "@/components/documents-details-client"

export default function DocumentsDetailsPage() {
  const { user, profile } = useDashboard()

  return <DocumentsDetailsClient user={user} profile={profile} />
}
