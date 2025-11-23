import { createServerClient } from "@/lib/supabase/server"

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
    const supabase = await createServerClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    // Get all organizations the user is a member of from books.org_members
    const { data: orgMemberships, error } = await supabase
      .from("org_members")
      .select("org_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching org memberships:", error)
      // Return context with no org access
      return {
        userId: user.id,
        organizationId: null,
        organizationIds: [],
        hasOrganizationAccess: false,
      }
    }

    const organizationIds = orgMemberships?.map((m) => m.org_id) || []

    return {
      userId: user.id,
      organizationId: organizationIds[0] || null, // Default to first org
      organizationIds,
      hasOrganizationAccess: organizationIds.length > 0,
    }
  } catch (error) {
    console.error("Error getting organization context:", error)
    return null
  }
}

/**
 * Check if user has access to a specific organization
 */
export async function hasOrganizationAccess(
  userId: string,
  organizationId: string
): Promise<boolean> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("org_members")
      .select("org_id")
      .eq("user_id", userId)
      .eq("org_id", organizationId)
      .maybeSingle()

    if (error) {
      console.error("Error checking org access:", error)
      return false
    }

    return !!data
  } catch (error) {
    console.error("Error in hasOrganizationAccess:", error)
    return false
  }
}
