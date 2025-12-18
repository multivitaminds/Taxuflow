"use client"

import { Badge } from "@/components/ui/badge"
import { Building2, User } from 'lucide-react'

interface OrganizationContextBadgeProps {
  isPersonal: boolean
  organizationName?: string
}

export function OrganizationContextBadge({ isPersonal, organizationName }: OrganizationContextBadgeProps) {
  if (isPersonal) {
    return (
      <Badge variant="outline" className="gap-1.5 border-blue-500/30 bg-blue-500/10 text-blue-500">
        <User className="w-3 h-3" />
        Personal
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="gap-1.5 border-purple-500/30 bg-purple-500/10 text-purple-500">
      <Building2 className="w-3 h-3" />
      {organizationName || "Organization"}
    </Badge>
  )
}
