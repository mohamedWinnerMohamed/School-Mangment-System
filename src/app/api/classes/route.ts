import { getClasses } from "@/app/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getClasses();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}
