// Utility to validate all pages are accessible and functional

export const CRITICAL_PAGES = [
  // Neobank
  "/neobank",
  "/neobank/accounts",
  "/neobank/transactions",
  "/neobank/cards",
  "/neobank/transfers",
  "/neobank/bill-pay",
  "/neobank/tax-buckets",

  // Accounting
  "/accounting",
  "/accounting/customers",
  "/accounting/vendors",
  "/accounting/invoices",
  "/accounting/expenses",
  "/accounting/employees",
  "/accounting/reports",

  // Investments
  "/investments",
  "/investments/portfolios",
  "/investments/holdings",
  "/investments/performance",

  // Tax
  "/1099-filing",
  "/tax-filings",
  "/w2-filings",

  // Settings
  "/settings",
  "/settings/profile",
  "/settings/security",
]

export const PUBLIC_PAGES = ["/", "/about", "/pricing", "/contact", "/blog", "/security", "/compliance"]

export function isPublicPage(path: string): boolean {
  return PUBLIC_PAGES.some((page) => path === page || path.startsWith(page + "/"))
}

export function requiresAuth(path: string): boolean {
  return !isPublicPage(path) && !path.startsWith("/auth/") && !path.startsWith("/api/")
}
