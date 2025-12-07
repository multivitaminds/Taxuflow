import { createServerClient } from "@/lib/supabase/server"

export interface TenantContext {
  tenantId: string
  tenantName: string
  tenantSlug: string
  features: string[]
  limits: {
    maxUsers: number
    maxDocuments: number
    maxApiCalls: number
  }
}

/**
 * Get tenant context with feature flags and limits
 */
export async function getTenantContext(organizationId: string): Promise<TenantContext | null> {
  try {
    const supabase = await createServerClient()

    const { data: org, error } = await supabase.from("organizations").select("*").eq("id", organizationId).single()

    if (error || !org) {
      console.error("[v0] Error fetching tenant context:", error)
      return null
    }

    return {
      tenantId: org.id,
      tenantName: org.name,
      tenantSlug: org.slug,
      features: org.features || [],
      limits: {
        maxUsers: org.max_users || 10,
        maxDocuments: org.max_documents || 1000,
        maxApiCalls: 10000,
      },
    }
  } catch (error) {
    console.error("[v0] Error in getTenantContext:", error)
    return null
  }
}

/**
 * Enforce tenant data isolation
 */
export async function enforceTenantIsolation(userId: string, organizationId: string): Promise<boolean> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("organization_memberships")
      .select("id")
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .single()

    if (error || !data) {
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Error in enforceTenantIsolation:", error)
    return false
  }
}
