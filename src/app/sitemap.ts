import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogs";
import { learningSystemCourses } from "@/data/home";
import { megaMenuData } from "@/data/navigation";
import { getCoursesFromDb } from "@/lib/content-db";
import { formatCourseSlug } from "@/lib/seo-utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://treqo.org";

  const categoryLinks = megaMenuData.columns.find((c) => c.title === "Learn by Category")?.links ?? [];

  // Static course slugs from hardcoded data
  const staticSlugs = [
    ...learningSystemCourses.map((c) => formatCourseSlug(c.href)),
    ...categoryLinks.map((l) => formatCourseSlug(l.href)),
  ].filter(Boolean);

  // Dynamic courses from DB — use their stored href (may be /programs/... etc)
  const dbCourses = await getCoursesFromDb().catch(() => []);
  const dbRoutes: MetadataRoute.Sitemap = dbCourses.map((c) => {
    const href = c.href && c.href.startsWith("/") ? c.href : `/courses/${formatCourseSlug(c.href) || c.id}`;
    return {
      url: `${baseUrl}${href}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: c.isFlagship ? 0.9 : 0.7,
    };
  });

  // Static courses pointing to canonical /courses/ URLs
  const staticRoutes: MetadataRoute.Sitemap = Array.from(new Set(staticSlugs)).map((slug) => ({
    url: `${baseUrl}/courses/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: slug === "digital-marketing" || slug === "4m-program" ? 0.9 : 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt || new Date()),
    changeFrequency: "monthly" as const,
    priority: post.featured ? 0.8 : 0.6,
  }));

  // Merge db + static (db takes priority, dedup by URL)
  const allCourseUrls = new Map<string, MetadataRoute.Sitemap[number]>();
  staticRoutes.forEach((r) => allCourseUrls.set(r.url, r));
  dbRoutes.forEach((r) => allCourseUrls.set(r.url, r)); // db overrides static

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...Array.from(allCourseUrls.values()),
    ...blogRoutes,
  ];
}

