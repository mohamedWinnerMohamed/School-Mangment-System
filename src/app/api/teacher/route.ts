import {  getTeachers } from "@/app/lib/data";
import {  NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getTeachers();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
