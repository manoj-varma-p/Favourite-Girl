import { NextResponse } from "next/server";
import { getLeads, deleteLead } from "@/lib/leads-db";
export { POST } from "@/app/api/apply/route";

function isAuthorized(request: Request, searchParams: URLSearchParams): boolean {
  const adminPin =
    process.env.ADMIN_SECRET_KEY ||
    process.env.ADMIN_PIN ||
    process.env.NEXT_PUBLIC_ADMIN_PIN ||
    "treqo2026";
  const authHeader = request.headers.get("authorization");
  const pinHeader = request.headers.get("x-admin-pin");
  const pinParam = searchParams.get("pin");

  if (pinHeader && pinHeader === adminPin) return true;
  if (pinParam && pinParam === adminPin) return true;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token === adminPin) return true;
  }
  return false;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (!isAuthorized(request, searchParams)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrator credentials required." },
      { status: 401 }
    );
  }

  const format = searchParams.get("format");
  const query = searchParams.get("q")?.toLowerCase();

  let leads = await getLeads();

  if (query) {
    leads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query) ||
        l.phone.includes(query) ||
        l.course.toLowerCase().includes(query)
    );
  }

  // Export as CSV for one-click Excel download
  if (format === "csv") {
    const csvHeaders = "Timestamp,Full Name,Email,Phone,Course,Background,Source\n";
    const csvRows = leads
      .map((l) =>
        [
          `"${new Date(l.submittedAt).toLocaleString("en-IN")}"`,
          `"${l.name.replace(/"/g, '""')}"`,
          `"${l.email.replace(/"/g, '""')}"`,
          `"${l.phone.replace(/"/g, '""')}"`,
          `"${l.course.replace(/"/g, '""')}"`,
          `"${l.background.replace(/"/g, '""')}"`,
          `"${l.source.replace(/"/g, '""')}"`,
        ].join(",")
      )
      .join("\n");

    return new Response(csvHeaders + csvRows, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="treqo-leads-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({
    total: leads.length,
    leads,
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  if (!isAuthorized(request, searchParams)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrator credentials required." },
      { status: 401 }
    );
  }

  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
  }

  await deleteLead(id);
  return NextResponse.json({ success: true, message: "Lead deleted" });
}
