"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FileText,
  Search,
  Check,
  AlertTriangle,
  Sparkles,
  Eye,
  Copy,
  RotateCcw,
  ExternalLink,
  Save,
  Globe,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  Monitor,
  Tag,
  ArrowRight,
  Filter,
  RefreshCw,
  Plus,
} from "lucide-react";
import type { PageSeoItem } from "@/lib/content-db";

interface Props {
  initialPages?: PageSeoItem[];
  adminPin: string;
  onSaved?: (updatedPages: PageSeoItem[]) => void;
  onSwitchToKeywords?: () => void;
}

export default function AdminPageDescriptionsTab({
  initialPages = [],
  adminPin,
  onSaved,
  onSwitchToKeywords,
}: Props) {
  const [pages, setPages] = useState<PageSeoItem[]>(() => {
    if (initialPages && initialPages.length > 0) return initialPages;
    return [];
  });

  // Keep pages state immediately in sync when parent initialPages updates (e.g. course title or slug renamed)
  useEffect(() => {
    if (initialPages && initialPages.length > 0) {
      setPages((current) => {
        if (!current || current.length === 0) return initialPages;
        return initialPages.map((initP) => {
          const local = current.find((c) => c.id === initP.id || c.path === initP.path);
          if (!local) return initP;
          return {
            ...local,
            name: initP.name, // Immediately reflected!
            path: initP.path, // Immediately reflected!
            title: local.title && !local.title.endsWith("| TREQO") ? local.title : initP.title,
          };
        });
      });
    }
  }, [initialPages]);

  const [selectedPageId, setSelectedPageId] = useState<string>(() => {
    return initialPages[0]?.id || "home";
  });

  const [viewMode, setViewMode] = useState<"studio" | "matrix">("studio");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "optimal" | "short" | "long" | "missing">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active selected page for Studio View
  const activePage = pages.find((p) => p.id === selectedPageId) || pages[0];

  // Categories list
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(pages.map((p) => p.category || "General")))];
  }, [pages]);

  // Description length helper
  function getDescLengthStatus(desc: string | undefined) {
    const len = (desc || "").trim().length;
    if (len === 0) return { status: "missing", label: "Missing", color: "text-rose-600 bg-rose-50 border-rose-200" };
    if (len < 100) return { status: "short", label: `${len} chars (Too short)`, color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (len < 120) return { status: "short", label: `${len} chars (Fair)`, color: "text-amber-600 bg-amber-50 border-amber-200" };
    if (len <= 158) return { status: "optimal", label: `${len} chars (Optimal)`, color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    return { status: "long", label: `${len} chars (Truncated)`, color: "text-purple-700 bg-purple-50 border-purple-200" };
  }

  // Health Metrics
  const metrics = useMemo(() => {
    let optimal = 0;
    let short = 0;
    let long = 0;
    let missing = 0;

    pages.forEach((p) => {
      const len = (p.metaDescription || "").trim().length;
      if (len === 0) missing++;
      else if (len < 120) short++;
      else if (len <= 158) optimal++;
      else long++;
    });

    const total = pages.length || 1;
    const score = Math.round((optimal / total) * 100);

    return { total: pages.length, optimal, short, long, missing, score };
  }, [pages]);

  // Filtered pages
  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      const matchesCategory =
        activeCategoryFilter === "All" || (p.category || "General") === activeCategoryFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.metaDescription || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.metaKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      const descLen = (p.metaDescription || "").trim().length;
      let matchesStatus = true;
      if (statusFilter === "missing") matchesStatus = descLen === 0;
      else if (statusFilter === "short") matchesStatus = descLen > 0 && descLen < 120;
      else if (statusFilter === "optimal") matchesStatus = descLen >= 120 && descLen <= 158;
      else if (statusFilter === "long") matchesStatus = descLen > 158;

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [pages, activeCategoryFilter, searchQuery, statusFilter]);

  // Save all pages
  async function handleSaveAll(updatedList?: PageSeoItem[]) {
    const dataToSave = updatedList || pages;
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({ type: "pageSeo", data: dataToSave }),
      });

      if (res.ok) {
        setStatusMsg({ type: "success", text: "Page meta descriptions saved successfully!" });
        if (onSaved) onSaved(dataToSave);
      } else {
        const err = await res.json().catch(() => ({}));
        setStatusMsg({ type: "error", text: err.error || "Failed to save meta descriptions." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error saving meta descriptions." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 4500);
    }
  }

  // Update specific page description
  function updatePageDescription(id: string, newDesc: string) {
    setPages((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, metaDescription: newDesc } : p));
      return updated;
    });
  }

  // Update page title
  function updatePageTitle(id: string, newTitle: string) {
    setPages((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p));
      return updated;
    });
  }

  // Copy to clipboard
  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Smart Helpers / Enhancers
  function applyCtaPreset(page: PageSeoItem) {
    const current = (page.metaDescription || "").trim();
    let cta = "Enroll for Batch 2 · Live projects & mentor portfolio.";
    if (page.category === "Legal") cta = "Review verified compliance and terms for Treqo School.";
    if (page.path === "/blog") cta = "Read live breakdowns, attribution frameworks, and marketing playbooks.";

    let combined = current;
    if (!combined) {
      combined = `${page.title || page.name} at TREQO. ${cta}`;
    } else if (!combined.endsWith(".")) {
      combined = `${combined}. ${cta}`;
    } else {
      combined = `${combined} ${cta}`;
    }

    // Trim to 156 if needed
    if (combined.length > 158) {
      combined = combined.substring(0, 155) + "...";
    }
    updatePageDescription(page.id, combined);
  }

  function injectKeywords(page: PageSeoItem) {
    const primaryKeywords = page.metaKeywords.slice(0, 3).join(", ");
    if (!primaryKeywords) return;

    let text = page.metaDescription || "";
    if (!text) {
      text = `Comprehensive training covering ${primaryKeywords}. Real brand projects, live mentorship, and verified portfolio proofs at TREQO.`;
    } else {
      text = `${text} Master ${primaryKeywords} with live practitioner mentorship at TREQO.`;
    }

    if (text.length > 158) {
      text = text.substring(0, 155).trim() + "...";
    }
    updatePageDescription(page.id, text);
  }

  function trimToOptimal(page: PageSeoItem) {
    const text = (page.metaDescription || "").trim();
    if (text.length <= 158) return;
    const trimmed = text.substring(0, 155).trim() + "...";
    updatePageDescription(page.id, trimmed);
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B0D3B] text-white">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-[#1A0A1A]">Page-Wise Meta Description Manager</h2>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-[#3B0D3B]">
                SEO Snippets
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-600">
              Optimize click-through rates (CTR) from Google search results. Control page titles, descriptions, and
              preview Google SERP cards across desktop and mobile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onSwitchToKeywords && (
              <button
                type="button"
                onClick={onSwitchToKeywords}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                <Tag className="h-3.5 w-3.5 text-[#3B0D3B]" />
                Switch to Keyword Manager
                <ArrowRight className="h-3 w-3 text-stone-400" />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSaveAll()}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#2A092A] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save All Descriptions
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status banner */}
        {statusMsg && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
              statusMsg.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* SEO Health Dashboard Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-3.5">
            <span className="text-xs font-medium text-stone-500">Total Routes</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1A0A1A]">{metrics.total}</span>
              <span className="text-xs text-stone-400">pages</span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
            <span className="text-xs font-medium text-emerald-700">Optimal (120–158 chars)</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-800">{metrics.optimal}</span>
              <span className="text-xs text-emerald-600">ready</span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5">
            <span className="text-xs font-medium text-amber-700">Too Short (&lt; 120 chars)</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-800">{metrics.short}</span>
              <span className="text-xs text-amber-600">can expand</span>
            </div>
          </div>

          <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5">
            <span className="text-xs font-medium text-[#3B0D3B]">Long / Truncated (&gt; 158 chars)</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#3B0D3B]">{metrics.long}</span>
              <span className="text-xs text-[#3B0D3B]/70">may cut off</span>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-xs font-medium text-stone-500">SEO Health Score</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#3B0D3B]">{metrics.score}%</span>
              <span className="text-xs text-stone-400">optimal</span>
            </div>
          </div>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="mt-6 flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode("studio")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "studio"
                  ? "bg-white text-[#3B0D3B] shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              Snippet Studio (Focused)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "matrix"
                  ? "bg-white text-[#3B0D3B] shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              All-Pages Matrix (Bulk Table)
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search page or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-1.5 pl-8 pr-3 text-xs text-stone-800 placeholder-stone-400 focus:border-[#3B0D3B] focus:bg-white focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 focus:border-[#3B0D3B] focus:outline-none"
            >
              <option value="all">All Lengths</option>
              <option value="optimal">Optimal (120–158 chars)</option>
              <option value="short">Short (&lt; 120 chars)</option>
              <option value="long">Long (&gt; 158 chars)</option>
              <option value="missing">Missing Descriptions</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: STUDIO VIEW (Detailed Single-Page Focus + SERP Simulator)       */}
      {/* ========================================================================= */}
      {viewMode === "studio" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Page Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Select Page ({filteredPages.length})
                </h3>
                <span className="text-[11px] text-stone-400">Click to edit</span>
              </div>

              {/* Category Pills */}
              <div className="mt-3 flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      activeCategoryFilter === cat
                        ? "bg-[#3B0D3B] text-white font-semibold"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Page List */}
              <div className="mt-3 max-h-[580px] space-y-1.5 overflow-y-auto pr-1">
                {filteredPages.map((page) => {
                  const isSelected = page.id === selectedPageId;
                  const health = getDescLengthStatus(page.metaDescription);
                  const descLength = (page.metaDescription || "").trim().length;

                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setSelectedPageId(page.id)}
                      className={`w-full text-left rounded-xl p-3 transition-all border ${
                        isSelected
                          ? "border-[#3B0D3B] bg-purple-50/60 shadow-xs ring-1 ring-[#3B0D3B]/20"
                          : "border-transparent bg-stone-50/60 hover:border-stone-200 hover:bg-stone-100/70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-stone-900 line-clamp-1">
                          {page.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 border ${health.color}`}>
                          {descLength}c
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
                        <span className="font-mono text-[10px] text-stone-400 truncate max-w-[170px]">
                          {page.path}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {page.metaKeywords?.length || 0} kw
                        </span>
                      </div>
                      {page.metaDescription && (
                        <p className="mt-1.5 text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                          {page.metaDescription}
                        </p>
                      )}
                    </button>
                  );
                })}

                {filteredPages.length === 0 && (
                  <div className="rounded-xl border border-dashed border-stone-200 p-6 text-center text-xs text-stone-500">
                    No pages match your current filters.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Studio Editor & Live SERP Card */}
          <div className="lg:col-span-8 space-y-6">
            {activePage ? (
              <>
                {/* Page Info Header */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600">
                          {activePage.category || "General"}
                        </span>
                        <h3 className="text-lg font-bold text-[#1A0A1A]">{activePage.name}</h3>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-mono text-stone-600 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
                          {activePage.path}
                        </span>
                        <span>•</span>
                        <a
                          href={activePage.path}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#3B0D3B] hover:underline"
                        >
                          View Live Page
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(activePage.metaDescription || "", activePage.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        {copiedId === activePage.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-stone-500" />
                            Copy Snippet
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Google SERP Live Preview Card */}
                  <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50/60 p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-[#3B0D3B]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                          Google Search Result Snippet Simulation
                        </span>
                      </div>

                      {/* Device Toggle */}
                      <div className="flex items-center gap-1 rounded-lg bg-stone-200/70 p-0.5">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("desktop")}
                          className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            previewDevice === "desktop"
                              ? "bg-white text-stone-900 shadow-2xs"
                              : "text-stone-500 hover:text-stone-800"
                          }`}
                        >
                          <Monitor className="h-3 w-3" />
                          Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("mobile")}
                          className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            previewDevice === "mobile"
                              ? "bg-white text-stone-900 shadow-2xs"
                              : "text-stone-500 hover:text-stone-800"
                          }`}
                        >
                          <Smartphone className="h-3 w-3" />
                          Mobile
                        </button>
                      </div>
                    </div>

                    {/* Google SERP Card Body */}
                    <div className={`mt-4 rounded-xl bg-white p-4 shadow-sm border border-stone-200/80 font-sans transition-all ${
                      previewDevice === "mobile" ? "max-w-md mx-auto" : "w-full"
                    }`}>
                      {/* URL Breadcrumb */}
                      <div className="flex items-center gap-2 text-[12px] text-[#202124] leading-none">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3B0D3B] text-[10px] font-bold text-white">
                          T
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-medium text-[#202124]">TREQO</span>
                          <span className="text-[11px] text-[#5f6368] truncate max-w-sm">
                            https://treqo.in{activePage.path === "/" ? "" : activePage.path.replace(/\//g, " › ")}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="mt-2 text-[18px] font-normal leading-snug text-[#1a0dab] hover:underline cursor-pointer">
                        {activePage.title || `${activePage.name} | TREQO`}
                      </h4>

                      {/* Meta Description with length handling */}
                      <p className="mt-1 text-[13px] leading-relaxed text-[#4d5156]">
                        {(() => {
                          const desc = activePage.metaDescription || "No meta description set yet. Google will generate a snippet from on-page content.";
                          const limit = previewDevice === "mobile" ? 120 : 158;
                          if (desc.length > limit) {
                            return (
                              <>
                                <span>{desc.substring(0, limit)}</span>
                                <span className="font-bold text-[#3B0D3B]"> ...</span>
                              </>
                            );
                          }
                          return desc;
                        })()}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500">
                      <span>
                        {previewDevice === "desktop"
                          ? "Desktop search preview (~158 chars limit)"
                          : "Mobile search preview (~120 chars limit)"}
                      </span>
                      {(() => {
                        const health = getDescLengthStatus(activePage.metaDescription);
                        return (
                          <span className={`px-2 py-0.5 rounded font-medium border ${health.color}`}>
                            {health.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Primary Meta Description Editor */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Meta Description Content
                      </label>

                      {/* Character Counter Progress Bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-stone-600">
                          {(activePage.metaDescription || "").length} / 160 chars
                        </span>
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-stone-100 border border-stone-200">
                          <div
                            className={`h-full transition-all duration-300 ${
                              (activePage.metaDescription || "").length === 0
                                ? "bg-stone-300 w-0"
                                : (activePage.metaDescription || "").length < 100
                                ? "bg-amber-400"
                                : (activePage.metaDescription || "").length <= 158
                                ? "bg-emerald-500"
                                : "bg-purple-600"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (((activePage.metaDescription || "").length || 0) / 160) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <textarea
                      rows={4}
                      value={activePage.metaDescription || ""}
                      onChange={(e) => updatePageDescription(activePage.id, e.target.value)}
                      placeholder="Write a compelling, benefit-driven description (ideal: 140–158 characters) that invites clicks from search users..."
                      className="w-full rounded-xl border border-stone-300 bg-white p-3.5 text-sm text-stone-900 placeholder-stone-400 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B] focus:outline-none leading-relaxed transition-all shadow-2xs font-normal"
                    />

                    {/* Quick Formula Actions */}
                    <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1 mb-2">
                        <Sparkles className="h-3 w-3 text-[#3B0D3B]" />
                        1-Click Optimization Formulas
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => applyCtaPreset(activePage)}
                          className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-[#3B0D3B] hover:text-[#3B0D3B] transition-colors shadow-2xs"
                        >
                          + Append High-CTR CTA
                        </button>
                        <button
                          type="button"
                          onClick={() => injectKeywords(activePage)}
                          className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-[#3B0D3B] hover:text-[#3B0D3B] transition-colors shadow-2xs"
                        >
                          + Inject Primary Keywords
                        </button>
                        {(activePage.metaDescription || "").length > 158 && (
                          <button
                            type="button"
                            onClick={() => trimToOptimal(activePage)}
                            className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-[#3B0D3B] hover:bg-purple-100 transition-colors shadow-2xs"
                          >
                            ✂ Trim to 155 Characters
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => updatePageDescription(activePage.id, "")}
                          className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-500 hover:text-rose-600 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Page Title & Keywords Association */}
                    <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-stone-600">SEO Page Title</label>
                        <input
                          type="text"
                          value={activePage.title || ""}
                          onChange={(e) => updatePageTitle(activePage.id, e.target.value)}
                          placeholder={`${activePage.name} | TREQO`}
                          className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-800 focus:border-[#3B0D3B] focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-stone-600">
                            Associated Target Keywords ({activePage.metaKeywords?.length || 0})
                          </label>
                          {onSwitchToKeywords && (
                            <button
                              type="button"
                              onClick={onSwitchToKeywords}
                              className="text-[11px] text-[#3B0D3B] hover:underline"
                            >
                              Edit in Keyword Manager →
                            </button>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1.5 rounded-xl border border-stone-100 bg-stone-50">
                          {activePage.metaKeywords && activePage.metaKeywords.length > 0 ? (
                            activePage.metaKeywords.map((kw, i) => (
                              <span
                                key={i}
                                className="rounded-md bg-white border border-stone-200 px-2 py-0.5 text-[10px] text-stone-700 font-medium"
                              >
                                {kw}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">No keywords attached yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-300 p-12 text-center text-stone-500">
                Please select a page from the left sidebar to edit its meta description.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: MATRIX VIEW (All-Pages Table / Rapid Bulk Editor)               */}
      {/* ========================================================================= */}
      {viewMode === "matrix" && (
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50/60 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1A0A1A]">
                All Routes Meta Description Matrix ({filteredPages.length} Pages)
              </h3>
              <p className="text-xs text-stone-500">
                Quickly review and edit meta descriptions for every page inline. Changes are saved when you click "Save All Descriptions".
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Filter category:</span>
              <select
                value={activeCategoryFilter}
                onChange={(e) => setActiveCategoryFilter(e.target.value)}
                className="rounded-xl border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100/70 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-48">Page & Route</th>
                  <th className="py-3 px-4">Meta Description</th>
                  <th className="py-3 px-4 w-36 text-center">Length & Health</th>
                  <th className="py-3 px-4 w-32 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredPages.map((page) => {
                  const health = getDescLengthStatus(page.metaDescription);
                  const len = (page.metaDescription || "").trim().length;

                  return (
                    <tr key={page.id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Page / Route */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-semibold text-stone-900">{page.name}</div>
                        <div className="font-mono text-[10px] text-stone-500 mt-0.5">{page.path}</div>
                        <span className="inline-block mt-1 text-[10px] rounded bg-stone-100 text-stone-600 px-1.5 py-0.5">
                          {page.category || "General"}
                        </span>
                      </td>

                      {/* Inline Description Editor */}
                      <td className="py-3 px-4 align-top">
                        <textarea
                          rows={2}
                          value={page.metaDescription || ""}
                          onChange={(e) => updatePageDescription(page.id, e.target.value)}
                          placeholder="Enter meta description for Google SERP..."
                          className="w-full rounded-lg border border-stone-200 bg-white p-2 text-xs text-stone-800 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B] focus:outline-none transition-all leading-relaxed resize-y"
                        />
                      </td>

                      {/* Length Health */}
                      <td className="py-3 px-4 align-top text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${health.color}`}>
                            {health.label}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">
                            {len} / 160 chars
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 align-top text-right">
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPageId(page.id);
                              setViewMode("studio");
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#3B0D3B] hover:underline"
                          >
                            <Eye className="h-3 w-3" />
                            SERP Studio
                          </button>
                          <button
                            type="button"
                            onClick={() => applyCtaPreset(page)}
                            className="text-[10px] text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-1.5 py-0.5 rounded transition-colors"
                          >
                            + Add CTA
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(page.metaDescription || "", page.id)}
                            className="text-[10px] text-stone-500 hover:text-stone-800 transition-colors"
                          >
                            {copiedId === page.id ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredPages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-stone-500 text-xs">
                      No pages match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>
            Managing descriptions for <strong className="text-stone-900">{pages.length}</strong> pages. Changes are synced with MongoDB & JSON storage.
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleSaveAll()}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#2A092A] active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Saving All Descriptions...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save All Descriptions
            </>
          )}
        </button>
      </div>
    </div>
  );
}
