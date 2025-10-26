import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to create Supabase client",
        },
        { status: 500 },
      )
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 })
    }

    const tables = [
      "user_profiles",
      "documents",
      "tax_filings",
      "invoices",
      "expenses",
      "contacts",
      "api_keys",
      "email_preferences",
      "email_logs",
    ]

    const tableStatus: Record<string, boolean> = {}

    for (const table of tables) {
      const { error } = await supabase.from(table).select("id").limit(1)
      tableStatus[table] = !error
      if (error) {
        console.log(`[v0] Table ${table} check:`, error.message)
      }
    }

    const allTablesExist = Object.values(tableStatus).every((exists) => exists)

    return NextResponse.json({
      status: allTablesExist ? "success" : "warning",
      message: allTablesExist ? "All tables accessible" : "Some tables missing",
      tables: tableStatus,
      missingTables: Object.entries(tableStatus)
        .filter(([_, exists]) => !exists)
        .map(([table]) => table),
    })
  } catch (error: any) {
    console.error("[v0] Database diagnostics error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database check failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
