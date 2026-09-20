import { NextRequest } from "next/server";

const DEFAULT_PIN = "treqo2026";

export function getAdminSecret(): string {
  return (
    process.env.ADMIN_SECRET_KEY ||
    process.env.ADMIN_PIN ||
    process.env.NEXT_PUBLIC_ADMIN_PIN ||
    DEFAULT_PIN
  );
}

export function isAuthorizedRequest(req: NextRequest): boolean {
  const secret = getAdminSecret();
  const pinHeader = req.headers.get("x-admin-pin");
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const pinParam = searchParams.get("pin");

  // Check custom header
  if (pinHeader && pinHeader.trim() === secret.trim()) {
    return true;
  }

  // Check Bearer token
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === secret.trim()) return true;
  }

  // Check URL query param (for CSV download / export)
  if (pinParam && pinParam.trim() === secret.trim()) {
    return true;
  }

  return false;
}
