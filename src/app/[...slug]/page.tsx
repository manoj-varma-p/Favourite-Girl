import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCoursesFromDb } from "@/lib/content-db";
import CourseDetailPage, {
  resolveCourseMeta,
  generateMetadata as generateCourseMetadata,
} from "@/app/courses/[slug]/page";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

interface CatchAllPageProps {
  params: Promise<{ slug: string[] }>;
}

const RESERVED_FIRST_SEGMENTS = new Set([
  "admin",
  "api",
  "blog",
  "privacy",
  "privacy-policy",
  "terms",
  "terms-and-conditions",
  "_next",
]);

export async function generateMetadata({ params }: CatchAllPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};
  if (RESERVED_FIRST_SEGMENTS.has(slug[0])) return {};

  const fullPath = "/" + slug.join("/");
  const meta = await resolveCourseMeta(fullPath);
  if (!meta) return {};

  return generateCourseMetadata({
    params: Promise.resolve({ slug: fullPath }),
  });
}

export default async function CatchAllSlugPage({ params }: CatchAllPageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();
  if (RESERVED_FIRST_SEGMENTS.has(slug[0])) notFound();

  const fullPath = "/" + slug.join("/");
  const dbCourses = await getCoursesFromDb().catch(() => []);
  const metaInfo =
    (await resolveCourseMeta(fullPath, dbCourses)) ||
    (await resolveCourseMeta(slug[slug.length - 1], dbCourses));

  if (!metaInfo) {
    notFound();
  }

  return CourseDetailPage({
    params: Promise.resolve({ slug: fullPath }),
  });
}
