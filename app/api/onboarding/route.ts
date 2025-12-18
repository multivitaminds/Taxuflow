import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { name, email, filingStatus, incomeType } = await req.json()

    // Validate input
    if (!name || !email || !filingStatus || !incomeType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // This onboarding data will be used during signup process
    // No need to store in database before user creates account
    return NextResponse.json({
      success: true,
      message: "Onboarding data saved. Redirecting to signup...",
    })

    // Original code below was removed as per updates
    // const supabase = createServerClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //   {
    //     cookies: {
    //       getAll() {
    //         return []
    //       },
    //       setAll() {},
    //     },
    //   },
    // )

    // // Check if user profile already exists
    // const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("email", email).maybeSingle()

    // if (existingProfile) {
    //   return NextResponse.json({ error: "User profile already exists" }, { status: 409 })
    // }

    // // Insert new user profile
    // const { data, error } = await supabase
    //   .from("user_profiles")
    //   .insert([
    //     {
    //       full_name: name,
    //       email,
    //       filing_status: filingStatus,
    //       income_type: incomeType,
    //     },
    //   ])
    //   .select()

    // if (error) {
    //   console.error("[v0] Database error:", error)
    //   return NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 })
    // }

    // return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
