import { getParents } from "@/app/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getParents();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/parents:", error);
    return NextResponse.json(
      { error: "Failed to fetch parents" },
      { status: 500 }
    );
  }
}
