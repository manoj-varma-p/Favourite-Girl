import { NextRequest, NextResponse } from "next/server";
import {
  getProgramsFromDb,
  saveProgramToDb,
  reorderProgramsInDb,
  type ProgramItem,
} from "@/lib/content-db";
import { isAuthorizedRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function sanitizeString(val: unknown): string {
  if (typeof val !== "string") return "";
  return val.trim();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status")?.toLowerCase();
    const search = searchParams.get("search")?.toLowerCase().trim();
    const tag = searchParams.get("tag")?.toLowerCase().trim();

    let programs = await getProgramsFromDb();

    if (status === "live") {
      programs = programs.filter((p) => !p.isLocked);
    } else if (status === "locked" || status === "coming-soon") {
      programs = programs.filter((p) => p.isLocked);
    }

    if (tag && tag !== "all") {
      programs = programs.filter((p) =>
        p.tags?.some((t) => t.toLowerCase() === tag)
      );
    }

    if (search) {
      programs = programs.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          (p.meta && p.meta.toLowerCase().includes(search)) ||
          (p.previewLabel && p.previewLabel.toLowerCase().includes(search)) ||
          p.tags?.some((t) => t.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      count: programs.length,
      programs,
    });
  } catch (error) {
    console.error("[GET /api/programs error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch programs", programs: [], count: 0 },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrator credentials required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    // Check if this is a bulk reorder request
    if (body.action === "reorder" && Array.isArray(body.orderedIds)) {
      const reordered = await reorderProgramsInDb(body.orderedIds);
      return NextResponse.json({
        success: true,
        message: "Programs reordered successfully",
        programs: reordered,
      });
    }

    const title = sanitizeString(body.title);
    const description = sanitizeString(body.description);
    const badge = sanitizeString(body.badge);
    const duration = sanitizeString(body.duration || body.meta);
    const meta = duration;
    const actionText = sanitizeString(body.actionText) || "View course →";
    const actionHref = sanitizeString(body.actionHref || body.href);
    const previewLabel = sanitizeString(body.previewLabel) || "PROGRAM PREVIEW";
    const image = sanitizeString(body.image);
    const isLocked = Boolean(body.isLocked);
    const isFlagship = Boolean(body.isFlagship);

    // Validation
    if (!title) {
      return NextResponse.json({ error: "Program title is required." }, { status: 400 });
    }
    if (title.length > 150) {
      return NextResponse.json({ error: "Title cannot exceed 150 characters." }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ error: "Program description is required." }, { status: 400 });
    }
    if (description.length > 2000) {
      return NextResponse.json({ error: "Description cannot exceed 2000 characters." }, { status: 400 });
    }

    if (!badge) {
      return NextResponse.json({ error: "Badge text is required." }, { status: 400 });
    }

    if (!actionHref) {
      return NextResponse.json({ error: "Action URL is required." }, { status: 400 });
    }

    // Badge variant validation
    const allowedVariants = ["blue", "amber", "gray", "emerald"];
    const badgeVariant = body.badgeVariant ? String(body.badgeVariant).toLowerCase() : isLocked ? "gray" : "blue";
    if (!allowedVariants.includes(badgeVariant)) {
      return NextResponse.json(
        { error: `Invalid badge variant. Must be one of: ${allowedVariants.join(", ")}` },
        { status: 400 }
      );
    }

    // Order validation
    let order: number | undefined = undefined;
    if (body.order !== undefined && body.order !== null && body.order !== "") {
      const parsedOrder = Number(body.order);
      if (isNaN(parsedOrder) || parsedOrder < 0) {
        return NextResponse.json({ error: "Order must be a non-negative number." }, { status: 400 });
      }
      order = parsedOrder;
    }

    // Tags processing and validation
    let rawTags: string[] = [];
    if (Array.isArray(body.tags)) {
      rawTags = body.tags;
    } else if (typeof body.tags === "string") {
      rawTags = body.tags.split(",").map((t: string) => t.trim());
    }
    const tags = Array.from(
      new Set(
        rawTags
          .map((t) => sanitizeString(t))
          .filter((t) => t.length > 0 && t.length <= 40)
      )
    );
    if (tags.length === 0) {
      tags.push("All");
    }

    // Generate or validate ID
    const rawId = sanitizeString(body.id);
    const slug = rawId
      ? rawId.toLowerCase().replace(/[^a-z0-9_-]/g, "-")
      : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const existingPrograms = await getProgramsFromDb();
    if (existingPrograms.some((p) => p.id === slug)) {
      return NextResponse.json(
        { error: `A program with the ID or slug "${slug}" already exists.` },
        { status: 409 }
      );
    }

    const newProgram: ProgramItem = {
      id: slug,
      title,
      description,
      badge,
      badgeVariant: badgeVariant as "blue" | "amber" | "gray" | "emerald",
      duration: duration || "4 months · Online",
      meta: meta || "4 months · Online",
      previewLabel,
      image: image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      actionText,
      actionHref,
      href: actionHref,
      tags,
      isLocked,
      isFlagship,
      order,
      batch: sanitizeString(body.batch) || "Batch 2 · Sep 2026",
      feeTotal: sanitizeString(body.feeTotal) || "₹55,000",
      feeEmi: sanitizeString(body.feeEmi) || "₹4,583 / month",
      curriculumPdf: sanitizeString(body.curriculumPdf) || "/treqo-curriculum.pdf",
      overview: sanitizeString(body.overview) || description,
      applyCta: sanitizeString(body.applyCta) || (isLocked ? "Notify Me When Open" : "Apply for Batch 2"),
      syllabusCta: sanitizeString(body.syllabusCta) || "Download Curriculum",
      metaKeywords: Array.isArray(body.metaKeywords) ? body.metaKeywords : undefined,
    };

    await saveProgramToDb(newProgram);

    return NextResponse.json(
      {
        success: true,
        message: "Program created successfully",
        program: newProgram,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/programs error]:", error);
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}
