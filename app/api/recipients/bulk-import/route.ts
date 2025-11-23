import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { encrypt } from "@/lib/crypto"

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
    const { recipients } = body

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Invalid recipients data" }, { status: 400 })
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    }

    for (const recipient of recipients) {
      try {
        const ssnEncrypted = recipient.ssn ? encrypt(recipient.ssn) : null
        const einEncrypted = recipient.ein ? encrypt(recipient.ein) : null

        await supabase.from("recipients").insert({
          user_id: user.id,
          first_name: recipient.firstName,
          last_name: recipient.lastName,
          business_name: recipient.businessName,
          email: recipient.email,
          phone: recipient.phone,
          ssn_encrypted: ssnEncrypted,
          ein_encrypted: einEncrypted,
          tin_type: recipient.tinType || (recipient.ssn ? "SSN" : "EIN"),
          street_address: recipient.streetAddress,
          city: recipient.city,
          state: recipient.state,
          zip_code: recipient.zipCode,
          notes: recipient.notes,
          tags: recipient.tags,
        })

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push({
          recipient: `${recipient.firstName} ${recipient.lastName}`,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({ results, success: true })
  } catch (error) {
    console.error("[v0] Error bulk importing recipients:", error)
    return NextResponse.json({ error: "Failed to bulk import recipients" }, { status: 500 })
  }
}
