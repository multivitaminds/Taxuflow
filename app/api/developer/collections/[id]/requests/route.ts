import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 15 Breaking Change: 
 * 'params' is now a Promise and must be defined as such in the type.
 */
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    // 1. Await the params to get the 'id' from the URL [id]
    const { id } = await context.params;

    // 2. Parse the incoming request body
    const body = await request.json();

    // --- YOUR LOGIC START ---
    // Example: Save 'body' to your database using the 'id'
    console.log(`Processing POST for collection: ${id}`, body);
    
    // Replace the line below with your actual data logic:
    // const result = await yourDatabaseClient.collectionRequest.create({ data: { ...body, id } });
    // --- YOUR LOGIC END ---

    return NextResponse.json(
      { 
        success: true, 
        message: "Request handled successfully",
        collectionId: id 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

/**
 * NOTE: If you have a GET, PATCH, or DELETE method in this file, 
 * you must apply the same 'Promise' type and 'await context.params' 
 * to those functions as well.
 */
