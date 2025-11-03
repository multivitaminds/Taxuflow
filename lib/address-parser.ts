/**
 * Parses combined city/state/ZIP strings into separate components
 * Examples:
 * - "CAMDEN NJ 08103" -> { city: "CAMDEN", state: "NJ", zipCode: "08103" }
 * - "NEW YORK NY 10001" -> { city: "NEW YORK", state: "NY", zipCode: "10001" }
 * - "SAN FRANCISCO CA 94102" -> { city: "SAN FRANCISCO", state: "CA", zipCode: "94102" }
 */
export function parseAddress(addressString: string): {
  city: string
  state: string
  zipCode: string
} | null {
  if (!addressString) return null

  // Trim and normalize whitespace
  const normalized = addressString.trim().replace(/\s+/g, " ")

  // Pattern: City (one or more words) + State (2 letters) + ZIP (5 or 9 digits)
  // Examples: "CAMDEN NJ 08103", "NEW YORK NY 10001", "SAN FRANCISCO CA 94102"
  const pattern = /^(.+?)\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i

  const match = normalized.match(pattern)

  if (match) {
    return {
      city: match[1].trim(),
      state: match[2].toUpperCase(),
      zipCode: match[3],
    }
  }

  // If no match, return null (let the original value stay)
  return null
}

/**
 * Parses a full address line that may contain street, city, state, and ZIP
 * Example: "123 Main St, CAMDEN NJ 08103"
 */
export function parseFullAddress(addressLine: string): {
  street?: string
  city: string
  state: string
  zipCode: string
} | null {
  if (!addressLine) return null

  // Check if there's a comma separating street from city/state/ZIP
  const parts = addressLine.split(",").map((p) => p.trim())

  if (parts.length === 2) {
    // Format: "123 Main St, CAMDEN NJ 08103"
    const parsed = parseAddress(parts[1])
    if (parsed) {
      return {
        street: parts[0],
        ...parsed,
      }
    }
  }

  // Try parsing the whole thing as city/state/ZIP
  return parseAddress(addressLine)
}
