"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Container from "@/components/ui/Container";
import BlogCard from "@/components/blog/BlogCard";
import type { BlogPost } from "@/data/blogs";

interface BlogIndexClientProps {
  posts: BlogPost[];
  banner?: ReactNode;
}

export default function BlogIndexClient({ posts, banner }: BlogIndexClientProps) {
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "subscribed">("idle");

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const otherPosts = posts.filter((p) => p.slug !== featuredPost?.slug);

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("subscribed");
    }, 600);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF6] text-[#1A0A1A]">
      <Header variant="standard" banner={banner} />

      <main className="flex-1 pb-16 sm:pb-20">
        {/* Top Hero Section */}
        <section className="relative overflow-hidden bg-[#FDFAF6] border-b border-[#F5EDE0] py-10 sm:py-16 lg:py-20">
          <Container>
            <div className="mx-auto max-w-3xl text-center px-1 sm:px-0">
              {/* Top Badge */}
              <span className="inline-flex items-center rounded-full border border-[#5A2A5A]/20 bg-white px-3 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-bold text-[#3B0D3B] shadow-2xs">
                TREQO FIELD NOTES &amp; BLOG
              </span>

              {/* Main Headline */}
              <h1 className="mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-[3.25rem] font-black tracking-tight text-[#1A0A1A] leading-[1.15] sm:leading-[1.12]">
                Real Budgets. Real Stakes.
                <span className="block text-[#5A2A5A]">Practical Growth Insights.</span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-2.5 sm:mt-4 max-w-2xl text-xs sm:text-base text-[#5A4A5A] leading-relaxed font-normal">
                Field notes, growth breakdowns, and tactical playbooks from practitioners running real ad accounts, building attribution systems, and defending unit economics out loud.
              </p>
            </div>
          </Container>
        </section>

        {/* Main Content Container: Featured Article */}
        <Container className="mt-8 sm:mt-14 max-w-5xl">
          {featuredPost && (
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#F5EDE0] bg-white shadow-xs sm:shadow-sm transition-all hover:shadow-xl hover:shadow-[#3B0D3B]/5">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left: Image Container */}
                <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 overflow-hidden bg-slate-100 min-h-[240px] sm:min-h-[340px]">
                  {featuredPost.coverImage && (
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-xs border border-white/50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold text-[#3B0D3B] shadow-xs">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>

                {/* Right: Copy & Actions */}
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span>{featuredPost.publishedAt}</span>
                      <span>·</span>
                      <span>{featuredPost.readTime}</span>
                    </div>

                    <h2 className="mt-2.5 sm:mt-3 text-lg sm:text-2xl font-black text-slate-950 tracking-tight leading-snug group-hover:text-[#3B0D3B] transition-colors">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {featuredPost.excerpt}
                    </p>

                    {/* Interactive Tags */}
                    {featuredPost.tags && featuredPost.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {featuredPost.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 sm:mt-8 flex items-center justify-between border-t border-slate-100 pt-4 sm:pt-5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        {featuredPost.author.avatar ? (
                          <Image
                            src={featuredPost.author.avatar}
                            alt={featuredPost.author.name}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-[#FAF5EE] text-[#3B0D3B] font-bold text-xs">
                            {featuredPost.author.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-none">
                          {featuredPost.author.name}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-500 line-clamp-1">
                          {featuredPost.author.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewPost(featuredPost)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#3B0D3B] hover:bg-[#FAF5EE] hover:text-[#3B0D3B] active:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Summary
                      </button>
                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="rounded-lg bg-[#3B0D3B] px-4 py-1.5 text-xs font-bold text-[#FDFAF6] shadow-xs hover:bg-[#5A2A5A] active:scale-95 transition-all"
                      >
                        Read
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Other Articles (if multiple posts uploaded via Decap CMS) */}
          {otherPosts.length > 0 && (
            <div className="mt-12 sm:mt-16">
              <h3 className="text-xl sm:text-2xl font-black text-[#1A0A1A] tracking-tight mb-6">
                More Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((otherPost) => (
                  <BlogCard key={otherPost.slug} post={otherPost} />
                ))}
              </div>
            </div>
          )}

          {/* Interactive Newsletter Box */}
          <div className="mt-10 sm:mt-16 overflow-hidden rounded-2xl sm:rounded-3xl border border-[#F5EDE0] bg-white p-6 sm:p-10 text-center shadow-xs">
            <span className="inline-flex items-center rounded-full bg-[#3B0D3B] px-3 py-1 text-xs font-bold text-[#FDFAF6]">
              WEEKLY FIELD NOTES
            </span>
            <h3 className="mt-3 text-xl sm:text-2xl font-black text-[#1A0A1A] tracking-tight">
              Get practical growth breakdowns in your inbox
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-[#5A4A5A] leading-relaxed font-normal">
              No generic fluff or automated spam. Just real campaign tear-downs, attribution playbooks, and verified lessons from running live budgets.
            </p>

            {newsletterStatus === "subscribed" ? (
              <div className="mx-auto mt-5 max-w-md rounded-xl sm:rounded-2xl bg-[#FAF5EE] border border-[#5A2A5A]/30 p-3.5 sm:p-4 shadow-xs animate-in fade-in duration-300">
                <p className="text-xs sm:text-sm font-bold text-[#3B0D3B]">
                  You are subscribed to Treqo Field Notes. Check your inbox soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 focus:border-[#3B0D3B] focus:outline-none focus:ring-1 focus:ring-[#3B0D3B]"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "loading"}
                  className="rounded-xl bg-[#3B0D3B] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#FDFAF6] shadow-sm hover:bg-[#5A2A5A] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </Container>
      </main>

      {/* Interactive Quick Summary Modal */}
      {previewPost && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewPost(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Indicator */}
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 sm:hidden" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 sm:pb-4">
              <span className="rounded-full bg-[#FAF5EE] border border-[#5A2A5A]/20 px-3 py-0.5 text-xs font-bold text-[#3B0D3B]">
                {previewPost.category}
              </span>
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer p-1"
              >
                Close
              </button>
            </div>

            {/* Modal Title & Meta */}
            <div className="mt-3.5 sm:mt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>{previewPost.publishedAt}</span>
                <span>·</span>
                <span>{previewPost.readTime}</span>
              </div>
              <h3 className="mt-1.5 sm:mt-2 text-base sm:text-xl font-black text-[#1A0A1A] tracking-tight leading-snug">
                {previewPost.title}
              </h3>
            </div>

            {/* Core Takeaway */}
            <div className="mt-3.5 sm:mt-4 rounded-xl border border-[#5A2A5A]/20 bg-[#FAF5EE] p-3.5 sm:p-4">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5A2A5A]">
                30-SECOND TAKEAWAY
              </span>
              <p className="mt-1 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {previewPost.excerpt}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 sm:mt-6 flex items-center justify-end gap-2.5 sm:gap-3 border-t border-slate-100 pt-3.5 sm:pt-4">
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <Link
                href={`/blog/${previewPost.slug}`}
                className="rounded-xl bg-[#3B0D3B] px-4 sm:px-5 py-2 text-xs font-bold text-[#FDFAF6] shadow-xs hover:bg-[#5A2A5A] transition-all"
              >
                Read Full Article
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
