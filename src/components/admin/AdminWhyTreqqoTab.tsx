"use client";

import { useState, useRef } from "react";
import {
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Upload,
  RefreshCw,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import type { WhyTreqqoContent } from "@/lib/content-db";

interface Props {
  initialData?: WhyTreqqoContent;
  adminPin: string;
  onSaved: (updated: WhyTreqqoContent) => void;
}

const defaultWhyTreqqo: WhyTreqqoContent = {
  eyebrow: "THE CEO CHALLENGE",
  titleLines: ["Every phase ends", "with a problem", "someone actually has."],
  description:
    "You work on brands with real customers to disappoint. Fictional case studies teach confidence about risk you never carried.",
  submissions: [
    {
      tag: "SUBMIT 01",
      title: "The problem",
      description: "One sentence. If it takes three, you haven't found the problem yet.",
    },
    {
      tag: "SUBMIT 02",
      title: "The market logic",
      description: "Why this market behaves the way you claim. Assertion is not logic.",
    },
    {
      tag: "SUBMIT 03",
      title: "The experiment",
      description: "Something small, live and measurable. Report it even when it flopped.",
    },
    {
      tag: "SUBMIT 04",
      title: "The revenue plan",
      description: "Where the money comes from, how much, and by when.",
    },
  ],
  methodCard: {
    tag: "METHOD · 4:5 PORTRAIT",
    title: "STUDENT DEFENDING NUMBERS TO A PANEL",
  },
  banner: {
    title: "Phase 4 is a wall, not a checkpoint.",
    description:
      "Idea clarity is graded pass or rework. No partial credit, no parallel track. Nobody carries a weak idea into execution least of all the students in a hurry.",
  },
};

export default function AdminWhyTreqqoTab({ initialData, adminPin, onSaved }: Props) {
  const [data, setData] = useState<WhyTreqqoContent>(initialData || defaultWhyTreqqo);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  async function handleMethodImageUpload(file: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatusMsg({ type: "error", text: "Please select a valid image file (PNG, JPG, WEBP)." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatusMsg({ type: "error", text: "Image size exceeds 10MB limit." });
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "why-treqo");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": adminPin },
        body: formData,
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        setData((prev) => ({
          ...prev,
          methodCard: {
            ...(prev.methodCard || { tag: "METHOD · 4:5 PORTRAIT", title: "STUDENT DEFENDING NUMBERS TO A PANEL" }),
            image: resData.url,
          },
        }));
        setStatusMsg({ type: "success", text: "4:5 Portrait photo uploaded successfully!" });
      } else {
        setStatusMsg({ type: "error", text: resData.error || "Failed to upload image." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error while uploading image." });
    } finally {
      setIsUploadingImage(false);
      setIsDragActive(false);
    }
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      // First fetch current home content to preserve other sections
      const getRes = await fetch("/api/admin/content", {
        headers: { "x-admin-pin": adminPin },
      });
      const current = await getRes.json();
      const updatedHome = {
        ...(current.homeContent || {}),
        whyTreqqo: data,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({ type: "home", data: updatedHome }),
      });

      if (res.ok) {
        setStatusMsg({ type: "success", text: "Why Treqo section saved successfully to live website!" });
        onSaved(data);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save section. Check permissions." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error saving Why Treqo section." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  }

  function updateSubmission(index: number, field: "tag" | "title" | "description", val: string) {
    const next = [...(data.submissions || defaultWhyTreqqo.submissions)];
    next[index] = { ...next[index], [field]: val };
    setData({ ...data, submissions: next });
  }

  function updateTitleLine(index: number, val: string) {
    const lines = [...(data.titleLines || ["Every phase ends", "with a problem", "someone actually has."])];
    lines[index] = val;
    setData({ ...data, titleLines: lines });
  }

  const eyebrow = data.eyebrow || "THE CEO CHALLENGE";
  const titleLines = data.titleLines && data.titleLines.length > 0
    ? data.titleLines
    : ["Every phase ends", "with a problem", "someone actually has."];
  const submissions = data.submissions && data.submissions.length > 0
    ? data.submissions
    : defaultWhyTreqqo.submissions;
  const methodTag = data.methodCard?.tag || "METHOD · 4:5 PORTRAIT";
  const methodTitle = data.methodCard?.title || "STUDENT DEFENDING NUMBERS TO A PANEL";
  const bannerTitle = data.banner?.title || "Phase 4 is a wall, not a checkpoint.";
  const bannerDesc =
    data.banner?.description ||
    "Idea clarity is graded pass or rework. No partial credit, no parallel track. Nobody carries a weak idea into execution least of all the students in a hurry.";

  return (
    <div className="space-y-6">
      {/* Top Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e111a] p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3B796A]/20 border border-[#3B796A]/30 text-[#ABCAC2] text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="h-3 w-3" />
            <span>Interactive Visual Editor</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Why Treqo (The CEO Challenge)
          </h2>
          <p className="text-xs text-slate-400">
            Edit text directly within the exact blocks as they appear on the live website.
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
            className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-5 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* EXACT FRONTEND SECTION BLOCKS (Directly Editable)         */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#012A22] via-[#09352c] to-[#011d17] p-6 sm:p-10 lg:p-14 text-white shadow-2xl border border-white/10">
        {/* Background ambient lighting matching frontend */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#3B796A]/20 blur-3xl" />
        </div>

        {/* Top Header Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10 lg:items-end">
          {/* Left: Eyebrow + 3-line Headline */}
          <div className="flex flex-col items-start lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Badge:</span>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                placeholder="THE CEO CHALLENGE"
                className="rounded-full bg-[#001712] px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#ABCAC2] shadow-xs focus:ring-2 focus:ring-[#012A22] focus:outline-none"
              />
            </div>

            <div className="w-full space-y-1 pt-1">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">
                Main Headline (3 Lines):
              </span>
              {[0, 1, 2].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  value={titleLines[idx] || ""}
                  onChange={(e) => updateTitleLine(idx, e.target.value)}
                  placeholder={`Line ${idx + 1}...`}
                  className="block w-full bg-transparent text-2xl sm:text-3xl lg:text-[2.75rem] font-black leading-[1.1] tracking-tight text-white border-b border-white/20 focus:border-[#012A22] focus:outline-none transition-colors py-0.5"
                />
              ))}
            </div>
          </div>

          {/* Right: Subtitle description */}
          <div className="lg:col-span-5 space-y-1">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">
              Section Description:
            </span>
            <textarea
              rows={3}
              value={data.description || ""}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="You work on brands with real customers to disappoint..."
              className="w-full rounded-xl border border-white/20 bg-white/5 p-3 text-xs sm:text-sm leading-relaxed text-white placeholder:text-white/50 focus:bg-white/10 focus:border-[#012A22] focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Middle Content: 2x2 Submission Grid + Portrait Placeholder */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6 lg:items-stretch">
          {/* 2x2 Submissions */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
            {submissions.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-5 sm:p-6 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/15 hover:border-white/20 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.tag}
                      onChange={(e) => updateSubmission(idx, "tag", e.target.value)}
                      placeholder="SUBMIT 01"
                      className="rounded-lg bg-[#ABCAC2]/20 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-[#012A22] border border-[#3B796A]/30 focus:outline-none focus:ring-1 focus:ring-[#012A22] w-28"
                    />
                    <span className="text-[10px] font-bold text-white/50">Block #{idx + 1}</span>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateSubmission(idx, "title", e.target.value)}
                    placeholder="e.g. The problem"
                    className="block w-full bg-transparent text-base sm:text-lg font-bold text-white border-b border-white/15 focus:border-[#012A22] focus:outline-none py-0.5 transition-colors"
                  />

                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateSubmission(idx, "description", e.target.value)}
                    placeholder="Describe this submission criteria..."
                    className="mt-1 block w-full bg-transparent text-xs leading-relaxed text-white/80 placeholder:text-white/50 focus:bg-white/60 rounded-lg p-1.5 focus:outline-none resize-none border border-transparent focus:border-white/20"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right: Method 4:5 Portrait Frame */}
          <div className="relative flex flex-col justify-between rounded-2xl border-2 border-white/15 bg-white/5 p-4 lg:col-span-4 backdrop-blur-xs transition-colors hover:border-white/20 min-h-[380px] overflow-hidden group">
            {/* Hidden file input for 4:5 photo */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMethodImageUpload(file);
                e.target.value = "";
              }}
            />

            {/* Header bar inside card */}
            <div className="flex items-center justify-between z-20 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#012A22] bg-white/10 px-2 py-0.5 rounded-md border border-white/15 shadow-xs">
                Method 4:5 Frame
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="p-1 rounded-md bg-white/10 hover:bg-white text-white hover:text-[#012A22] text-[10px] font-bold border border-white/15 shadow-xs transition-all cursor-pointer"
                  title="Toggle URL Input"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </button>
                {data.methodCard?.image && (
                  <button
                    type="button"
                    onClick={() => {
                      setData((prev) => ({
                        ...prev,
                        methodCard: {
                          ...(prev.methodCard || { tag: "METHOD · 4:5 PORTRAIT", title: "" }),
                          image: "",
                        },
                      }));
                    }}
                    className="p-1 rounded-md bg-white/10 hover:bg-red-50 text-slate-500 hover:text-red-600 text-[10px] font-bold border border-white/15 shadow-xs transition-all cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Manual URL Input dropdown if toggled */}
            {showManualUrl && (
              <div className="mb-2 z-20">
                <input
                  type="url"
                  value={data.methodCard?.image || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData((prev) => ({
                      ...prev,
                      methodCard: {
                        ...(prev.methodCard || { tag: "METHOD · 4:5 PORTRAIT", title: "" }),
                        image: val,
                      },
                    }));
                  }}
                  placeholder="Paste image URL (4:5 portrait)..."
                  className="w-full rounded-lg bg-white p-2 text-xs text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#012A22] shadow-xs"
                />
              </div>
            )}

            {/* Image Preview or Dropzone */}
            {data.methodCard?.image ? (
              <div className="relative flex-1 w-full min-h-[300px] rounded-xl overflow-hidden border border-white/20 shadow-inner group/img bg-[#001712]/40 flex flex-col justify-end p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.methodCard.image}
                  alt={methodTitle}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001712]/90 via-[#001712]/25 to-transparent" />

                {/* Floating Replace Button */}
                <div className="absolute top-2.5 right-2.5 z-20">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-[#012A22] text-white border border-white/20 text-[11px] font-bold backdrop-blur-md shadow-md transition-all cursor-pointer"
                  >
                    {isUploadingImage ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    <span>Replace Photo</span>
                  </button>
                </div>

                {/* Overlay Editable Tag & Title inside Image */}
                <div className="relative z-10 space-y-1.5 text-left">
                  <input
                    type="text"
                    value={methodTag}
                    onChange={(e) =>
                      setData({
                        ...data,
                        methodCard: { ...(data.methodCard || {}), tag: e.target.value, title: methodTitle },
                      })
                    }
                    placeholder="METHOD · 4:5 PORTRAIT"
                    className="rounded-md bg-white/25 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white border border-white/25 focus:outline-none focus:bg-white/5 max-w-full"
                  />
                  <input
                    type="text"
                    value={methodTitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        methodCard: { ...(data.methodCard || {}), title: e.target.value, tag: methodTag },
                      })
                    }
                    placeholder="STUDENT DEFENDING NUMBERS TO A PANEL"
                    className="block w-full bg-transparent text-xs sm:text-sm font-black uppercase tracking-wider text-white leading-tight focus:outline-none border-b border-white/30 focus:border-white py-0.5"
                  />
                </div>
              </div>
            ) : (
              /* Drag & Drop Upload Zone when no image */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragActive(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleMethodImageUpload(file);
                }}
                onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                className={`flex-1 w-full min-h-[300px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all cursor-pointer space-y-3 ${
                  isDragActive
                    ? "border-[#012A22] bg-[#012A22]/15 scale-[1.01] shadow-lg shadow-[#012A22]/20"
                    : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
                }`}
              >
                {isUploadingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-6 w-6 text-[#012A22] animate-spin" />
                    <span className="text-xs font-bold text-white">Uploading 4:5 Photo...</span>
                  </div>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-2xl bg-[#012A22]/10 border border-[#012A22]/25 flex items-center justify-center text-[#012A22] group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-wide">
                        Upload 4:5 Ratio Image
                      </p>
                      <p className="text-[11px] text-white/70 mt-0.5">
                        Click or drag &amp; drop portrait photo
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ABCAC2]/20 border border-[#3B796A]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#012A22]">
                      <ImageIcon className="h-3 w-3" />
                      <span>4:5 Portrait Ratio · Max 10MB</span>
                    </div>
                  </>
                )}

                {/* Editable tags even before image upload */}
                <div className="w-full pt-3 border-t border-white/10 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={methodTag}
                    onChange={(e) =>
                      setData({
                        ...data,
                        methodCard: { ...(data.methodCard || {}), tag: e.target.value, title: methodTitle },
                      })
                    }
                    placeholder="METHOD · 4:5 PORTRAIT"
                    className="w-full rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#012A22] border border-white/15 text-center focus:outline-none focus:ring-1 focus:ring-[#012A22]"
                  />
                  <input
                    type="text"
                    value={methodTitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        methodCard: { ...(data.methodCard || {}), title: e.target.value, tag: methodTag },
                      })
                    }
                    placeholder="STUDENT DEFENDING NUMBERS TO A PANEL"
                    className="w-full rounded-md bg-white/70 px-2 py-1 text-center text-[11px] font-black uppercase tracking-wider text-white/80 border border-white/15 focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/5 p-5 sm:p-7 backdrop-blur-xs shadow-xs">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 lg:items-center">
            <div className="lg:col-span-5 space-y-1">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">
                Banner Headline:
              </span>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) =>
                  setData({
                    ...data,
                    banner: { ...data.banner, title: e.target.value, description: bannerDesc },
                  })
                }
                placeholder="Phase 4 is a wall, not a checkpoint."
                className="w-full bg-transparent text-lg sm:text-xl font-black leading-tight text-white border-b border-white/20 focus:border-[#012A22] focus:outline-none py-1 transition-colors"
              />
            </div>
            <div className="lg:col-span-7 space-y-1">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">
                Banner Subtitle:
              </span>
              <textarea
                rows={2}
                value={bannerDesc}
                onChange={(e) =>
                  setData({
                    ...data,
                    banner: { ...data.banner, description: e.target.value, title: bannerTitle },
                  })
                }
                placeholder="Idea clarity is graded pass or rework..."
                className="w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-xs sm:text-sm leading-relaxed text-white placeholder:text-white/50 focus:bg-white/10 focus:border-[#012A22] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action inside the live block */}
        <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-5">
          <span className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-[#012A22]" />
            <span>This preview mirrors your live website layout in real-time</span>
          </span>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#001712] hover:bg-[#200c4d] px-6 py-2.5 text-xs font-bold text-[#ABCAC2] shadow-md cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Why Treqo Section"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
