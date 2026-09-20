import { NextResponse } from "next/server";
import { checkMongoConnection } from "@/lib/mongodb";

export async function GET() {
  const status = await checkMongoConnection();
  return NextResponse.json(status);
}
