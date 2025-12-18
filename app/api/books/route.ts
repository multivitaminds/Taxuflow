import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return API information and available endpoints
    return NextResponse.json({
      name: "Taxu Books API",
      version: "1.0.0",
      description: "Accounting integrations and bookkeeping APIs for Taxu platform",
      endpoints: {
        quickbooks: {
          connect: "/api/books/qbo/connect",
          callback: "/api/books/qbo/callback",
          sync: "/api/books/qbo/sync",
          status: "/api/books/qbo/status",
          description: "QuickBooks Online integration endpoints",
        },
        xero: {
          connect: "/api/books/xero/connect",
          callback: "/api/books/xero/callback",
          sync: "/api/books/xero/sync",
          status: "/api/books/xero/status",
          description: "Xero accounting integration endpoints",
        },
      },
      capabilities: [
        "Two-way sync with QuickBooks Online",
        "Two-way sync with Xero",
        "Automated invoice import",
        "Customer data synchronization",
        "Chart of accounts mapping",
        "Real-time transaction updates",
      ],
      authentication: {
        type: "OAuth 2.0",
        providers: ["QuickBooks Online", "Xero"],
        note: "User must be authenticated with Taxu and connected to accounting software",
      },
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("[v0] Books API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to retrieve Books API information",
      },
      { status: 500 },
    )
  }
}
