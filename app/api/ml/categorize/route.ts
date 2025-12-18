import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { MLExpenseCategorizer } from "@/lib/ml/expense-categorizer"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transaction = await request.json()
    const categorizer = new MLExpenseCategorizer(supabase, user.id)
    const result = await categorizer.categorizeExpense(transaction)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[API] ML Categorization error:", error)
    return NextResponse.json({ error: "Categorization failed" }, { status: 500 })
  }
}
