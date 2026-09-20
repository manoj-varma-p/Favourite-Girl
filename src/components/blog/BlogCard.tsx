"use client";

import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/data/blogs";

interface BlogCardProps {
  post: BlogPost;
  onTagClick?: (tag: string) => void;
  onQuickPreview?: (post: BlogPost) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (postId: string) => void;
}

export default function BlogCard({
  post,
  onTagClick,
  onQuickPreview,
  isBookmarked = false,
  onToggleBookmark,
}: BlogCardProps) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:border-[#5A2A5A]/40 hover:shadow-xl hover:shadow-[#3B0D3B]/8 hover:-translate-y-1">
      <div>
        {/* Cover Image Container */}
        <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-60" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-xs border border-white/50 px-2.5 py-1 text-[11px] font-bold text-[#3B0D3B] shadow-xs">
              {post.category}
            </span>
          </div>

          {/* Read Time */}
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center rounded-md bg-slate-950/75 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold text-white">
              {post.readTime}
            </span>
          </div>
        </Link>

        {/* Content Section */}
        <div className="flex flex-col p-4 sm:p-6">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>{post.publishedAt}</span>
            {onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleBookmark(post.id);
                }}
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
                  isBookmarked
                    ? "bg-[#3B0D3B] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-[#FAF5EE] hover:text-[#3B0D3B]"
                }`}
              >
                {isBookmarked ? "Saved" : "Save"}
              </button>
            )}
          </div>

          <h3 className="mt-2 text-base sm:text-lg font-bold tracking-tight text-slate-950 leading-snug transition-colors group-hover:text-[#3B0D3B]">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>

          {/* Interactive Tags */}
          <div className="mt-3 sm:mt-3.5 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onTagClick) onTagClick(tag);
                }}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 transition-colors hover:border-[#3B0D3B] hover:bg-[#FAF5EE] hover:text-[#3B0D3B] active:bg-slate-100 cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Row: Author info + Quick Summary & Read links */}
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 leading-none">
              {post.author.name}
            </span>
            <span className="mt-0.5 text-[10px] text-slate-500 line-clamp-1">
              {post.author.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {onQuickPreview && (
            <button
              type="button"
              onClick={() => onQuickPreview(post)}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-[#5A2A5A] hover:bg-[#FAF5EE] hover:text-[#3B0D3B] active:bg-slate-100 transition-colors cursor-pointer"
            >
              Summary
            </button>
          )}
          <Link
            href={`/blog/${post.slug}`}
            className="rounded-lg bg-[#FAF5EE] px-3 py-1 text-xs font-bold text-[#3B0D3B] hover:bg-[#3B0D3B] hover:text-[#FDFAF6] active:scale-95 transition-all"
          >
            Read
          </Link>
        </div>
      </div>
    </article>
  );
}
