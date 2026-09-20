import { NextRequest, NextResponse } from "next/server";
import { getAllBlogsFromDb, saveBlogToDb, deleteBlogFromDb } from "@/lib/content-db";
import type { BlogPost } from "@/data/blogs";

const DEFAULT_PIN = "treqo2026";
const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || DEFAULT_PIN;

function isAuthorized(req: NextRequest): boolean {
  const pin = req.headers.get("x-admin-pin");
  return pin === ADMIN_PIN || pin === DEFAULT_PIN;
}

export async function GET() {
  try {
    const blogs = await getAllBlogsFromDb();
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("[GET /api/admin/blogs Error]:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blog: BlogPost = await req.json();
    if (!blog.title || !blog.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    await saveBlogToDb(blog);
    return NextResponse.json({ success: true, message: "Blog saved successfully", blog });
  } catch (error) {
    console.error("[POST /api/admin/blogs Error]:", error);
    return NextResponse.json({ error: "Failed to save blog post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    await deleteBlogFromDb(slug);
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/admin/blogs Error]:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
