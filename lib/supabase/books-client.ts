import { createClient } from "./client"

let booksClient: any | null = null

export function getSupabaseBooksClient() {
  // Reuse the same singleton instance from client.ts
  if (!booksClient) {
    booksClient = createClient()
  }
  return booksClient
}
