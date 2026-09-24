import { redirect } from "next/navigation";
import { formatCourseSlug } from "@/lib/seo-utils";

export default async function CategoryCoursesRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const clean = formatCourseSlug(slug);
  redirect(clean ? `/courses/${clean}` : "/");
}
