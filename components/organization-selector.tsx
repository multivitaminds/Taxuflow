"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, Check, ChevronDown, Plus, User } from "lucide-react"
import { CreateOrganizationDialog } from "./create-organization-dialog"

interface Organization {
  id: string
  name: string
  role?: string
}

interface OrganizationSelectorProps {
  userId: string
}

export function OrganizationSelector({ userId }: OrganizationSelectorProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const [isPersonalMode, setIsPersonalMode] = useState(true)
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Load organizations on mount
  useEffect(() => {
    loadOrganizations()
  }, [userId])

  const loadOrganizations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/organizations")
      if (response.ok) {
        const data = await response.json()

        console.log("[v0] Organizations loaded:", data.organizations?.length || 0)

        setOrganizations(data.organizations || [])

        // Check if there's a saved preference
        const savedOrgId = localStorage.getItem("selectedOrganizationId")
        const savedMode = localStorage.getItem("organizationMode")

        if (savedMode === "personal") {
          setIsPersonalMode(true)
          setSelectedOrgId(null)
        } else if (savedOrgId && data.organizations.some((org: Organization) => org.id === savedOrgId)) {
          setIsPersonalMode(false)
          setSelectedOrgId(savedOrgId)
        }
      } else {
        console.error("[v0] Failed to load organizations:", response.status)
      }
    } catch (error) {
      console.error("[v0] Error loading organizations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPersonal = () => {
    console.log("[v0] Switching to Personal mode")
    setIsPersonalMode(true)
    setSelectedOrgId(null)
    localStorage.setItem("organizationMode", "personal")
    localStorage.removeItem("selectedOrganizationId")
    window.location.reload() // Reload to fetch personal data
  }

  const handleSelectOrganization = (orgId: string) => {
    const org = organizations.find((o) => o.id === orgId)
    console.log("[v0] Switching to Organization:", org?.name)
    setIsPersonalMode(false)
    setSelectedOrgId(orgId)
    localStorage.setItem("organizationMode", "organization")
    localStorage.setItem("selectedOrganizationId", orgId)
    window.location.reload() // Reload to fetch org data
  }

  const handleOrganizationCreated = async () => {
    console.log("[v0] Organization created, reloading list...")
    await loadOrganizations()
  }

  const selectedOrganization = organizations.find((org) => org.id === selectedOrgId)
  const displayName = isPersonalMode ? "Personal" : selectedOrganization?.name || "Select Organization"

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
        <Building2 className="w-4 h-4" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            {isPersonalMode ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            <span className="max-w-[150px] truncate">{displayName}</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Context</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Personal Mode */}
          <DropdownMenuItem onClick={handleSelectPersonal} className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Personal</span>
            </div>
            {isPersonalMode && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>

          {organizations.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Organizations</DropdownMenuLabel>
            </>
          )}

          {/* Organizations */}
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleSelectOrganization(org.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="truncate">{org.name}</span>
              </div>
              {!isPersonalMode && selectedOrgId === org.id && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Create Organization */}
          <DropdownMenuItem onClick={() => setShowCreateDialog(true)} className="cursor-pointer text-primary">
            <Plus className="w-4 h-4 mr-2" />
            <span>Create Organization</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateOrganizationDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleOrganizationCreated}
      />
    </>
  )
}
