import { test, expect } from "@playwright/test"

test.describe("Accounting - Invoice Creation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/accounting/invoices")
  })

  test("creates a new invoice", async ({ page }) => {
    // Click new invoice button
    await page.click("text=New Invoice")

    // Fill invoice details
    await page.fill('[data-testid="customer-select"]', "Acme Corp")
    await page.fill('[data-testid="invoice-amount"]', "2500.00")
    await page.fill('[data-testid="due-date"]', "2024-12-31")
    await page.fill('[data-testid="description"]', "Consulting Services")

    // Submit invoice
    await page.click("text=Create Invoice")

    // Verify success message
    await expect(page.locator("text=Invoice created successfully")).toBeVisible()

    // Verify invoice appears in list
    await expect(page.locator("text=Acme Corp")).toBeVisible()
    await expect(page.locator("text=$2,500.00")).toBeVisible()
  })

  test("validates required fields", async ({ page }) => {
    await page.click("text=New Invoice")
    await page.click("text=Create Invoice")

    // Verify validation errors
    await expect(page.locator("text=Customer is required")).toBeVisible()
    await expect(page.locator("text=Amount is required")).toBeVisible()
  })
})
