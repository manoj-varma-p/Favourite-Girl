import { NextResponse } from "next/server";
import { getCandidateKeys } from "@/lib/ai-assistant";

export async function GET() {
  const keys = getCandidateKeys();
  const results = [];

  for (const k of keys) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${encodeURIComponent(k)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": k,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "hi" }] }],
        }),
      });

      const body = await res.json().catch(() => ({}));
      results.push({
        keyPrefix: k.slice(0, 6),
        keyLength: k.length,
        status: res.status,
        statusText: res.statusText,
        body,
      });
    } catch (err: any) {
      results.push({
        keyPrefix: k.slice(0, 6),
        keyLength: k.length,
        error: err.message,
      });
    }
  }

  return NextResponse.json({ results });
}
