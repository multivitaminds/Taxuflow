export interface ValidationResult {
  isValid: boolean
  errors: Array<{ field: string; message: string }>
  warnings: Array<{ field: string; message: string }>
}

export class DataValidator {
  static validateCustomer(customer: any): ValidationResult {
    const errors: Array<{ field: string; message: string }> = []
    const warnings: Array<{ field: string; message: string }> = []

    // Required field validation
    if (!customer.contact_name || customer.contact_name.trim() === "") {
      errors.push({ field: "contact_name", message: "Contact name is required" })
    }

    // Email validation
    if (customer.email) {
      if (!this.isValidEmail(customer.email)) {
        errors.push({ field: "email", message: "Invalid email format" })
      }
    } else {
      warnings.push({ field: "email", message: "Email is recommended for customer communication" })
    }

    // Phone validation
    if (customer.phone) {
      if (!this.isValidPhone(customer.phone)) {
        warnings.push({ field: "phone", message: "Phone number format may be invalid" })
      }
    }

    // State validation
    if (customer.state && !this.isValidState(customer.state)) {
      warnings.push({ field: "state", message: "State code may be invalid" })
    }

    // Zip code validation
    if (customer.zip_code && !this.isValidZipCode(customer.zip_code)) {
      warnings.push({ field: "zip_code", message: "Zip code format may be invalid" })
    }

    // Tax ID validation
    if (customer.tax_id) {
      if (!this.isValidTaxId(customer.tax_id)) {
        warnings.push({ field: "tax_id", message: "Tax ID format may be invalid" })
      }
    }

    // Address completeness check
    if (customer.address_line1 && !customer.city) {
      warnings.push({ field: "city", message: "City is recommended when address is provided" })
    }

    if (customer.address_line1 && !customer.state) {
      warnings.push({ field: "state", message: "State is recommended when address is provided" })
    }

    if (customer.address_line1 && !customer.zip_code) {
      warnings.push({ field: "zip_code", message: "Zip code is recommended when address is provided" })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  static validateBatch(customers: any[]): {
    valid: any[]
    invalid: Array<{ customer: any; errors: Array<{ field: string; message: string }> }>
    warnings: Array<{ customer: any; warnings: Array<{ field: string; message: string }> }>
  } {
    const valid: any[] = []
    const invalid: Array<{ customer: any; errors: Array<{ field: string; message: string }> }> = []
    const warnings: Array<{ customer: any; warnings: Array<{ field: string; message: string }> }> = []

    customers.forEach((customer) => {
      const result = this.validateCustomer(customer)

      if (result.isValid) {
        valid.push(customer)
        if (result.warnings.length > 0) {
          warnings.push({ customer, warnings: result.warnings })
        }
      } else {
        invalid.push({ customer, errors: result.errors })
      }
    })

    return { valid, invalid, warnings }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private static isValidPhone(phone: string): boolean {
    const digits = phone.replace(/\D/g, "")
    return digits.length >= 10 && digits.length <= 11
  }

  private static isValidState(state: string): boolean {
    const validStates = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
    ]
    return validStates.includes(state.toUpperCase())
  }

  private static isValidZipCode(zip: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/
    return zipRegex.test(zip)
  }

  private static isValidTaxId(taxId: string): boolean {
    // EIN format: XX-XXXXXXX (9 digits)
    // SSN format: XXX-XX-XXXX (9 digits)
    const digits = taxId.replace(/\D/g, "")
    return digits.length === 9
  }
}
