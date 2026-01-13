import { getSubjects } from "@/app/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = (searchParams.get("active") as "active" | "all") || "all";
    const data = await getSubjects(active);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
