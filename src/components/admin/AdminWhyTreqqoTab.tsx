"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
} from "lucide-react";
import type { WhyTreqqoContent } from "@/lib/content-db";
import { cn } from "@/lib/utils";

interface SubmissionItem {
  tag: string;
  title: string;
  description: string;
  rule?: string;
}

interface Props {
  initialData?: WhyTreqqoContent;
  adminPin: string;
  onSaved: (updated: WhyTreqqoContent) => void;
}

const defaultSubmissions: SubmissionItem[] = [
  {
    tag: "01",
    title: "The problem",
    description: "One sentence. If it takes three, you haven't found the problem yet.",
    rule: "Criterion: Exactly 1 sentence",
  },
  {
    tag: "02",
    title: "The market logic",
    description: "Why this market behaves the way you claim. Assertion is not logic.",
    rule: "Criterion: Causal logic & proof",
  },
  {
    tag: "03",
    title: "The experiment",
    description: "Something small, live and measurable. Report it even when it flopped.",
    rule: "Criterion: Real spend & live data",
  },
  {
    tag: "04",
    title: "The revenue plan",
    description: "A business without a path to revenue is just an expensive idea.",
    rule: "Criterion: Board-level financial model",
  },
];

const defaultWhyTreqqo: WhyTreqqoContent = {
  eyebrow: "THE CEO CHALLENGE",
  titleLines: ["Every phase ends", "with a problem", "someone actually has."],
  description:
    "70% doing, 30% theory enforced, not aspirational. A right answer with no evidence behind it does not pass. You submit four things and defend them out loud.",
  submissions: defaultSubmissions,
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

  // Sync state whenever initialData changes from parent
  useEffect(() => {
    if (initialData) {
      setData((prev) => ({
        ...defaultWhyTreqqo,
        ...initialData,
        submissions:
          initialData.submissions && initialData.submissions.length > 0
            ? initialData.submissions
            : defaultSubmissions,
        banner: initialData.banner || defaultWhyTreqqo.banner,
      }));
    }
  }, [initialData]);

  const eyebrow = data.eyebrow || "THE CEO CHALLENGE";
  const titleLines = data.titleLines && data.titleLines.length > 0 ? data.titleLines : ["Every phase ends", "with a problem", "someone actually has."];
  const submissions = data.submissions && data.submissions.length > 0 ? data.submissions : defaultSubmissions;
  const description = data.description || defaultWhyTreqqo.description;
  const bannerTitle = data.banner?.title || "Phase 4 is a wall, not a checkpoint.";
  const bannerDesc = data.banner?.description || "Idea clarity is graded pass or rework. No partial credit, no parallel track. Nobody carries a weak idea into execution least of all the students in a hurry.";

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
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
        setStatusMsg({ type: "success", text: "CEO Challenge & Defense section saved successfully!" });
        onSaved(data);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save section content." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error while saving." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  }

  function updateTitleLine(index: number, val: string) {
    const updated = [...titleLines];
    updated[index] = val;
    setData({ ...data, titleLines: updated });
  }

  function updateSubmission(index: number, field: "title" | "description" | "rule" | "tag", val: string) {
    const updated = submissions.map((sub, i) => (i === index ? { ...sub, [field]: val } : sub));
    setData({ ...data, submissions: updated });
  }

  return (
    <div className="space-y-6">
      {/* Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 text-[#3B0D3B] text-[10px] font-bold uppercase tracking-wider mb-2">
            Homepage Section
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">
            CEO Challenge &amp; Defense Deliverables
          </h2>
          <p className="text-xs sm:text-sm text-[#5A4A5A]">
            Synchronized with the homepage live section. Edit the headline, proof standards, and defense deliverable cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusMsg && (
            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold ${
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
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Live Visual Interactive Section (Mirrors Homepage) */}
      <div className="rounded-3xl border border-[#E5E0D5] bg-[#F9F8F3] p-6 sm:p-8 lg:p-10 text-[#1A0A1A] shadow-sm">
        <div className="flex items-center gap-2 pb-6 border-b border-[#E5E0D5] mb-8">
          <Eye className="h-4 w-4 text-[#3B0D3B]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B0D3B]">
            Interactive Live Preview &amp; Editor
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Eyebrow, Title Lines, Description, Phase 4 Banner */}
          <div className="flex flex-col items-start lg:col-span-5 space-y-4">
            <div>
              <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block mb-1">
                Eyebrow Badge:
              </label>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#3B0D3B]/20 bg-[#3B0D3B]/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#3B0D3B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0ca30c]" />
                <input
                  type="text"
                  value={eyebrow}
                  onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                  placeholder="THE CEO CHALLENGE"
                  className="bg-transparent text-[#3B0D3B] font-black focus:outline-none w-44"
                />
              </div>
            </div>

            <div className="w-full space-y-1.5">
              <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
                Main Headline (3 lines):
              </label>
              {[0, 1, 2].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  value={titleLines[idx] || ""}
                  onChange={(e) => updateTitleLine(idx, e.target.value)}
                  placeholder={`Headline Line ${idx + 1}...`}
                  className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-lg sm:text-xl font-black text-[#1A0A1A] focus:border-[#3B0D3B] focus:outline-none shadow-2xs"
                />
              ))}
            </div>

            <div className="w-full">
              <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block mb-1">
                Section Description:
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Describe the proof standard..."
                className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3 text-xs sm:text-[13px] leading-relaxed text-[#5A4A5A] font-medium focus:border-[#3B0D3B] focus:outline-none shadow-2xs resize-none"
              />
            </div>

            {/* Phase 4 Wall Banner Card */}
            <div className="w-full rounded-none border-l-4 border-l-[#3B0D3B] border-y border-r border-[#E2DDD3] bg-white p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#3B0D3B] shrink-0" />
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) =>
                    setData({
                      ...data,
                      banner: { ...(data.banner || {}), title: e.target.value, description: bannerDesc },
                    })
                  }
                  placeholder="Phase 4 is a wall, not a checkpoint."
                  className="w-full text-xs font-bold text-[#1A0A1A] tracking-wide border-b border-transparent hover:border-[#3B0D3B]/30 focus:border-[#3B0D3B] focus:outline-none"
                />
              </div>
              <textarea
                rows={3}
                value={bannerDesc}
                onChange={(e) =>
                  setData({
                    ...data,
                    banner: { ...(data.banner || {}), title: bannerTitle, description: e.target.value },
                  })
                }
                placeholder="Banner description..."
                className="w-full text-[11px] leading-relaxed text-[#5A4A5A] font-normal border-b border-transparent hover:border-[#3B0D3B]/30 focus:border-[#3B0D3B] focus:outline-none resize-none bg-transparent"
              />
            </div>
          </div>

          {/* Right Column: The 4 Defense Deliverable Cards */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider">
                The 4 Defense Deliverables:
              </span>
              <span className="text-[10px] text-[#5A4A5A] font-semibold">Card 4 is Flagship Highlighted</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 items-start">
              {submissions.map((item, index) => {
                const isHighlighted = index === 3;
                const numStr = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={index}
                    className={cn(
                      "rounded-none p-5 sm:p-6 transition-all flex flex-col justify-between min-h-[220px] relative border",
                      isHighlighted
                        ? "bg-[#3B0D3B] text-white border-[#5A2A5A] border-t-[3px] border-t-[#8C6A8C] shadow-md"
                        : "bg-white text-[#1A0A1A] border-[#E5E0D5] border-t-[3px] border-t-[#3B0D3B] shadow-xs"
                    )}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "text-[9px] font-mono font-bold uppercase tracking-widest",
                            isHighlighted ? "text-[#FAF5EE]/70" : "text-[#8C6A8C]"
                          )}
                        >
                          Defense Deliverable
                        </span>
                        <span
                          className={cn(
                            "text-xl font-mono font-black",
                            isHighlighted ? "text-[#FDFAF6]" : "text-[#3B0D3B]"
                          )}
                        >
                          {numStr}
                        </span>
                      </div>

                      {/* Card Title Input */}
                      <div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateSubmission(index, "title", e.target.value)}
                          placeholder="Deliverable Title..."
                          className={cn(
                            "w-full text-sm sm:text-base font-black tracking-tight bg-transparent border-b focus:outline-none py-0.5",
                            isHighlighted
                              ? "text-white border-white/20 focus:border-white"
                              : "text-[#1A0A1A] border-[#E5E0D5] focus:border-[#3B0D3B]"
                          )}
                        />
                      </div>

                      {/* Card Description Textarea */}
                      <div>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => updateSubmission(index, "description", e.target.value)}
                          placeholder="Deliverable description..."
                          className={cn(
                            "w-full text-xs leading-relaxed font-medium bg-transparent focus:outline-none resize-none border-b",
                            isHighlighted
                              ? "text-[#FAF5EE]/85 border-white/10 focus:border-white/40"
                              : "text-[#5A4A5A] border-[#F0ECE1] focus:border-[#3B0D3B]/40"
                          )}
                        />
                      </div>
                    </div>

                    {/* Bottom Proof Standard Strip */}
                    <div
                      className={cn(
                        "mt-4 pt-2.5 border-t flex items-center justify-between text-[10px] font-mono",
                        isHighlighted ? "border-white/15 text-[#FAF5EE]/70" : "border-[#F0ECE1] text-slate-500"
                      )}
                    >
                      <input
                        type="text"
                        value={item.rule || `Criterion ${numStr}`}
                        onChange={(e) => updateSubmission(index, "rule", e.target.value)}
                        placeholder={`Criterion: e.g. Exactly 1 sentence`}
                        className={cn(
                          "bg-transparent focus:outline-none text-[10px] font-mono w-4/5",
                          isHighlighted ? "text-[#FAF5EE]/90" : "text-[#5A4A5A]"
                        )}
                      />
                      <span
                        className={cn("h-1.5 w-1.5", isHighlighted ? "bg-[#0CA30C]" : "bg-[#3B0D3B]")}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
