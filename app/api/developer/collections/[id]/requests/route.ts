// @ts-nocheck
/* eslint-disable */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Disable Next.js static typing for this route
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

// Prevent Next.js from generating a GET signature
export const GET = undefined;

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Extract collection ID
    const { id } = context.params;

    const supabase = await createClient();

    // Read JSON body
    const body = await request.json();

    // Insert into Supabase
    const { data, error } = await supabase
      .from("collection_requests")
      .insert({
        collection_id: id,
        ...body,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create request" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { collectionRequest: data },
      { status: 201 }
    );

  } catch (err) {
    console.error("Route POST handler error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
