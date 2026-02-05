import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createFinancialConnectionSession } from "@/lib/stripe-financial-connections"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { permissions, returnUrl } = body

    const session = await createFinancialConnectionSession({
      userId: user.id,
      permissions: permissions || ["balances", "ownership", "payment_method"],
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/integrations/financial-connections/callback`,
    })

    return NextResponse.json(session)
  } catch (error: any) {
    console.error("[v0] Financial Connections session error:", error)
    return NextResponse.json({ error: error.message || "Failed to create session" }, { status: 500 })
  }
}
