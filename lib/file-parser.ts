import Papa from "papaparse"

export interface ParsedCustomer {
  contact_name: string
  company_name?: string
  email?: string
  phone?: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  tax_id?: string
  notes?: string
}

export interface ParseResult {
  data: ParsedCustomer[]
  errors: Array<{ row: number; field: string; message: string }>
  warnings: Array<{ row: number; field: string; message: string }>
  totalRows: number
  validRows: number
}

export class FileParser {
  static async parseCSV(file: File): Promise<ParseResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = this.processCSVData(results.data)
          resolve(parsed)
        },
        error: (error) => {
          resolve({
            data: [],
            errors: [{ row: 0, field: "file", message: error.message }],
            warnings: [],
            totalRows: 0,
            validRows: 0,
          })
        },
      })
    })
  }

  static async parseExcel(file: File): Promise<ParseResult> {
    // For Excel files, we'll use the same CSV parser after conversion
    // In production, you'd use a library like xlsx
    return this.parseCSV(file)
  }

  static async parsePDF(file: File): Promise<ParseResult> {
    // PDF parsing would require OCR or structured PDF parsing
    // For now, return an error message
    return {
      data: [],
      errors: [{ row: 0, field: "file", message: "PDF parsing requires OCR integration" }],
      warnings: [],
      totalRows: 0,
      validRows: 0,
    }
  }

  private static processCSVData(rawData: any[]): ParseResult {
    const data: ParsedCustomer[] = []
    const errors: Array<{ row: number; field: string; message: string }> = []
    const warnings: Array<{ row: number; field: string; message: string }> = []

    rawData.forEach((row, index) => {
      const rowNumber = index + 2 // +2 because index starts at 0 and we skip header

      // Map common column names to our schema
      const customer = this.mapRowToCustomer(row)

      // Validate required fields
      if (!customer.contact_name || customer.contact_name.trim() === "") {
        errors.push({
          row: rowNumber,
          field: "contact_name",
          message: "Contact name is required",
        })
        return
      }

      // Validate email format if provided
      if (customer.email && !this.isValidEmail(customer.email)) {
        warnings.push({
          row: rowNumber,
          field: "email",
          message: "Invalid email format",
        })
      }

      // Validate phone format if provided
      if (customer.phone && !this.isValidPhone(customer.phone)) {
        warnings.push({
          row: rowNumber,
          field: "phone",
          message: "Invalid phone format",
        })
      }

      data.push(customer)
    })

    return {
      data,
      errors,
      warnings,
      totalRows: rawData.length,
      validRows: data.length,
    }
  }

  private static mapRowToCustomer(row: any): ParsedCustomer {
    // Map various column name formats to our schema
    const getField = (possibleNames: string[]) => {
      for (const name of possibleNames) {
        const value = row[name] || row[name.toLowerCase()] || row[name.toUpperCase()]
        if (value) return String(value).trim()
      }
      return undefined
    }

    return {
      contact_name: getField(["contact_name", "name", "customer_name", "full_name", "Contact Name", "Name"]) || "",
      company_name: getField(["company_name", "company", "business_name", "Company Name", "Company"]),
      email: getField(["email", "email_address", "Email", "Email Address"]),
      phone: getField(["phone", "phone_number", "telephone", "Phone", "Phone Number"]),
      address_line1: getField(["address_line1", "address", "street", "Address", "Street"]),
      address_line2: getField(["address_line2", "address2", "suite", "Address 2"]),
      city: getField(["city", "City"]),
      state: getField(["state", "State", "province", "Province"]),
      zip_code: getField(["zip_code", "zip", "postal_code", "Zip Code", "ZIP"]),
      country: getField(["country", "Country"]) || "US",
      tax_id: getField(["tax_id", "ein", "ssn", "Tax ID", "EIN"]),
      notes: getField(["notes", "comments", "Notes", "Comments"]),
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private static isValidPhone(phone: string): boolean {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "")
    // Valid if 10 or 11 digits (with or without country code)
    return digits.length >= 10 && digits.length <= 11
  }
}
