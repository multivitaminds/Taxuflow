export const config = {
  schedule: "*/5 * * * *", // Run every 5 minutes
}

export default async function pollFilingStatus() {
  try {
    console.log("[v0] Cron: Starting automatic filing status poll...")

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/filing/poll-pending-status`, {
      method: "GET",
    })

    if (!response.ok) {
      console.error("[v0] Cron: Failed to poll filing status:", response.status)
      return
    }

    const data = await response.json()
    console.log("[v0] Cron: Polling complete:", data)
  } catch (error) {
    console.error("[v0] Cron: Error polling filing status:", error)
  }
}
