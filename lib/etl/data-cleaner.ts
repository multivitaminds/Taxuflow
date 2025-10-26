export interface CleaningRule {
  field: string
  transform: (value: any) => any
}

export class DataCleaner {
  static cleanCustomerData(data: any[]): any[] {
    return data.map((record) => this.cleanRecord(record))
  }

  private static cleanRecord(record: any): any {
    return {
      contact_name: this.cleanName(record.contact_name),
      company_name: this.cleanName(record.company_name),
      email: this.cleanEmail(record.email),
      phone: this.cleanPhone(record.phone),
      address_line1: this.cleanAddress(record.address_line1),
      address_line2: this.cleanAddress(record.address_line2),
      city: this.cleanCity(record.city),
      state: this.cleanState(record.state),
      zip_code: this.cleanZipCode(record.zip_code),
      country: this.cleanCountry(record.country),
      tax_id: this.cleanTaxId(record.tax_id),
      notes: this.cleanNotes(record.notes),
    }
  }

  private static cleanName(value: any): string | undefined {
    if (!value) return undefined
    return String(value)
      .trim()
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[^\w\s\-'.]/g, "") // Remove special characters except dash, apostrophe, period
  }

  private static cleanEmail(value: any): string | undefined {
    if (!value) return undefined
    return String(value).trim().toLowerCase()
  }

  private static cleanPhone(value: any): string | undefined {
    if (!value) return undefined
    // Remove all non-digit characters
    const digits = String(value).replace(/\D/g, "")

    // Format as (XXX) XXX-XXXX for US numbers
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    } else if (digits.length === 11 && digits[0] === "1") {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
    }

    return digits
  }

  private static cleanAddress(value: any): string | undefined {
    if (!value) return undefined
    return String(value).trim().replace(/\s+/g, " ")
  }

  private static cleanCity(value: any): string | undefined {
    if (!value) return undefined
    return String(value)
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
  }

  private static cleanState(value: any): string | undefined {
    if (!value) return undefined
    const state = String(value).trim().toUpperCase()

    // Map full state names to abbreviations
    const stateMap: Record<string, string> = {
      ALABAMA: "AL",
      ALASKA: "AK",
      ARIZONA: "AZ",
      ARKANSAS: "AR",
      CALIFORNIA: "CA",
      COLORADO: "CO",
      CONNECTICUT: "CT",
      DELAWARE: "DE",
      FLORIDA: "FL",
      GEORGIA: "GA",
      HAWAII: "HI",
      IDAHO: "ID",
      ILLINOIS: "IL",
      INDIANA: "IN",
      IOWA: "IA",
      KANSAS: "KS",
      KENTUCKY: "KY",
      LOUISIANA: "LA",
      MAINE: "ME",
      MARYLAND: "MD",
      MASSACHUSETTS: "MA",
      MICHIGAN: "MI",
      MINNESOTA: "MN",
      MISSISSIPPI: "MS",
      MISSOURI: "MO",
      MONTANA: "MT",
      NEBRASKA: "NE",
      NEVADA: "NV",
      "NEW HAMPSHIRE": "NH",
      "NEW JERSEY": "NJ",
      "NEW MEXICO": "NM",
      "NEW YORK": "NY",
      "NORTH CAROLINA": "NC",
      "NORTH DAKOTA": "ND",
      OHIO: "OH",
      OKLAHOMA: "OK",
      OREGON: "OR",
      PENNSYLVANIA: "PA",
      "RHODE ISLAND": "RI",
      "SOUTH CAROLINA": "SC",
      "SOUTH DAKOTA": "SD",
      TENNESSEE: "TN",
      TEXAS: "TX",
      UTAH: "UT",
      VERMONT: "VT",
      VIRGINIA: "VA",
      WASHINGTON: "WA",
      "WEST VIRGINIA": "WV",
      WISCONSIN: "WI",
      WYOMING: "WY",
    }

    return stateMap[state] || state
  }

  private static cleanZipCode(value: any): string | undefined {
    if (!value) return undefined
    const zip = String(value).replace(/\D/g, "")

    // Format as XXXXX or XXXXX-XXXX
    if (zip.length === 5) {
      return zip
    } else if (zip.length === 9) {
      return `${zip.slice(0, 5)}-${zip.slice(5)}`
    }

    return zip
  }

  private static cleanCountry(value: any): string {
    if (!value) return "US"
    const country = String(value).trim().toUpperCase()

    // Map common country names to ISO codes
    const countryMap: Record<string, string> = {
      "UNITED STATES": "US",
      USA: "US",
      AMERICA: "US",
      CANADA: "CA",
      MEXICO: "MX",
      "UNITED KINGDOM": "GB",
      UK: "GB",
    }

    return countryMap[country] || country
  }

  private static cleanTaxId(value: any): string | undefined {
    if (!value) return undefined
    // Remove all non-alphanumeric characters
    return String(value).replace(/[^a-zA-Z0-9]/g, "")
  }

  private static cleanNotes(value: any): string | undefined {
    if (!value) return undefined
    return String(value).trim()
  }
}
