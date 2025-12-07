"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Plus, Users, Shield, Mail, MoreVertical, Crown, UserPlus, Settings, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useDashboard } from "@/components/dashboard-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function OrganizationManagement() {
  const { user } = useDashboard()
  const supabase = createClient()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [orgName, setOrgName] = useState("")
  const [orgDescription, setOrgDescription] = useState("")

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      // Fetch organizations where user is a member
      const { data: memberships, error } = await supabase
        .from("org_members")
        .select(
          `
          org_id,
          role,
          organizations (
            id,
            name,
            description,
            created_at,
            org_members (count)
          )
        `,
        )
        .eq("user_id", user?.id)

      if (error) throw error

      const orgsWithDetails = memberships?.map((m: any) => ({
        id: m.organizations.id,
        name: m.organizations.name,
        description: m.organizations.description,
        role: m.role,
        memberCount: m.organizations.org_members?.[0]?.count || 0,
        createdAt: m.organizations.created_at,
      }))

      setOrganizations(orgsWithDetails || [])
    } catch (error) {
      console.error("[v0] Error fetching organizations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrganization = async () => {
    if (!orgName.trim()) return

    setCreating(true)

    try {
      // Create organization
      const { data: newOrg, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: orgName,
          description: orgDescription,
          created_by: user?.id,
        })
        .select()
        .single()

      if (orgError) throw orgError

      // Add user as owner
      const { error: memberError } = await supabase.from("org_members").insert({
        org_id: newOrg.id,
        user_id: user?.id,
        role: "owner",
      })

      if (memberError) throw memberError

      await fetchOrganizations()
      setShowCreateDialog(false)
      setOrgName("")
      setOrgDescription("")
    } catch (error) {
      console.error("[v0] Error creating organization:", error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Organizations</h1>
          <p className="text-slate-600 mt-1">Manage your organizations and team memberships</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {showCreateDialog && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
          <h3 className="text-xl font-bold mb-4">Create New Organization</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Corp"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="orgDescription">Description (Optional)</Label>
              <Input
                id="orgDescription"
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
                placeholder="Software company building the future"
                className="mt-2"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCreateOrganization}
                disabled={creating || !orgName.trim()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 mr-2" />
                    Create Organization
                  </>
                )}
              </Button>
              <Button onClick={() => setShowCreateDialog(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map((org) => (
          <Card key={org.id} className="p-6 hover:shadow-lg transition-shadow border-slate-200 bg-white relative group">
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Members
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 truncate">{org.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mt-1">{org.description || "No description"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="capitalize">
                {org.role === "owner" && <Crown className="w-3 h-3 mr-1 text-amber-500" />}
                {org.role}
              </Badge>
              <Badge variant="outline">
                <Users className="w-3 h-3 mr-1" />
                {org.memberCount} {org.memberCount === 1 ? "member" : "members"}
              </Badge>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Shield className="w-3 h-3 mr-2" />
                Roles
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Mail className="w-3 h-3 mr-2" />
                Invite
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {organizations.length === 0 && !showCreateDialog && (
        <Card className="p-12 text-center border-dashed border-2">
          <Building2 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Organizations Yet</h3>
          <p className="text-slate-600 mb-6">Create your first organization to collaborate with your team</p>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
        </Card>
      )}
    </div>
  )
}
