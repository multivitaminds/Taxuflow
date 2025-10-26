import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { encrypt, decrypt } from "@/lib/crypto"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"

    let query = supabase.from("recipients").select("*").eq("user_id", user.id).order("created_at", { ascending: false })

    if (!includeInactive) {
      query = query.eq("is_active", true)
    }

    const { data: recipients, error } = await query

    if (error) throw error

    // Decrypt sensitive data for display (masked)
    const recipientsWithMaskedData = recipients?.map((recipient) => ({
      ...recipient,
      ssn_masked: recipient.ssn_encrypted ? "***-**-" + decrypt(recipient.ssn_encrypted).slice(-4) : null,
      ein_masked: recipient.ein_encrypted ? "**-***" + decrypt(recipient.ein_encrypted).slice(-4) : null,
      ssn_encrypted: undefined,
      ein_encrypted: undefined,
    }))

    return NextResponse.json({ recipients: recipientsWithMaskedData })
  } catch (error) {
    console.error("[v0] Error fetching recipients:", error)
    return NextResponse.json({ error: "Failed to fetch recipients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      businessName,
      email,
      phone,
      ssn,
      ein,
      tinType,
      streetAddress,
      city,
      state,
      zipCode,
      notes,
      tags,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !streetAddress || !city || !state || !zipCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!ssn && !ein) {
      return NextResponse.json({ error: "Either SSN or EIN is required" }, { status: 400 })
    }

    // Encrypt sensitive data
    const ssnEncrypted = ssn ? encrypt(ssn) : null
    const einEncrypted = ein ? encrypt(ein) : null

    const { data: recipient, error } = await supabase
      .from("recipients")
      .insert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        business_name: businessName,
        email,
        phone,
        ssn_encrypted: ssnEncrypted,
        ein_encrypted: einEncrypted,
        tin_type: tinType || (ssn ? "SSN" : "EIN"),
        street_address: streetAddress,
        city,
        state,
        zip_code: zipCode,
        notes,
        tags,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ recipient, success: true })
  } catch (error) {
    console.error("[v0] Error creating recipient:", error)
    return NextResponse.json({ error: "Failed to create recipient" }, { status: 500 })
  }
}
