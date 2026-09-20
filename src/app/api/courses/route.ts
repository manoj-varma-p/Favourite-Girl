import { NextResponse } from "next/server";
import { getCoursesFromDb } from "@/lib/content-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = await getCoursesFromDb();
    return NextResponse.json({ courses });
  } catch (err) {
    console.error("[GET /api/courses error]:", err);
    return NextResponse.json({ courses: [] }, { status: 500 });
  }
}
