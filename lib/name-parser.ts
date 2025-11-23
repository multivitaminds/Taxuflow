/**
 * Parses a full name string and extracts first name, middle initial, and last name
 * Handles cases like:
 * - "RUTH A LIGHTSON" -> { firstName: "RUTH", middleInitial: "A", lastName: "LIGHTSON" }
 * - "JOHN SMITH" -> { firstName: "JOHN", middleInitial: "", lastName: "SMITH" }
 * - "MARY JANE DOE" -> { firstName: "MARY", middleInitial: "J", lastName: "DOE" }
 */
export function parseName(fullName: string): {
  firstName: string
  middleInitial: string
  lastName: string
} | null {
  if (!fullName || typeof fullName !== "string") {
    return null
  }

  const trimmed = fullName.trim()
  if (!trimmed) {
    return null
  }

  const parts = trimmed.split(/\s+/)

  if (parts.length === 1) {
    // Only one name part
    return {
      firstName: parts[0],
      middleInitial: "",
      lastName: "",
    }
  }

  if (parts.length === 2) {
    // First and last name only
    return {
      firstName: parts[0],
      middleInitial: "",
      lastName: parts[1],
    }
  }

  // 3 or more parts
  const firstName = parts[0]
  const lastName = parts[parts.length - 1]

  // Check if second part is a single letter (middle initial)
  const secondPart = parts[1]
  if (secondPart.length === 1 || (secondPart.length === 2 && secondPart.endsWith("."))) {
    // It's a middle initial
    return {
      firstName,
      middleInitial: secondPart.replace(".", "").toUpperCase(),
      lastName,
    }
  }

  // If second part is a full word, treat it as part of first name or extract first letter as middle initial
  // For now, we'll take the first letter of the second part as middle initial
  return {
    firstName,
    middleInitial: secondPart.charAt(0).toUpperCase(),
    lastName,
  }
}

/**
 * Parses last name that may contain middle initial
 * Example: "A LIGHTSON" -> { middleInitial: "A", lastName: "LIGHTSON" }
 */
export function parseLastNameWithMiddleInitial(lastNameField: string): {
  middleInitial: string
  lastName: string
} | null {
  if (!lastNameField || typeof lastNameField !== "string") {
    return null
  }

  const trimmed = lastNameField.trim()
  if (!trimmed) {
    return null
  }

  const parts = trimmed.split(/\s+/)

  if (parts.length === 1) {
    // Just last name, no middle initial
    return {
      middleInitial: "",
      lastName: parts[0],
    }
  }

  // Check if first part is a single letter (middle initial)
  const firstPart = parts[0]
  if (firstPart.length === 1 || (firstPart.length === 2 && firstPart.endsWith("."))) {
    // It's a middle initial followed by last name
    return {
      middleInitial: firstPart.replace(".", "").toUpperCase(),
      lastName: parts.slice(1).join(" "),
    }
  }

  // Otherwise, treat entire string as last name
  return {
    middleInitial: "",
    lastName: trimmed,
  }
}
