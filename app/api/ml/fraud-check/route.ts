import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { FraudDetector } from "@/lib/ml/fraud-detector"

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
    const detector = new FraudDetector(supabase, user.id)
    const analysis = await detector.analyzeTransaction(transaction)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("[API] Fraud detection error:", error)
    return NextResponse.json({ error: "Fraud check failed" }, { status: 500 })
  }
}
