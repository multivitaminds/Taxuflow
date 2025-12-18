import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { decrypt } from "@/lib/crypto"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: recipients, error } = await supabase
      .from("recipients")
      .select("*")
      .eq("user_id", user.id)
      .order("last_name", { ascending: true })

    if (error) throw error

    // Convert to CSV
    const headers = [
      "First Name",
      "Last Name",
      "Business Name",
      "Email",
      "Phone",
      "SSN",
      "EIN",
      "TIN Type",
      "Street Address",
      "City",
      "State",
      "ZIP Code",
      "Total Payments",
      "Payment Count",
      "Last Payment Date",
      "Notes",
      "Tags",
      "Active",
    ]

    const rows = recipients?.map((r) => [
      r.first_name,
      r.last_name,
      r.business_name || "",
      r.email || "",
      r.phone || "",
      r.ssn_encrypted ? decrypt(r.ssn_encrypted) : "",
      r.ein_encrypted ? decrypt(r.ein_encrypted) : "",
      r.tin_type || "",
      r.street_address,
      r.city,
      r.state,
      r.zip_code,
      r.total_payments || "0",
      r.payment_count || "0",
      r.last_payment_date || "",
      r.notes || "",
      r.tags?.join(";") || "",
      r.is_active ? "Yes" : "No",
    ])

    const csv = [headers, ...(rows || [])].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="recipients-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error exporting recipients:", error)
    return NextResponse.json({ error: "Failed to export recipients" }, { status: 500 })
  }
}
