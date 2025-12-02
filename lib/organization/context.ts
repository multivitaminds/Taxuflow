import { createClientSafe } from "@/lib/supabase/server"

export interface OrganizationContext {
  userId: string
  organizationId: string | null
  organizationIds: string[]
  hasOrganizationAccess: boolean
}

/**
 * Get the user's organization context including all organizations they have access to
 */
export async function getOrganizationContext(): Promise<OrganizationContext | null> {
  try {
    const supabase = await createClientSafe()

    if (!supabase) {
      console.error("[v0] Failed to create Supabase client - missing environment variables")
      return null
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] No authenticated user found in organization context")
      return null
    }

    console.log("[v0] Organization context - User authenticated:", user.id)

    const { data: orgMemberships, error } = await supabase
      .from("org_members")
      .select("org_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching org memberships:", error)
      return {
        userId: user.id,
        organizationId: null,
        organizationIds: [],
        hasOrganizationAccess: false,
      }
    }

    const organizationIds = orgMemberships?.map((m) => m.org_id) || []

    console.log("[v0] Organization context created:", {
      userId: user.id,
      organizationCount: organizationIds.length,
      hasAccess: organizationIds.length > 0,
    })

    return {
      userId: user.id,
      organizationId: organizationIds[0] || null, // Default to first org
      organizationIds,
      hasOrganizationAccess: organizationIds.length > 0,
    }
  } catch (error) {
    console.error("[v0] Error getting organization context:", error)
    return null
  }
}

/**
 * Check if user has access to a specific organization
 */
export async function hasOrganizationAccess(userId: string, organizationId: string): Promise<boolean> {
  try {
    const supabase = await createClientSafe()

    if (!supabase) {
      console.error("[v0] Failed to create Supabase client for access check")
      return false
    }

    const { data, error } = await supabase
      .from("org_members")
      .select("org_id")
      .eq("user_id", userId)
      .eq("org_id", organizationId)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error checking org access:", error)
      return false
    }

    return !!data
  } catch (error) {
    console.error("[v0] Error in hasOrganizationAccess:", error)
    return false
  }
}
