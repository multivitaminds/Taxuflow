export interface DuplicateMatch {
  original: any
  duplicate: any
  matchScore: number
  matchFields: string[]
}

export class DataDeduplicator {
  static findDuplicates(
    customers: any[],
    existingCustomers: any[] = [],
  ): {
    unique: any[]
    duplicates: DuplicateMatch[]
  } {
    const allCustomers = [...existingCustomers, ...customers]
    const unique: any[] = []
    const duplicates: DuplicateMatch[] = []
    const processed = new Set<number>()

    customers.forEach((customer, index) => {
      if (processed.has(index)) return

      let isDuplicate = false

      // Check against existing customers
      for (const existing of existingCustomers) {
        const match = this.calculateMatch(customer, existing)
        if (match.matchScore >= 0.8) {
          duplicates.push({
            original: existing,
            duplicate: customer,
            matchScore: match.matchScore,
            matchFields: match.matchFields,
          })
          isDuplicate = true
          break
        }
      }

      // Check against other new customers
      if (!isDuplicate) {
        for (let i = index + 1; i < customers.length; i++) {
          if (processed.has(i)) continue

          const match = this.calculateMatch(customer, customers[i])
          if (match.matchScore >= 0.8) {
            duplicates.push({
              original: customer,
              duplicate: customers[i],
              matchScore: match.matchScore,
              matchFields: match.matchFields,
            })
            processed.add(i)
            isDuplicate = true
            break
          }
        }
      }

      if (!isDuplicate) {
        unique.push(customer)
      }
    })

    return { unique, duplicates }
  }

  private static calculateMatch(
    customer1: any,
    customer2: any,
  ): {
    matchScore: number
    matchFields: string[]
  } {
    const matchFields: string[] = []
    let totalScore = 0
    let maxScore = 0

    // Email match (highest weight)
    if (customer1.email && customer2.email) {
      maxScore += 0.4
      if (this.normalizeString(customer1.email) === this.normalizeString(customer2.email)) {
        totalScore += 0.4
        matchFields.push("email")
      }
    }

    // Phone match
    if (customer1.phone && customer2.phone) {
      maxScore += 0.3
      const phone1 = customer1.phone.replace(/\D/g, "")
      const phone2 = customer2.phone.replace(/\D/g, "")
      if (phone1 === phone2) {
        totalScore += 0.3
        matchFields.push("phone")
      }
    }

    // Name match
    if (customer1.contact_name && customer2.contact_name) {
      maxScore += 0.2
      const similarity = this.calculateStringSimilarity(
        this.normalizeString(customer1.contact_name),
        this.normalizeString(customer2.contact_name),
      )
      if (similarity > 0.8) {
        totalScore += 0.2 * similarity
        matchFields.push("contact_name")
      }
    }

    // Company name match
    if (customer1.company_name && customer2.company_name) {
      maxScore += 0.1
      const similarity = this.calculateStringSimilarity(
        this.normalizeString(customer1.company_name),
        this.normalizeString(customer2.company_name),
      )
      if (similarity > 0.8) {
        totalScore += 0.1 * similarity
        matchFields.push("company_name")
      }
    }

    const matchScore = maxScore > 0 ? totalScore / maxScore : 0

    return { matchScore, matchFields }
  }

  private static normalizeString(str: string): string {
    return str.toLowerCase().trim().replace(/\s+/g, " ")
  }

  private static calculateStringSimilarity(str1: string, str2: string): number {
    // Levenshtein distance algorithm
    const len1 = str1.length
    const len2 = str2.length
    const matrix: number[][] = []

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)
      }
    }

    const distance = matrix[len1][len2]
    const maxLen = Math.max(len1, len2)
    return maxLen === 0 ? 1 : 1 - distance / maxLen
  }
}
