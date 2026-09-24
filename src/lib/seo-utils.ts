import type { PageSeoItem, CourseItem } from "@/lib/content-db";

/**
 * Format any course URL slug or title into a clean, canonical slug.
 * e.g. "/categories/new-age-digital-marketing/" -> "new-age-digital-marketing"
 * e.g. "Digital Marketing 2026!" -> "digital-marketing-2026"
 */
export function formatCourseSlug(input?: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .trim()
    .replace(/^\/+/, "")
    .replace(/^(courses|categories|programs)\//, "")
    .replace(/^(courses|categories|programs)\//, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Automatically synchronizes Page SEO settings with active courses.
 * If a course title or slug is changed, the corresponding item in Page SEO
 * is immediately updated with the new name, path, and meta title.
 */
export function syncPageSeoWithCourses(
  pageSeoList: PageSeoItem[] = [],
  courses: CourseItem[] = []
): PageSeoItem[] {
  if (!courses || courses.length === 0) return pageSeoList;

  const result: PageSeoItem[] = [...pageSeoList];

  for (const course of courses) {
    if (!course || !course.title) continue;

    const rawSlug = formatCourseSlug(course.href) || formatCourseSlug(course.id);
    if (!rawSlug) continue;

    const canonicalPath =
      course.href && course.href.startsWith("/")
        ? course.href
        : `/courses/${rawSlug}`;


    // Find existing SEO item for this course
    const existingIndex = result.findIndex((p) => {
      const pSlug = formatCourseSlug(p.path) || formatCourseSlug(p.id);
      return (
        p.id === course.id ||
        p.id === rawSlug ||
        pSlug === rawSlug ||
        formatCourseSlug(p.path) === rawSlug ||
        (rawSlug === "digital-marketing" && (p.id === "new-age-dm" || p.id === "digital-marketing"))
      );
    });

    if (existingIndex >= 0) {
      const existing = result[existingIndex];
      result[existingIndex] = {
        ...existing,
        name: course.title,
        path: canonicalPath,
        category: "Courses",
        title: existing.title && !existing.title.includes("| TREQO")
          ? existing.title
          : `${course.title} | TREQO`,
        metaDescription: existing.metaDescription || course.description || "",
        metaKeywords:
          Array.isArray(course.metaKeywords) && course.metaKeywords.length > 0
            ? course.metaKeywords
            : existing.metaKeywords || [],
      };
    } else {
      result.push({
        id: course.id || rawSlug,
        path: canonicalPath,
        name: course.title,
        category: "Courses",
        title: `${course.title} | TREQO`,
        metaDescription: course.description || "",
        metaKeywords: Array.isArray(course.metaKeywords) ? course.metaKeywords : [],
      });
    }
  }

  return result;
}
