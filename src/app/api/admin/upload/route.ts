import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

import { isAuthorizedRequest } from "@/lib/admin-auth";

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif", ".ico"]);

// Check if Cloudinary is configured
function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Check if we're running on Vercel (read-only filesystem)
function isVercel(): boolean {
  return Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "tutors";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine extension
    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "png"}`;
    const isImageMime = Boolean(file.type && file.type.startsWith("image/"));
    const hasImageExt = ALLOWED_EXTENSIONS.has(ext.toLowerCase());

    if (!isImageMime && !hasImageExt) {
      return NextResponse.json({ error: "Only image files (PNG, JPG, WEBP, SVG, GIF, AVIF) are allowed." }, { status: 400 });
    }

    // Validate size (max 8MB)
    const MAX_SIZE = 8 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 8MB limit." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // --- Path 1: Upload to Cloudinary (works on Vercel) ---
    if (isCloudinaryConfigured()) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const sanitizedName = file.name
        .replace(ext, "")
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .slice(0, 40);

      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `treqo/${folder}`,
            public_id: `${sanitizedName}-${Date.now()}`,
            resource_type: "image",
            overwrite: false,
          },
          (error, result) => {
            if (error || !result) reject(error || new Error("Cloudinary upload failed"));
            else resolve(result as { secure_url: string });
          }
        );
        uploadStream.end(buffer);
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        fileName: file.name,
        size: file.size,
      });
    }

    // --- Path 2: Vercel without Cloudinary — not supported ---
    if (isVercel()) {
      return NextResponse.json(
        {
          error:
            "Image uploads are not configured on this deployment. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your Vercel environment variables, or use 'Enter Image URL' to paste an image URL instead.",
        },
        { status: 503 }
      );
    }

    // --- Path 3: Local development — save to disk ---
    const sanitizedBase = file.name
      .replace(ext, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 30);
    const uniqueFilename = `${sanitizedBase}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}${ext}`;

    const targetDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, uniqueFilename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("[Upload Error]:", error);
    return NextResponse.json(
      { error: "Failed to save uploaded file. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // On Vercel without local disk, return empty list
  if (isVercel() && !isCloudinaryConfigured()) {
    return NextResponse.json({ success: true, files: [] });
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    async function scanDir(
      dir: string,
      baseRel = ""
    ): Promise<Array<{ url: string; name: string; size: number; mtime: number }>> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const list: Array<{ url: string; name: string; size: number; mtime: number }> = [];

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const rel = baseRel ? `${baseRel}/${entry.name}` : entry.name;
          if (entry.isDirectory()) {
            const nested = await scanDir(fullPath, rel);
            list.push(...nested);
          } else if (entry.isFile()) {
            if (entry.name === ".gitkeep") continue;
            const fileExt = path.extname(entry.name).toLowerCase();
            if ([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"].includes(fileExt)) {
              const stat = await fs.stat(fullPath);
              list.push({
                url: `/uploads/${rel.replace(/\\/g, "/")}`,
                name: entry.name,
                size: stat.size,
                mtime: stat.mtimeMs,
              });
            }
          }
        }
        return list;
      } catch {
        return [];
      }
    }

    const allFiles = await scanDir(uploadsDir);
    allFiles.sort((a, b) => b.mtime - a.mtime);

    return NextResponse.json({ success: true, files: allFiles });
  } catch (error) {
    console.error("[Upload List Error]:", error);
    return NextResponse.json(
      { error: "Failed to list uploaded files." },
      { status: 500 }
    );
  }
}
