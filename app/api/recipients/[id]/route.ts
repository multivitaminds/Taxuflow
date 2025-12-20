import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { encrypt, decrypt } from "@/lib/crypto"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { data: recipient, error } = await supabase
      .from("recipients")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) throw error

    // Decrypt sensitive data
    const recipientWithDecryptedData = {
      ...recipient,
      ssn: recipient.ssn_encrypted ? decrypt(recipient.ssn_encrypted) : null,
      ein: recipient.ein_encrypted ? decrypt(recipient.ein_encrypted) : null,
      ssn_encrypted: undefined,
      ein_encrypted: undefined,
    }

    return NextResponse.json({ recipient: recipientWithDecryptedData })
  } catch (error) {
    console.error("[v0] Error fetching recipient:", error)
    return NextResponse.json({ error: "Failed to fetch recipient" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updates: any = { updated_at: new Date().toISOString() }

    // Handle regular fields
    if (body.firstName) updates.first_name = body.firstName
    if (body.lastName) updates.last_name = body.lastName
    if (body.businessName !== undefined) updates.business_name = body.businessName
    if (body.email !== undefined) updates.email = body.email
    if (body.phone !== undefined) updates.phone = body.phone
    if (body.streetAddress) updates.street_address = body.streetAddress
    if (body.city) updates.city = body.city
    if (body.state) updates.state = body.state
    if (body.zipCode) updates.zip_code = body.zipCode
    if (body.notes !== undefined) updates.notes = body.notes
    if (body.tags !== undefined) updates.tags = body.tags
    if (body.isActive !== undefined) updates.is_active = body.isActive

    // Handle encrypted fields
    if (body.ssn) {
      updates.ssn_encrypted = encrypt(body.ssn)
      updates.tin_type = "SSN"
    }
    if (body.ein) {
      updates.ein_encrypted = encrypt(body.ein)
      updates.tin_type = "EIN"
    }

    const { data: recipient, error } = await supabase
      .from("recipients")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ recipient, success: true })
  } catch (error) {
    console.error("[v0] Error updating recipient:", error)
    return NextResponse.json({ error: "Failed to update recipient" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { error } = await supabase.from("recipients").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting recipient:", error)
    return NextResponse.json({ error: "Failed to delete recipient" }, { status: 500 })
  }
}
