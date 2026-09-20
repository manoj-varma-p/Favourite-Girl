import type { Metadata } from "next";
import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { getAllBlogs } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Field Notes & Blog | Treqo",
  description:
    "Real campaign breakdowns, attribution playbooks, and tactical growth insights from practitioners running live marketing budgets.",
};

export default async function BlogPage() {
  const posts = await getAllBlogs();
  return <BlogIndexClient posts={posts} />;
}
