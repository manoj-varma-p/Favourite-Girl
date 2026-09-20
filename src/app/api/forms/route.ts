import { NextResponse } from "next/server";
import { getFormSettingsFromDb } from "@/lib/content-db";

export async function GET() {
  try {
    const forms = await getFormSettingsFromDb();
    return NextResponse.json({ success: true, forms });
  } catch (err) {
    console.error("[GET /api/forms Error]:", err);
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
  }
}
