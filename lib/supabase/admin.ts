import "server-only"
import { createClient } from "@supabase/supabase-js"

export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  console.log("[v0] createAdminClient: URL present:", !!supabaseUrl)
  console.log("[v0] createAdminClient: Service key present:", !!supabaseServiceRoleKey)

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("[v0] createAdminClient: Missing credentials")
    throw new Error("Missing Supabase admin credentials (URL or Service Role Key)")
  }

  console.log("[v0] createAdminClient: Creating client...")

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
