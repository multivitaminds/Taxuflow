import { describe, it, expect } from "@jest/globals"

// Currency formatter utility
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

describe("Currency Formatter", () => {
  it("formats USD correctly", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56")
    expect(formatCurrency(0)).toBe("$0.00")
    expect(formatCurrency(999999.99)).toBe("$999,999.99")
  })

  it("formats EUR correctly", () => {
    expect(formatCurrency(1234.56, "EUR")).toContain("1,234.56")
  })

  it("formats GBP correctly", () => {
    expect(formatCurrency(1234.56, "GBP")).toContain("1,234.56")
  })

  it("handles negative amounts", () => {
    const result = formatCurrency(-500)
    expect(result).toContain("500")
  })

  it("handles very large numbers", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00")
  })
})
