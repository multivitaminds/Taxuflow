import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { PredictiveCashFlowModel } from "@/lib/ml/predictive-cashflow"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const months = Number.parseInt(searchParams.get("months") || "6")

    const model = new PredictiveCashFlowModel(supabase, user.id)
    const forecast = await model.generateForecast(months)

    return NextResponse.json(forecast)
  } catch (error) {
    console.error("[API] Cash flow forecast error:", error)
    return NextResponse.json({ error: "Forecast generation failed" }, { status: 500 })
  }
}
