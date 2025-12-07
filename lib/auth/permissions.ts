import { createClient } from "@/lib/supabase/server"

export type Permission = "read" | "write" | "delete" | "admin"

export type Resource =
  | "invoices"
  | "expenses"
  | "customers"
  | "vendors"
  | "accounts"
  | "reports"
  | "tax_filings"
  | "neobank_accounts"
  | "settings"

export interface UserPermissions {
  userId: string
  role: string
  permissions: Record<Resource, Permission[]>
}

export async function getUserPermissions(userId: string): Promise<UserPermissions | null> {
  const supabase = await createClient()

  const { data: role, error } = await supabase
    .from("user_roles")
    .select("role_name, permissions")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single()

  if (error || !role) {
    return null
  }

  return {
    userId,
    role: role.role_name,
    permissions: role.permissions as Record<Resource, Permission[]>,
  }
}

export async function hasPermission(userId: string, resource: Resource, permission: Permission): Promise<boolean> {
  const userPerms = await getUserPermissions(userId)

  if (!userPerms) return false

  // Admin has all permissions
  if (userPerms.role === "admin" || userPerms.role === "owner") return true

  const resourcePerms = userPerms.permissions[resource]
  if (!resourcePerms) return false

  return resourcePerms.includes(permission)
}

export async function requirePermission(userId: string, resource: Resource, permission: Permission): Promise<void> {
  const allowed = await hasPermission(userId, resource, permission)

  if (!allowed) {
    throw new Error(`Insufficient permissions: ${permission} on ${resource}`)
  }
}
