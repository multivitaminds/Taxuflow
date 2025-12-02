import { createBrowserClient as createBrowserClientOriginal } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

export function createClient() {
  // Don't create browser client on server
  if (typeof window === "undefined") {
    console.log("[v0] Supabase client: Cannot create browser client on server")
    return null as any
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase config missing on client")
    return null as any
  }

  if (supabaseInstance) {
    return supabaseInstance
  }

  supabaseInstance = createBrowserClientOriginal(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        // Use document.cookie for client-side cookie access
        if (typeof document === "undefined") return undefined
        const matches = document.cookie.match(
          new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"),
        )
        return matches ? decodeURIComponent(matches[1]) : undefined
      },
      set(name: string, value: string, options: any) {
        if (typeof document === "undefined") return
        let cookieString = `${name}=${encodeURIComponent(value)}`
        if (options?.maxAge) cookieString += `; max-age=${options.maxAge}`
        if (options?.path) cookieString += `; path=${options.path}`
        if (options?.domain) cookieString += `; domain=${options.domain}`
        if (options?.sameSite) cookieString += `; samesite=${options.sameSite}`
        if (options?.secure) cookieString += "; secure"
        document.cookie = cookieString
      },
      remove(name: string, options: any) {
        if (typeof document === "undefined") return
        this.set(name, "", { ...options, maxAge: 0 })
      },
    },
  })

  return supabaseInstance
}

export function getSupabaseBrowserClient() {
  return createClient()
}

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export const createBrowserClient = createClient
