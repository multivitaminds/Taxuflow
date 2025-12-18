import { NextResponse } from "next/server"
import { PlatformMonitor } from "@/lib/monitoring"
import { getConfiguredIntegrations } from "@/lib/env-validation"

export async function GET() {
  try {
    const health = await PlatformMonitor.getSystemHealth()
    const integrations = getConfiguredIntegrations()

    return NextResponse.json({
      status: health.status,
      timestamp: new Date().toISOString(),
      checks: health.checks,
      integrations,
      version: process.env.npm_package_version || "unknown",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
