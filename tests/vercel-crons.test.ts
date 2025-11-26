import vercelConfig from "../vercel.json"
import { describe, expect, it } from "vitest"

describe("Vercel cron configuration", () => {
  it("schedules the check-filing-status cron every 30 minutes", () => {
    const cron = vercelConfig.crons.find((c) => c.path === "/api/cron/check-filing-status")

    expect(cron).toBeDefined()
    expect(cron?.schedule).toBe("*/30 * * * *")
  })
})
