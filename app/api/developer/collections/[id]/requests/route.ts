import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const supabase = await createClient();

    // Fetch the file record
    const { data: document, error } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", id)
      .single();

    if (error || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const filePath = document.file_path;

    // Generate signed URL
    const { data: signedUrl, error: signedUrlError } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 60);

    if (signedUrlError || !signedUrl) {
      return NextResponse.json(
        { error: "Failed to generate signed URL" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(signedUrl.signedUrl);
  } catch (err) {
    console.error("Error in document download route:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
