import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// 1. Define the context with params as a Promise for Next.js 16
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // 2. Await the params promise to get the document id
    const { id } = await context.params;

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 3. Get document from database using the awaited 'id'
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id) // Updated from params.id to id
      .eq("user_id", user.id)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Download file from storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from("tax-documents")
      .download(document.file_path)

    if (storageError || !fileData) {
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
    }

    // Return file as blob
    return new NextResponse(fileData, {
      headers: {
        "Content-Type": document.file_type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${document.file_name}"`,
      },
    })
  } catch (error) {
    console.error("[v0] Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
