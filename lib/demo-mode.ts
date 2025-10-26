import { cookies } from "next/headers"

export interface DemoModeCheck {
  isDemoMode: boolean
  canWrite: boolean
  sessionExpired: boolean
}

/**
 * Check if the current session is in demo mode
 * Demo mode is read-only and has limited access
 */
export async function checkDemoMode(): Promise<DemoModeCheck> {
  const cookieStore = await cookies()
  const demoModeCookie = cookieStore.get("demo_mode")

  const isDemoMode = demoModeCookie?.value === "true"

  // Demo mode users cannot write to the database
  const canWrite = !isDemoMode

  // Check if demo session has expired (24 hours)
  const sessionExpired = false // Cookie maxAge handles this

  return {
    isDemoMode,
    canWrite,
    sessionExpired,
  }
}

/**
 * Validate that the current user can perform write operations
 * Throws an error if in demo mode
 */
export async function validateWriteAccess(): Promise<void> {
  const { isDemoMode } = await checkDemoMode()

  if (isDemoMode) {
    throw new Error("Write operations are not allowed in demo mode. Please create a free account to save your data.")
  }
}

/**
 * Get demo user data for display purposes
 */
export function getDemoUserData() {
  return {
    id: "demo-user-id",
    email: "demo@example.com",
    full_name: "Demo User",
    subscription_tier: "Free",
    preferred_agent: "Sam",
  }
}

/**
 * Check if a user ID is a demo user
 */
export function isDemoUser(userId: string): boolean {
  return userId === "demo-user-id"
}
