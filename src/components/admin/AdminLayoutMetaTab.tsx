"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Search,
  Globe,
  Tag,
  Share2,
  Shield,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Info,
  Layers,
  FileCode,
} from "lucide-react";
import type { LayoutSettings } from "@/lib/content-db";

interface Props {
  initialData?: LayoutSettings;
  adminPin: string;
  onSaved: (updated: LayoutSettings) => void;
}

const defaultLayoutSettings: LayoutSettings = {
  siteTitle: "TREQO",
  titleTemplate: "%s | TREQO",
  metaDescription:
    "TREQO is a digital marketing learning system built around 70% doing, live brand projects, and capstone revenue proof.",
  metaKeywords: [
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
  ],
  authorName: "Treqo School of Modern Learning",
  canonicalUrl: "https://treqo.org",
  ogTitle: "TREQO: LEARN THE SKILLS. BUILD THE MINDSET. BREAK THE PATTERN.",
  ogDescription:
    "Four months. 12 phases. A real client at every stage. You finish holding campaigns you ran, numbers you own, and answers that hold up in an interview.",
  ogImage: "/images/og-treqo.png",
  twitterTitle: "TREQO: The Marketing School",
  twitterDescription: "LEARN THE SKILLS. BUILD THE MINDSET. BREAK THE PATTERN.",
  twitterCard: "summary_large_image",
  robotsIndex: true,
  robotsFollow: true,
  googleSiteVerification: "",
};

const SUGGESTED_KEYWORDS = [
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
  "SEO Training Hyderabad",
  "PMax Ads Campaign",
  "Live Ad Campaigns",
  "Agency Capstone",
  "AI in Marketing",
  "CEO Challenge",
  "Digital Marketing Institute",
  "Hands-on Marketing Training",
];

export default function AdminLayoutMetaTab({ initialData, adminPin, onSaved }: Props) {
  const [settings, setSettings] = useState<LayoutSettings>(initialData || defaultLayoutSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setSettings(initialData);
    }
  }, [initialData]);

  // Keyword input state
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [showRawKeywords, setShowRawKeywords] = useState(false);
  const [rawKeywordsText, setRawKeywordsText] = useState(() =>
    (initialData?.metaKeywords || defaultLayoutSettings.metaKeywords).join(", ")
  );

  // Live preview mode
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  function handleAddKeyword(keywordToAdd?: string) {
    const term = (keywordToAdd !== undefined ? keywordToAdd : newKeywordInput).trim();
    if (!term) return;

    if (!settings.metaKeywords.includes(term)) {
      const updated = [...settings.metaKeywords, term];
      setSettings({ ...settings, metaKeywords: updated });
      setRawKeywordsText(updated.join(", "));
    }
    if (keywordToAdd === undefined) {
      setNewKeywordInput("");
    }
  }

  function handleRemoveKeyword(indexToRemove: number) {
    const updated = settings.metaKeywords.filter((_, idx) => idx !== indexToRemove);
    setSettings({ ...settings, metaKeywords: updated });
    setRawKeywordsText(updated.join(", "));
  }

  function handleRawKeywordsChange(text: string) {
    setRawKeywordsText(text);
    const parsed = text
      .split(/[,;\n]+/)
      .map((k) => k.trim())
      .filter(Boolean);
    // Remove duplicates while preserving order
    const unique = Array.from(new Set(parsed));
    setSettings({ ...settings, metaKeywords: unique });
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({ type: "layout", data: settings }),
      });

      if (res.ok) {
        setStatusMsg({
          type: "success",
          text: "Layout metadata and SEO settings saved successfully to live website!",
        });
        onSaved(settings);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save layout settings." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error while saving layout settings." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  }

  const titleLength = settings.siteTitle?.length || 0;
  const descLength = settings.metaDescription?.length || 0;

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Globe className="h-3 w-3" />
            <span>SEO &amp; Layout Metadata</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Layout &amp; Meta Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Adjust and manage site-wide meta title, meta description, and keywords for search engines and social link previews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusMsg && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                statusMsg.type === "success"
                  ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                  : "bg-red-950/80 border border-red-500/40 text-red-300"
              }`}
            >
              {statusMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-98 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================= */}
        {/* CARD 1: GOOGLE SEARCH SERP LIVE PREVIEW                  */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#3B0D3B]" />
              <h3 className="text-sm font-bold text-[#0B0B0F]">Google Search Result (SERP) Live Preview</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FAF5EE] rounded-lg p-1 border border-[#3B0D3B]/10 text-[11px]">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  previewDevice === "desktop" ? "bg-white text-[#3B0D3B] shadow-2xs" : "text-[#5A4A5A] hover:text-[#0B0B0F]"
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  previewDevice === "mobile" ? "bg-white text-[#3B0D3B] shadow-2xs" : "text-[#5A4A5A] hover:text-[#0B0B0F]"
                }`}
              >
                Mobile
              </button>
            </div>
          </div>

          <div
            className={`rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/60 p-4 sm:p-5 transition-all ${
              previewDevice === "mobile" ? "max-w-md mx-auto" : "w-full"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-6 w-6 rounded-full bg-[#3B0D3B] flex items-center justify-center text-white text-[10px] font-black shrink-0">
                T
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-medium text-[#202124] leading-tight">
                  {settings.siteTitle || "TREQO"}
                </span>
                <span className="text-[11px] text-[#5f6368] truncate leading-tight">
                  {settings.canonicalUrl || "https://treqo.org"}
                </span>
              </div>
            </div>

            {/* Google Blue Title Link */}
            <h4 className="text-[17px] sm:text-[19px] font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1">
              {settings.siteTitle || "TREQO"} — {settings.titleTemplate?.replace("%s | ", "") || "Digital Marketing School"}
            </h4>

            {/* Google Snippet Description */}
            <p className="mt-1 text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
              {settings.metaDescription || "No meta description set yet."}
            </p>
          </div>

          {/* Character counter feedback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-[#FAF5EE] border border-[#3B0D3B]/10">
              <span className="text-[#5A4A5A]">Title Length:</span>
              <span
                className={`font-mono font-bold ${
                  titleLength > 60 ? "text-amber-600" : titleLength > 30 ? "text-[#0CA30C]" : "text-[#5A4A5A]"
                }`}
              >
                {titleLength} / 60 chars {titleLength > 60 && "· may truncate"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-[#FAF5EE] border border-[#3B0D3B]/10">
              <span className="text-[#5A4A5A]">Description Length:</span>
              <span
                className={`font-mono font-bold ${
                  descLength > 160 ? "text-amber-600" : descLength > 120 ? "text-[#0CA30C]" : "text-[#5A4A5A]"
                }`}
              >
                {descLength} / 160 chars {descLength > 160 && "· may truncate"}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 2: TITLE & DESCRIPTION FIELDS                       */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#3B0D3B]" />
            <h3 className="text-sm font-bold text-[#0B0B0F]">Title &amp; Meta Description</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0B0B0F]">
                  Site Meta Title (Default) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-[#8C6A8C] font-mono">{titleLength}/60</span>
              </div>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                placeholder="e.g. TREQO"
                className="w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] font-medium"
              />
              <p className="mt-1 text-[11px] text-[#5A4A5A]">
                The primary title shown on the browser tab, Google search results, and bookmarks.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0B0B0F]">Subpage Title Template</label>
              </div>
              <input
                type="text"
                value={settings.titleTemplate || "%s | TREQO"}
                onChange={(e) => setSettings({ ...settings, titleTemplate: e.target.value })}
                placeholder="%s | TREQO"
                className="w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] font-medium"
              />
              <p className="mt-1 text-[11px] text-[#5A4A5A]">
                <code className="bg-[#FAF5EE] px-1 py-0.5 rounded text-[#3B0D3B] font-bold">%s</code> represents the subpage title (e.g. &ldquo;Digital Marketing Course | TREQO&rdquo;).
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0B0B0F]">
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-[#8C6A8C] font-mono">{descLength}/160</span>
              </div>
              <textarea
                rows={3}
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                placeholder="Enter a compelling summary of Treqo for search engines..."
                className="w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] leading-relaxed font-medium"
              />
              <p className="mt-1 text-[11px] text-[#5A4A5A]">
                Displayed under the title in Google and social link shares. Recommended 120-160 characters.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Author / Publisher Name</label>
              <input
                type="text"
                value={settings.authorName || ""}
                onChange={(e) => setSettings({ ...settings, authorName: e.target.value })}
                placeholder="e.g. Treqo School of Modern Learning"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] font-medium"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 3: META KEYWORDS MANAGER                            */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#3B0D3B]" />
              <h3 className="text-sm font-bold text-[#0B0B0F]">Meta Keywords Manager</h3>
              <span className="ml-1.5 rounded-md bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 text-[#3B0D3B] px-2 py-0.5 text-[10px] font-bold">
                {settings.metaKeywords.length} tags
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowRawKeywords(!showRawKeywords)}
              className="text-xs text-[#5A4A5A] hover:text-[#3B0D3B] flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>{showRawKeywords ? "Switch to Tag View" : "Bulk Comma Editor"}</span>
            </button>
          </div>

          <p className="text-xs text-[#5A4A5A]">
            Keywords inform search crawlers, directories, and indexing robots about your core subjects and specializations.
          </p>

          {/* Add New Keyword Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="Type a new keyword and press Enter (e.g. Growth Hacking)..."
                className="w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] font-medium"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddKeyword()}
              className="flex items-center gap-1.5 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] text-white px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 active:scale-98 shadow-2xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Bulk Raw Text Editor View */}
          {showRawKeywords ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0B0B0F]">
                  Raw Comma-Separated Keywords
                </label>
                <span className="text-[11px] text-[#8C6A8C]">Separate keywords with commas</span>
              </div>
              <textarea
                rows={4}
                value={rawKeywordsText}
                onChange={(e) => handleRawKeywordsChange(e.target.value)}
                placeholder="Digital Marketing Course, Performance Marketing, Growth Marketing, Treqo..."
                className="w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-xs sm:text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none font-mono leading-relaxed"
              />
            </div>
          ) : (
            /* Visual Interactive Tag Pills */
            <div className="flex flex-wrap gap-2 p-3.5 rounded-xl border border-[#3B0D3B]/10 bg-[#FAF5EE] min-h-[70px]">
              {settings.metaKeywords.length > 0 ? (
                settings.metaKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#3B0D3B]/15 text-[#3B0D3B] px-2.5 py-1 text-xs font-semibold shadow-2xs"
                  >
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(idx)}
                      className="p-0.5 text-[#8C6A8C] hover:text-red-600 rounded transition-colors cursor-pointer"
                      title="Remove keyword"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#8C6A8C] italic flex items-center">
                  No keywords added yet. Add one above or pick from suggestions below.
                </span>
              )}
            </div>
          )}

          {/* 1-Click Suggestions Chips */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8C6A8C] uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Recommended Quick Suggestions</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_KEYWORDS.map((sug) => {
                const isAlreadyAdded = settings.metaKeywords.includes(sug);
                return (
                  <button
                    key={sug}
                    type="button"
                    disabled={isAlreadyAdded}
                    onClick={() => handleAddKeyword(sug)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isAlreadyAdded
                        ? "bg-[#F5EDE0] text-[#8C6A8C] border border-[#3B0D3B]/10 cursor-default"
                        : "bg-white border border-[#3B0D3B]/15 text-[#5A4A5A] hover:border-[#3B0D3B]/30 hover:text-[#3B0D3B] hover:bg-[#FAF5EE]"
                    }`}
                  >
                    <Plus className="h-3 w-3" />
                    <span>{sug}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 4: SOCIAL MEDIA PREVIEWS (OPEN GRAPH & TWITTER)     */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-[#3B0D3B]" />
            <h3 className="text-sm font-bold text-[#0B0B0F]">Social Sharing Cards (Open Graph &amp; Twitter)</h3>
          </div>
          <p className="text-xs text-[#5A4A5A]">
            Control how Treqo links look when shared on WhatsApp, LinkedIn, X/Twitter, Slack, and Facebook.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Open Graph Title (og:title)</label>
              <input
                type="text"
                value={settings.ogTitle || ""}
                onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                placeholder="Defaults to Site Title if left blank"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Twitter Card Title</label>
              <input
                type="text"
                value={settings.twitterTitle || ""}
                onChange={(e) => setSettings({ ...settings, twitterTitle: e.target.value })}
                placeholder="Defaults to OG Title if left blank"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#0B0B0F]">Social Share Image URL (og:image)</label>
              <input
                type="text"
                value={settings.ogImage || ""}
                onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                placeholder="/icon.svg or https://treqo.org/images/og-share.jpg"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] font-medium"
              />
              <p className="mt-1 text-[11px] text-[#5A4A5A]">
                Recommended 1200x630px high-resolution image for best rich card presentation.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#0B0B0F]">Open Graph Description (og:description)</label>
              <textarea
                rows={2}
                value={settings.ogDescription || ""}
                onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                placeholder="Defaults to Meta Description if left blank"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Twitter Card Type</label>
              <select
                value={settings.twitterCard || "summary_large_image"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    twitterCard: e.target.value as "summary" | "summary_large_image",
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none font-medium cursor-pointer"
              >
                <option value="summary_large_image">Large Image Card (summary_large_image)</option>
                <option value="summary">Small Icon Card (summary)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Canonical Site Base URL</label>
              <input
                type="text"
                value={settings.canonicalUrl || ""}
                onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })}
                placeholder="https://treqo.org"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] font-medium"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 5: SEARCH ENGINE CRAWLING & ROBOTS                   */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#0CA30C]" />
            <h3 className="text-sm font-bold text-[#0B0B0F]">Search Engine Crawlers &amp; Verification</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#3B0D3B]/10 bg-[#FAF5EE]">
              <div>
                <p className="text-xs font-bold text-[#0B0B0F]">Index Website (robots index)</p>
                <p className="text-[11px] text-[#5A4A5A]">Allow search engines to index your pages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.robotsIndex !== false}
                  onChange={(e) => setSettings({ ...settings, robotsIndex: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E2D8CC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CA30C]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-[#3B0D3B]/10 bg-[#FAF5EE]">
              <div>
                <p className="text-xs font-bold text-[#0B0B0F]">Follow Links (robots follow)</p>
                <p className="text-[11px] text-[#5A4A5A]">Allow crawlers to follow internal page links</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.robotsFollow !== false}
                  onChange={(e) => setSettings({ ...settings, robotsFollow: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E2D8CC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CA30C]"></div>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#0B0B0F]">
                Google Search Console Verification Code (Optional)
              </label>
              <input
                type="text"
                value={settings.googleSiteVerification || ""}
                onChange={(e) => setSettings({ ...settings, googleSiteVerification: e.target.value })}
                placeholder="e.g. your-google-site-verification-hash"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none placeholder:text-[#8C6A8C] font-medium"
              />
              <p className="mt-1 text-[11px] text-[#5A4A5A]">
                Found in Google Search Console under HTML Tag verification.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {statusMsg && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                statusMsg.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {statusMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] text-white px-6 py-3 text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-98 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Layout & Meta Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
