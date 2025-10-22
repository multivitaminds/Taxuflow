import { type NextRequest, NextResponse } from "next/server"
import { authenticateAPIRequest, logAPIRequest } from "@/lib/api/auth"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  // Authenticate the request
  const auth = await authenticateAPIRequest(request)

  if (!auth.authenticated) {
    await logAPIRequest({
      method: "GET",
      endpoint: "/api/v1/tax-returns",
      statusCode: 401,
      durationMs: Date.now() - startTime,
    })

    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get("year")
  const status = searchParams.get("status")
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  // Build query
  let query = supabase
    .from("tax_interviews")
    .select("*")
    .eq("user_id", auth.keyData!.user_id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (year) {
    query = query.eq("tax_year", year)
  }

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  const duration = Date.now() - startTime

  // Log the request
  await logAPIRequest({
    apiKeyId: auth.keyData!.id,
    userId: auth.keyData!.user_id,
    method: "GET",
    endpoint: "/api/v1/tax-returns",
    statusCode: error ? 500 : 200,
    responseBody: error ? { error: error.message } : { count: data?.length },
    ipAddress: request.headers.get("x-forwarded-for") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    durationMs: duration,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    meta: {
      count: data.length,
      limit,
    },
  })
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  // Authenticate the request
  const auth = await authenticateAPIRequest(request)

  if (!auth.authenticated) {
    await logAPIRequest({
      method: "POST",
      endpoint: "/api/v1/tax-returns",
      statusCode: 401,
      durationMs: Date.now() - startTime,
    })

    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
  }

  // Check write permission
  if (!auth.keyData!.permissions.includes("write")) {
    return NextResponse.json({ error: "API key does not have write permission" }, { status: 403 })
  }

  const body = await request.json()

  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  // Create tax return
  const { data, error } = await supabase
    .from("tax_interviews")
    .insert({
      user_id: auth.keyData!.user_id,
      tax_year: body.tax_year,
      tax_type: body.tax_type,
      filing_status: body.filing_status,
      personal_info: body.personal_info,
      income: body.income,
      deductions: body.deductions,
      credits: body.credits,
      status: "draft",
    })
    .select()
    .single()

  const duration = Date.now() - startTime

  // Log the request
  await logAPIRequest({
    apiKeyId: auth.keyData!.id,
    userId: auth.keyData!.user_id,
    method: "POST",
    endpoint: "/api/v1/tax-returns",
    statusCode: error ? 500 : 201,
    requestBody: body,
    responseBody: error ? { error: error.message } : { id: data?.id },
    ipAddress: request.headers.get("x-forwarded-for") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    durationMs: duration,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
