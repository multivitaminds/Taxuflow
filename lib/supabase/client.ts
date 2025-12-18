import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let browserClient: SupabaseClient | null = null

export function createClient() {
  // Return cached instance if it exists
  if (browserClient) {
    return browserClient
  }

  // Create new instance with proper cookie handling
  browserClient = createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // This is a browser-only environment, so we can use document.cookie
          if (typeof document === "undefined") return undefined
          const value = `; ${document.cookie}`
          const parts = value.split(`; ${name}=`)
          if (parts.length === 2) return parts.pop()?.split(";").shift()
        },
        set(name: string, value: string, options: any) {
          if (typeof document === "undefined") return
          let cookie = `${name}=${value}`
          if (options?.maxAge) cookie += `; max-age=${options.maxAge}`
          if (options?.path) cookie += `; path=${options.path}`
          if (options?.domain) cookie += `; domain=${options.domain}`
          if (options?.secure) cookie += "; secure"
          if (options?.httpOnly) cookie += "; httponly"
          if (options?.sameSite) cookie += `; samesite=${options.sameSite}`
          document.cookie = cookie
        },
        remove(name: string, options: any) {
          if (typeof document === "undefined") return
          document.cookie = `${name}=; path=${options?.path || "/"}; expires=Thu, 01 Jan 1970 00:00:01 GMT`
        },
      },
    },
  )

  return browserClient
}

export function createBrowserClient() {
  return createClient()
}

export const getSupabaseBrowserClient = createClient
export const isSupabaseConfigured = () => true

// Additional updates can be added here if necessary
