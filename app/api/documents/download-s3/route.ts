import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSignedDownloadUrl } from "@/lib/aws-s3"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const s3Key = searchParams.get("key")
    const filingId = searchParams.get("filingId")

    if (!s3Key) {
      return NextResponse.json({ error: "S3 key is required" }, { status: 400 })
    }

    // Verify user owns this filing
    if (filingId) {
      const { data: filing, error: filingError } = await supabase
        .from("tax_filings")
        .select("user_id, document_url")
        .eq("id", filingId)
        .single()

      if (filingError || !filing) {
        return NextResponse.json({ error: "Filing not found" }, { status: 404 })
      }

      if (filing.user_id !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      // Verify the S3 key matches the filing's document URL
      if (!filing.document_url?.includes(s3Key)) {
        return NextResponse.json({ error: "Invalid S3 key for this filing" }, { status: 403 })
      }
    }

    // Generate signed URL (expires in 1 hour)
    const signedUrl = await getSignedDownloadUrl(s3Key, 3600)

    console.log("[v0] Generated signed S3 URL for user:", user.id)

    // Redirect to signed URL
    return NextResponse.redirect(signedUrl)
  } catch (error: any) {
    console.error("[v0] S3 download error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate download URL" }, { status: 500 })
  }
}
