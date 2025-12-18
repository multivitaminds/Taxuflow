import { test, expect } from "@playwright/test"

test.describe("Neobank Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/neobank")
  })

  test("displays dashboard with key metrics", async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Neobank/)

    // Verify key sections are visible
    await expect(page.locator("text=Total Balance")).toBeVisible()
    await expect(page.locator("text=Monthly Income")).toBeVisible()
    await expect(page.locator("text=Monthly Expenses")).toBeVisible()

    // Verify navigation sidebar
    await expect(page.locator("text=Dashboard")).toBeVisible()
    await expect(page.locator("text=Accounts")).toBeVisible()
    await expect(page.locator("text=Transactions")).toBeVisible()
  })

  test("navigates to accounts page", async ({ page }) => {
    await page.click("text=Accounts")
    await expect(page).toHaveURL(/\/neobank\/accounts/)
    await expect(page.locator("text=Account Management")).toBeVisible()
  })

  test("displays recent transactions", async ({ page }) => {
    const transactionsSection = page.locator('[data-testid="recent-transactions"]')
    await expect(transactionsSection).toBeVisible()
  })

  test("responsive design on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify mobile menu
    const menuButton = page.locator('[data-testid="mobile-menu"]')
    await expect(menuButton).toBeVisible()

    await menuButton.click()
    await expect(page.locator("text=Dashboard")).toBeVisible()
  })
})
