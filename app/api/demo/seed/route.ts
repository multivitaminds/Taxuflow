import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { seedDemoData } from "@/lib/demo/seed-data"

export async function POST() {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await seedDemoData(user.id)

  if (result.success) {
    return NextResponse.json({ success: true, message: result.message })
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
}
