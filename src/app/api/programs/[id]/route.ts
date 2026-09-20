import { NextRequest, NextResponse } from "next/server";
import {
  getProgramByIdFromDb,
  saveProgramToDb,
  deleteProgramFromDb,
} from "@/lib/content-db";
import { isAuthorizedRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

async function resolveParams(context: RouteContext): Promise<{ id: string }> {
  if ("then" in context.params) {
    return await context.params;
  }
  return context.params;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await resolveParams(context);
    const program = await getProgramByIdFromDb(id);

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, program });
  } catch (error) {
    console.error("[GET /api/programs/[id] error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrator credentials required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await resolveParams(context);
    const existing = await getProgramByIdFromDb(id);

    if (!existing) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const body = await req.json();

    // Validation for partial updates
    if (body.title !== undefined) {
      const trimmed = String(body.title).trim();
      if (!trimmed) {
        return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
      }
      if (trimmed.length > 150) {
        return NextResponse.json({ error: "Title cannot exceed 150 characters." }, { status: 400 });
      }
      existing.title = trimmed;
    }

    if (body.description !== undefined) {
      const trimmed = String(body.description).trim();
      if (!trimmed) {
        return NextResponse.json({ error: "Description cannot be empty." }, { status: 400 });
      }
      if (trimmed.length > 2000) {
        return NextResponse.json({ error: "Description cannot exceed 2000 characters." }, { status: 400 });
      }
      existing.description = trimmed;
    }

    if (body.badge !== undefined) {
      const trimmed = String(body.badge).trim();
      if (!trimmed) {
        return NextResponse.json({ error: "Badge cannot be empty." }, { status: 400 });
      }
      existing.badge = trimmed;
    }

    if (body.badgeVariant !== undefined) {
      const variant = String(body.badgeVariant).toLowerCase().trim();
      const allowedVariants = ["blue", "amber", "gray", "emerald"];
      if (!allowedVariants.includes(variant)) {
        return NextResponse.json(
          { error: `Invalid badge variant. Must be one of: ${allowedVariants.join(", ")}` },
          { status: 400 }
        );
      }
      existing.badgeVariant = variant as "blue" | "amber" | "gray" | "emerald";
    }

    if (body.image !== undefined) {
      existing.image = String(body.image).trim();
    }

    if (body.previewLabel !== undefined) {
      existing.previewLabel = String(body.previewLabel).trim();
    }

    if (body.duration !== undefined || body.meta !== undefined) {
      const d = String(body.duration || body.meta).trim();
      existing.duration = d;
      existing.meta = d;
    }

    if (body.actionText !== undefined) {
      existing.actionText = String(body.actionText).trim();
    }

    if (body.actionHref !== undefined || body.href !== undefined) {
      const url = String(body.actionHref || body.href).trim();
      existing.actionHref = url;
      existing.href = url;
    }

    if (body.isLocked !== undefined) {
      existing.isLocked = Boolean(body.isLocked);
    }

    if (body.isFlagship !== undefined) {
      existing.isFlagship = Boolean(body.isFlagship);
    }

    if (body.order !== undefined) {
      const num = Number(body.order);
      if (isNaN(num) || num < 0) {
        return NextResponse.json({ error: "Order must be a non-negative number." }, { status: 400 });
      }
      existing.order = num;
    }

    if (body.tags !== undefined) {
      let rawTags: string[] = [];
      if (Array.isArray(body.tags)) rawTags = body.tags;
      else if (typeof body.tags === "string") rawTags = body.tags.split(",").map((t: string) => t.trim());
      existing.tags = Array.from(new Set(rawTags.map((t) => String(t).trim()).filter((t) => t.length > 0)));
      if (existing.tags.length === 0) existing.tags = ["All"];
    }

    if (body.batch !== undefined) existing.batch = String(body.batch).trim();
    if (body.feeTotal !== undefined) existing.feeTotal = String(body.feeTotal).trim();
    if (body.feeEmi !== undefined) existing.feeEmi = String(body.feeEmi).trim();
    if (body.curriculumPdf !== undefined) existing.curriculumPdf = String(body.curriculumPdf).trim();
    if (body.overview !== undefined) existing.overview = String(body.overview).trim();
    if (body.applyCta !== undefined) existing.applyCta = String(body.applyCta).trim();
    if (body.syllabusCta !== undefined) existing.syllabusCta = String(body.syllabusCta).trim();

    await saveProgramToDb(existing);

    return NextResponse.json({
      success: true,
      message: "Program updated successfully",
      program: existing,
    });
  } catch (error) {
    console.error("[PATCH /api/programs/[id] error]:", error);
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrator credentials required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await resolveParams(context);
    const deleted = await deleteProgramFromDb(id);

    if (!deleted) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/programs/[id] error]:", error);
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
