import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 🚀 OVERRIDE Next.js wrong inferred type
export const GET = undefined;

export const POST = async (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const { id } = context.params;
    const supabase = await createClient();

    const body = await request.json();

    // Insert request into database
    const { data, error } = await supabase
      .from("collection_requests")
      .insert({
        collection_id: id,
        payload: body,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ collectionRequest: data });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const { id } = context.params;
    const supabase = await createClient();

    const { error } = await supabase
      .from("collection_requests")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Block GET explicitly so type inference stops generating Promise params
export function GET_handler() {
  return NextResponse.json(
    { error: "GET not supported" },
    { status: 405 }
  );
}
