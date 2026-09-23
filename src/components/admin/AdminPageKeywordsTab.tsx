"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Globe,
  Tag,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  Filter,
  RefreshCw,
  Sliders,
  FileText,
} from "lucide-react";
import type { PageSeoItem } from "@/lib/content-db";

interface Props {
  initialPages?: PageSeoItem[];
  adminPin: string;
  onSaved?: (updatedPages: PageSeoItem[]) => void;
  onSwitchToDescriptions?: () => void;
}

const NEW_AGE_ONLINE_37_KEYWORDS = [
  "digital marketing classes near me",
  "search engine optimization in digital marketing",
  "digital marketing institute near me",
  "digital marketing certificate programs",
  "marketing courses online with certificate",
  "digital marketing online certification course",
  "advanced digital marketing course",
  "digital marketing course with placement",
  "best online digital marketing courses in india",
  "digital marketing classes online",
  "study digital marketing online",
  "best digital marketing courses",
  "best online marketing courses",
  "good digital marketing courses",
  "top digital marketing courses",
  "digital marketing certification course",
  "certificate in digital marketing course",
  "marketing strategy course",
  "professional certificate in digital marketing",
  "digital marketing course online",
  "marketing courses online",
  "online marketing classes",
  "marketing digital course online",
  "online marketing online course",
  "fundamentals of digital marketing",
  "learn digital marketing",
  "digital marketing course online india",
  "best online digital marketing courses",
  "learn digital marketing online",
  "digital marketing courses",
  "digital marketing classes",
  "digital marketing training courses",
  "diploma in digital marketing",
  "ai in marketing course",
  "digital marketing for students",
  "accredited digital marketing courses",
  "best online courses for marketing professionals",
];

const HOME_PAGE_10_KEYWORDS = [
  "digital marketing course near me",
  "digital marketing courses in Hyderabad",
  "Online marketing classes",
  "Best Digital marketing course in Hyderabad",
  "Digital marketing course fee",
  "online digital marketing course with certificate",
  "learn digital marketing online",
  "new age digital marketing course",
  "performance marketing course",
  "digital marketing course with placement",
];

const CORE_MARKETING_12_KEYWORDS = [
  "performance marketing course",
  "full stack digital marketing",
  "growth marketing certification",
  "meta ads course",
  "google ads pmax training",
  "marketing funnel architecture",
  "direct response marketing",
  "cac ltv optimization",
  "conversion rate optimization",
  "ga4 web analytics certification",
  "marketing strategy bootcamp",
  "digital marketing portfolio training",
];

export default function AdminPageKeywordsTab({
  initialPages = [],
  adminPin,
  onSaved,
  onSwitchToDescriptions,
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

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal to add a new custom page route
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [newPageForm, setNewPageForm] = useState({
    id: "",
    name: "",
    path: "",
    category: "Courses",
    title: "",
    metaDescription: "",
    keywordsString: "",
  });

  const activePage = pages.find((p) => p.id === selectedPageId) || pages[0];

  const categories = ["All", ...Array.from(new Set(pages.map((p) => p.category || "General")))];

  const filteredPages = pages.filter((p) => {
    const matchesCategory =
      activeCategoryFilter === "All" || (p.category || "General") === activeCategoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.metaKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Save all page-wise keyword settings
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
        setStatusMsg({
          type: "success",
          text: "All page-wise SEO meta keywords saved successfully!",
        });
        if (onSaved) onSaved(dataToSave);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save page keywords." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error while saving." });
    } finally {
      setIsSaving(false);
    }
  }

  // Update field of active page
  function updateActivePage(patch: Partial<PageSeoItem>) {
    if (!activePage) return;
    const updated = pages.map((p) => (p.id === activePage.id ? { ...p, ...patch } : p));
    setPages(updated);
  }

  // Keyword operations on active page
  function addKeywordToActive(term: string) {
    const cleaned = term.trim();
    if (!cleaned || !activePage) return;
    const current = Array.isArray(activePage.metaKeywords) ? activePage.metaKeywords : [];
    if (!current.some((k) => k.toLowerCase() === cleaned.toLowerCase())) {
      updateActivePage({ metaKeywords: [...current, cleaned] });
    }
    setNewKeywordInput("");
  }

  function removeKeywordFromActive(index: number) {
    if (!activePage) return;
    const current = Array.isArray(activePage.metaKeywords) ? activePage.metaKeywords : [];
    updateActivePage({ metaKeywords: current.filter((_, i) => i !== index) });
  }

  function bulkImportKeywords(text: string) {
    if (!text.trim() || !activePage) return;
    const terms = text
      .split(/[,;\n]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const current = Array.isArray(activePage.metaKeywords) ? [...activePage.metaKeywords] : [];
    terms.forEach((term) => {
      if (!current.some((k) => k.toLowerCase() === term.toLowerCase())) {
        current.push(term);
      }
    });
    updateActivePage({ metaKeywords: current });
    setBulkInput("");
    setStatusMsg({
      type: "success",
      text: `Added ${terms.length} keywords to "${activePage.name}". Remember to click "Save All Changes".`,
    });
  }

  function applyPresetToActive(keywords: string[], presetName: string) {
    if (!activePage) return;
    updateActivePage({ metaKeywords: [...keywords] });
    setStatusMsg({
      type: "success",
      text: `Applied ${keywords.length} keywords (${presetName}) to "${activePage.name}".`,
    });
  }

  function clearActiveKeywords() {
    if (!activePage) return;
    updateActivePage({ metaKeywords: [] });
  }

  // Add new custom page route
  function handleAddNewPage(e: React.FormEvent) {
    e.preventDefault();
    if (!newPageForm.name.trim() || !newPageForm.path.trim()) return;

    const id =
      newPageForm.id.trim() ||
      newPageForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const initialKw = newPageForm.keywordsString
      .split(/[,;\n]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const newPage: PageSeoItem = {
      id,
      name: newPageForm.name.trim(),
      path: newPageForm.path.trim().startsWith("/") ? newPageForm.path.trim() : `/${newPageForm.path.trim()}`,
      category: newPageForm.category.trim() || "Custom",
      title: newPageForm.title.trim() || `${newPageForm.name.trim()} | TREQO`,
      metaDescription: newPageForm.metaDescription.trim(),
      metaKeywords: initialKw,
    };

    const updated = [...pages, newPage];
    setPages(updated);
    setSelectedPageId(newPage.id);
    setIsAddPageModalOpen(false);
    setNewPageForm({
      id: "",
      name: "",
      path: "",
      category: "Courses",
      title: "",
      metaDescription: "",
      keywordsString: "",
    });
    setStatusMsg({
      type: "success",
      text: `Added new page route "${newPage.name}" (${newPage.path}). Click "Save All Changes" to persist.`,
    });
  }

  function handleDeletePage(id: string) {
    if (!confirm("Are you sure you want to remove this page route from the SEO manager?")) return;
    const updated = pages.filter((p) => p.id !== id);
    setPages(updated);
    if (selectedPageId === id && updated.length > 0) {
      setSelectedPageId(updated[0].id);
    }
    setStatusMsg({ type: "success", text: "Page route removed. Click 'Save All Changes' to apply." });
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3B0D3B]/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B0D3B] text-white shadow-xs">
              <Search className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">
                Page-Wise SEO &amp; Keyword Manager
              </h2>
              <p className="text-xs sm:text-sm text-[#5A4A5A]">
                Target high-intent search queries and manage dedicated meta keywords route-by-route.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {onSwitchToDescriptions && (
            <button
              type="button"
              onClick={onSwitchToDescriptions}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#3B0D3B]/20 bg-white hover:bg-[#FAF5EE] px-3.5 py-2.5 text-xs font-bold text-[#3B0D3B] shadow-2xs transition-all cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>Switch to Meta Descriptions</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddPageModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 px-3.5 py-2.5 text-xs font-bold text-stone-700 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Route</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isSaving ? "Saving..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* Status Notification */}
      {statusMsg && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 text-xs font-semibold ${
            statusMsg.type === "success"
              ? "bg-emerald-950/80 border border-emerald-500/30 text-emerald-200"
              : "bg-red-950/80 border border-red-500/30 text-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="text-xs opacity-75 hover:opacity-100 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Page Routes Directory (5 cols) */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4">
          <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-5 shadow-xs space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by page name, path, or tag..."
                className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white pl-9 pr-3.5 py-2 text-xs text-[#0B0B0F] placeholder-slate-400 focus:border-[#3B0D3B] focus:outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    activeCategoryFilter === cat
                      ? "bg-[#3B0D3B] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Pages List */}
            <div className="space-y-2 pt-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredPages.map((page) => {
                const isSelected = page.id === selectedPageId;
                const kwCount = Array.isArray(page.metaKeywords) ? page.metaKeywords.length : 0;

                return (
                  <div
                    key={page.id}
                    onClick={() => setSelectedPageId(page.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-[#3B0D3B]/5 border-[#3B0D3B] shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#0B0B0F] truncate group-hover:text-[#3B0D3B]">
                          {page.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#5A4A5A] font-mono truncate">
                          <Globe className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate">{page.path}</span>
                        </div>
                      </div>

                      {/* Keywords count badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                          kwCount > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Tag className="h-2.5 w-2.5" />
                        <span>{kwCount}</span>
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {page.category || "General"}
                      </span>
                      {isSelected ? (
                        <span className="font-bold text-[#3B0D3B] flex items-center gap-1">
                          <span>Editing</span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </span>
                      ) : (
                        <span className="text-slate-400 group-hover:text-slate-600">Click to edit</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredPages.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 rounded-2xl border border-dashed border-slate-200">
                  No matching page routes found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Page Keyword Editor (8 cols) */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">
          {activePage ? (
            <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              {/* Active Page Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3B0D3B]/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#3B0D3B]/10 text-[#3B0D3B] text-[11px] font-bold uppercase tracking-wider">
                      {activePage.category || "General Page"}
                    </span>
                    <h3 className="text-xl font-black text-[#0B0B0F]">{activePage.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs font-mono text-[#3B0D3B] bg-[#3B0D3B]/5 px-2 py-0.5 rounded-md">
                      {activePage.path}
                    </code>
                    <Link
                      href={activePage.path}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-[#3B0D3B] hover:text-[#2A082A] font-bold"
                    >
                      <span>Preview Live Page</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Right action button */}
                <div className="flex items-center gap-2">
                  {/* Delete button if custom route */}
                  {!["home", "digital-marketing", "4m-program", "fundamentals", "pgdm"].includes(activePage.id) && (
                    <button
                      type="button"
                      onClick={() => handleDeletePage(activePage.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Route</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSaveAll()}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save This Page</span>
                  </button>
                </div>
              </div>

              {/* Real-Time Google SERP Snippet Preview */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-1.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Google Search Engine Result Snippet Preview
                </span>
                <div className="text-xs text-emerald-800 flex items-center gap-1.5 font-mono">
                  <Globe className="h-3 w-3 text-emerald-700" />
                  <span>https://treqo.org{activePage.path === "/" ? "" : activePage.path}</span>
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-blue-800 hover:underline cursor-pointer">
                  {activePage.title || `${activePage.name} | TREQO`}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {activePage.metaDescription ||
                    "Explore TREQO's live marketing programs, practitioner mentors, and verifiable capstone projects."}
                </p>
              </div>

              {/* Title and Meta Description Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0B0B0F] block mb-1">
                    Page SEO Title (Title Tag)
                  </label>
                  <input
                    type="text"
                    value={activePage.title || ""}
                    onChange={(e) => updateActivePage({ title: e.target.value })}
                    placeholder={`${activePage.name} | TREQO`}
                    className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B0B0F] block mb-1">
                    Page Meta Description
                  </label>
                  <input
                    type="text"
                    value={activePage.metaDescription || ""}
                    onChange={(e) => updateActivePage({ metaDescription: e.target.value })}
                    placeholder="Brief description for Google search results (150-160 chars)..."
                    className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                  />
                </div>
              </div>

              {/* KEYWORD TAGS CLOUD */}
              <div className="space-y-3 pt-2 border-t border-[#3B0D3B]/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[#0B0B0F]">
                      Targeted Meta Keywords for {activePage.name}
                    </label>
                    <span className="px-2 py-0.5 rounded-full bg-[#3B0D3B]/10 text-[11px] font-black text-[#3B0D3B]">
                      {Array.isArray(activePage.metaKeywords) ? activePage.metaKeywords.length : 0} keywords
                    </span>
                  </div>

                  {Array.isArray(activePage.metaKeywords) && activePage.metaKeywords.length > 0 && (
                    <button
                      type="button"
                      onClick={clearActiveKeywords}
                      className="text-xs font-bold text-red-600 hover:text-red-800 cursor-pointer transition-colors"
                    >
                      Clear All Keywords
                    </button>
                  )}
                </div>

                {/* Add Keyword Input Bar */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addKeywordToActive(newKeywordInput);
                      }
                    }}
                    placeholder={`e.g. ${activePage.id === "home" ? "digital marketing course near me" : "best digital marketing course"}`}
                    className="flex-1 rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-xs text-[#0B0B0F] placeholder-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addKeywordToActive(newKeywordInput)}
                    className="rounded-xl bg-[#3B0D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2A082A] transition-colors cursor-pointer"
                  >
                    Add Keyword
                  </button>
                </div>

                {/* Keyword Chips List */}
                {Array.isArray(activePage.metaKeywords) && activePage.metaKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-h-64 overflow-y-auto">
                    {activePage.metaKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#3B0D3B]/15 px-2.5 py-1 text-xs font-medium text-[#0B0B0F] shadow-2xs group hover:border-[#3B0D3B]/40 transition-all"
                      >
                        <Tag className="h-3 w-3 text-[#3B0D3B]/50" />
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => removeKeywordFromActive(idx)}
                          className="h-3.5 w-3.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-600 inline-flex items-center justify-center cursor-pointer transition-colors"
                          title="Remove keyword"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                    No keywords targeted for this page yet. Use the input bar above, bulk importer, or quick presets below.
                  </div>
                )}
              </div>

              {/* Bulk Importer */}
              <div className="space-y-2 pt-2 border-t border-[#3B0D3B]/10">
                <label className="text-xs font-bold text-[#0B0B0F] block">
                  Bulk Keyword Importer (Paste comma or line-separated keywords)
                </label>
                <textarea
                  rows={4}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Paste multiple keywords separated by commas or line breaks..."
                  className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3.5 text-xs text-[#0B0B0F] placeholder-slate-400 focus:border-[#3B0D3B] focus:outline-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => bulkImportKeywords(bulkInput)}
                  disabled={!bulkInput.trim()}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Import Keywords
                </button>
              </div>

              {/* Quick Presets Bar */}
              <div className="space-y-2 pt-3 border-t border-[#3B0D3B]/10">
                <span className="text-xs font-bold text-[#0B0B0F] block">One-Click Keyword Presets</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPresetToActive(NEW_AGE_ONLINE_37_KEYWORDS, "New Age Online 37 Keywords")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3B0D3B]/20 bg-[#3B0D3B]/5 hover:bg-[#3B0D3B]/10 text-xs font-bold text-[#3B0D3B] cursor-pointer transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Apply New Age Online (37 Keywords)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPresetToActive(HOME_PAGE_10_KEYWORDS, "Home Page / Hyderabad 10 Keywords")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer transition-colors"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    <span>Apply Home / Hyderabad Local (10 Keywords)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPresetToActive(CORE_MARKETING_12_KEYWORDS, "Core Marketing Tracks (12 Keywords)")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer transition-colors"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Apply Growth & Performance (12 Keywords)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl border border-slate-200 bg-white text-slate-500">
              Select a page route from the directory to edit its meta keywords.
            </div>
          )}
        </div>
      </div>

      {/* 3. Modal: Add New Custom Page Route */}
      {isAddPageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#0B0B0F]">Add Custom Page Route</h3>
                <p className="text-xs text-[#5A4A5A]">
                  Register an existing or new URL route to target specific keywords.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPageModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddNewPage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Page Name *</label>
                <input
                  type="text"
                  required
                  value={newPageForm.name}
                  onChange={(e) => setNewPageForm({ ...newPageForm, name: e.target.value })}
                  placeholder="e.g. About Treqo or Brand Strategy Workshop"
                  className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Route URL Path *</label>
                <input
                  type="text"
                  required
                  value={newPageForm.path}
                  onChange={(e) => setNewPageForm({ ...newPageForm, path: e.target.value })}
                  placeholder="/about or /categories/brand-strategy"
                  className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2.5 text-xs text-[#0B0B0F] font-mono focus:border-[#3B0D3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Category Group</label>
                <select
                  value={newPageForm.category}
                  onChange={(e) => setNewPageForm({ ...newPageForm, category: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none cursor-pointer"
                >
                  <option value="Courses">Courses &amp; Tracks</option>
                  <option value="Core">Core &amp; Landing</option>
                  <option value="Editorial">Editorial &amp; Articles</option>
                  <option value="Legal">Legal &amp; Policies</option>
                  <option value="Custom">Custom Routes</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Initial Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={newPageForm.keywordsString}
                  onChange={(e) => setNewPageForm({ ...newPageForm, keywordsString: e.target.value })}
                  placeholder="keyword 1, keyword 2, keyword 3..."
                  className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPageModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] text-xs font-bold text-white shadow-md cursor-pointer transition-colors"
                >
                  Register Page Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
