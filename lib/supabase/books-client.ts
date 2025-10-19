import { createBrowserClient } from "@supabase/ssr"

export function getSupabaseBooksClient() {
  if (typeof window === "undefined") {
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables")
    return null
  }

  const client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: "books" },
    global: {
      headers: {
        "Accept-Profile": "books",
        "Content-Profile": "books",
      },
    },
  })

  return client
}
