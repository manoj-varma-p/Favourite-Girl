import { NextRequest, NextResponse } from "next/server";
import { getAdminSecret } from "@/lib/admin-auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pin = typeof body.pin === "string" ? body.pin.trim() : "";

    if (!pin) {
      return NextResponse.json(
        { success: false, error: "Passcode is required." },
        { status: 400 }
      );
    }

    const secret = getAdminSecret().trim();

    // Constant-time comparison to prevent timing attacks
    const pinBuffer = Buffer.from(pin);
    const secretBuffer = Buffer.from(secret);

    let isValid = false;
    if (pinBuffer.length === secretBuffer.length) {
      isValid = crypto.timingSafeEqual(pinBuffer, secretBuffer);
    }

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: "Authentication successful.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid passcode. Please enter the authorized Treqo PIN." },
      { status: 401 }
    );
  } catch (error) {
    console.error("[POST /api/admin/auth Error]:", error);
    return NextResponse.json(
      { success: false, error: "Authentication service error." },
      { status: 500 }
    );
  }
}
