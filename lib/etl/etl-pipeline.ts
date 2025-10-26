import { DataCleaner } from "./data-cleaner"
import { DataValidator } from "./data-validator"
import { DataDeduplicator } from "./data-deduplicator"

export interface ETLResult {
  cleaned: any[]
  valid: any[]
  invalid: Array<{ customer: any; errors: Array<{ field: string; message: string }> }>
  warnings: Array<{ customer: any; warnings: Array<{ field: string; message: string }> }>
  duplicates: Array<{
    original: any
    duplicate: any
    matchScore: number
    matchFields: string[]
  }>
  unique: any[]
  stats: {
    totalInput: number
    cleaned: number
    valid: number
    invalid: number
    duplicates: number
    readyForImport: number
  }
}

export class ETLPipeline {
  static async process(rawData: any[], existingCustomers: any[] = []): Promise<ETLResult> {
    // Step 1: Clean the data
    const cleaned = DataCleaner.cleanCustomerData(rawData)

    // Step 2: Validate the data
    const { valid, invalid, warnings } = DataValidator.validateBatch(cleaned)

    // Step 3: Deduplicate the data
    const { unique, duplicates } = DataDeduplicator.findDuplicates(valid, existingCustomers)

    // Calculate stats
    const stats = {
      totalInput: rawData.length,
      cleaned: cleaned.length,
      valid: valid.length,
      invalid: invalid.length,
      duplicates: duplicates.length,
      readyForImport: unique.length,
    }

    return {
      cleaned,
      valid,
      invalid,
      warnings,
      duplicates,
      unique,
      stats,
    }
  }
}
