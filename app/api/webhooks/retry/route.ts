import { NextResponse } from "next/server"
import { retryFailedWebhooks } from "@/lib/webhooks/deliver"

export async function POST(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await retryFailedWebhooks()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Webhook retry cron error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
