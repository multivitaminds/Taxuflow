/**
 * Utility functions for formatting input fields
 */

/**
 * Format phone number as (XXX) XXX-XXXX
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "")

  // Limit to 10 digits
  const limited = numbers.slice(0, 10)

  // Format based on length
  if (limited.length === 0) return ""
  if (limited.length <= 3) return `(${limited}`
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`
}

/**
 * Format SSN as XXX-XX-XXXX
 */
export function formatSSN(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "")

  // Limit to 9 digits
  const limited = numbers.slice(0, 9)

  // Format based on length
  if (limited.length === 0) return ""
  if (limited.length <= 3) return limited
  if (limited.length <= 5) return `${limited.slice(0, 3)}-${limited.slice(3)}`
  return `${limited.slice(0, 3)}-${limited.slice(3, 5)}-${limited.slice(5)}`
}

/**
 * Format EIN/Tax ID as XX-XXXXXXX
 */
export function formatEIN(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "")

  // Limit to 9 digits
  const limited = numbers.slice(0, 9)

  // Format based on length
  if (limited.length === 0) return ""
  if (limited.length <= 2) return limited
  return `${limited.slice(0, 2)}-${limited.slice(2)}`
}

/**
 * Format credit card as XXXX XXXX XXXX XXXX
 */
export function formatCreditCard(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "")

  // Limit to 16 digits
  const limited = numbers.slice(0, 16)

  // Format in groups of 4
  const groups = limited.match(/.{1,4}/g) || []
  return groups.join(" ")
}

/**
 * Format ZIP code as XXXXX or XXXXX-XXXX
 */
export function formatZipCode(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "")

  // Limit to 9 digits
  const limited = numbers.slice(0, 9)

  // Format based on length
  if (limited.length === 0) return ""
  if (limited.length <= 5) return limited
  return `${limited.slice(0, 5)}-${limited.slice(5)}`
}

/**
 * Remove all formatting characters and return just numbers
 */
export function unformatNumber(value: string): string {
  return value.replace(/\D/g, "")
}

/**
 * Format currency as $X,XXX.XX
 */
export function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? Number.parseFloat(value.replace(/[^0-9.-]/g, "")) : value
  if (isNaN(num)) return "$0.00"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num)
}
