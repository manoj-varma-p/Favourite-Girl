import type { Metadata } from "next";
import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { getAllBlogs } from "@/lib/cms";
import { getPageSeoByPath } from "@/lib/content-db";

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath("/blog");
  return {
    title: pageSeo?.title || pageSeo?.metaTitle || "Field Notes & Blog | Treqo",
    description:
      pageSeo?.metaDescription ||
      "Real campaign breakdowns, attribution playbooks, and tactical growth insights from practitioners running live marketing budgets.",
    ...(pageSeo?.metaKeywords && pageSeo.metaKeywords.length > 0 ? { keywords: pageSeo.metaKeywords } : {}),
  };
}

export default async function BlogPage() {
  const posts = await getAllBlogs();
  return <BlogIndexClient posts={posts} />;
}
