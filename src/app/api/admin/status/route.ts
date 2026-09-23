import { NextRequest, NextResponse } from "next/server";
import { checkMongoConnection } from "@/lib/mongodb";
import { isAuthorizedRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrator credentials required." },
      { status: 401 }
    );
  }

  const status = await checkMongoConnection();
  return NextResponse.json(status);
}
