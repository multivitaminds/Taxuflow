import { createClient } from "./client"

export function getSupabaseBooksClient() {
  // Always use the same singleton instance from client.ts
  return createClient()
}
