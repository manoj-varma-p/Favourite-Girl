"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  XCircle,
  Terminal,
  RotateCcw,
  LayoutGrid,
  Laptop,
} from "lucide-react";
import type { SixDecisionsContent, DecisionItem } from "@/lib/content-db";
import { cn } from "@/lib/utils";

interface Props {
  initialData?: SixDecisionsContent;
  adminPin: string;
  onSaved: (updated: SixDecisionsContent) => void;
}

const defaultSixDecisions: SixDecisionsContent = {
  eyebrow: "WHY TREQO",
  title: "Six decisions that make Treqo different.",
  subtitle:
    "Most marketing programs teach theory from slides. We made six deliberate structural choices to run this as an active agency residency.",
  footerNote: "Enforced on every cohort since Batch 1.",
  decisions: [
    {
      num: "01",
      title: "70% doing",
      description:
        "The ratio is enforced, not aspirational. Every phase closes on a live problem, and theory alone doesn't clear it.",
      protocolTag: "Enforced 70/30 Operating Ratio",
      statusTag: "NON-NEGOTIABLE",
      standardWay:
        "80% passive lectures, multiple-choice quizzes, and pre-recorded videos with zero real-world feedback.",
      treqoEnforcement:
        "70% hands-on campaign execution. If your ad tests don't generate real data, you cannot pass the phase.",
    },
    {
      num: "02",
      title: "Clients with something to lose",
      description:
        "You work on brands with real customers to disappoint. Fictional case studies teach confidence about risk you never carried.",
      protocolTag: "Live Brand Account Access",
      statusTag: "NON-NEGOTIABLE",
      standardWay:
        "Toy datasets, simulated mock businesses, and hypothetical case studies where failure has zero cost.",
      treqoEnforcement:
        "You manage active ad spend for real partner businesses where poor decisions cost real brand money.",
    },
    {
      num: "03",
      title: "A fixed sequence",
      description:
        "You can't position a brand you haven't understood. No à-la-carte modules the order is the curriculum.",
      protocolTag: "Non-Negotiable Linear Order",
      statusTag: "NON-NEGOTIABLE",
      standardWay:
        "À-la-carte electives that let students skip hard analytics, unit economics, or attribution models.",
      treqoEnforcement:
        "A non-negotiable linear sequence: you master campaign analysis and economics before touching Ads Manager.",
    },
    {
      num: "04",
      title: "AI from phase one",
      description:
        "In the workflow from the start, not bolted on as a final module nobody remembers.",
      protocolTag: "AI-Native Daily Workflow",
      statusTag: "NON-NEGOTIABLE",
      standardWay:
        "Tacked on as an optional bonus module or theoretical lecture on ChatGPT prompting at the end of the course.",
      treqoEnforcement:
        "Integrated into your daily workflow from day one: AI video scripting, hook variation, and audience mining.",
    },
    {
      num: "05",
      title: "Defended out loud",
      description:
        "Your numbers, your logic, your revenue plan pushed on in front of people. That's the interview rehearsal.",
      protocolTag: "Live Boardroom Defense",
      statusTag: "NON-NEGOTIABLE",
      standardWay:
        "Submitting written PDF reports or slide decks that hiring panels never look at and mentors never critique.",
      treqoEnforcement:
        "You stand up in our class and defend your live campaign CAC, ROAS, and revenue model out loud to founders.",
    },
    {
      num: "06",
      title: "50 seats, capped",
      description:
        "Small enough that there's nowhere to hide, and small enough that we know what you're bad at by week three.",
      protocolTag: "Strict 50-Seat Cap",
      statusTag: "NON-NEGOTIABLE",
      standardWay:
        "Massive 1,000+ student automated cohorts where instructors don't know your name or strengths.",
      treqoEnforcement:
        "Strictly capped at 50 seats per cohort. Tutors know your exact weaknesses and campaign blindspots by week three.",
    },
  ],
};

export default function AdminSixDecisionsTab({ initialData, adminPin, onSaved }: Props) {
  const [data, setData] = useState<SixDecisionsContent>(() => {
    if (!initialData) return defaultSixDecisions;
    return {
      eyebrow: initialData.eyebrow || defaultSixDecisions.eyebrow,
      title: initialData.title || defaultSixDecisions.title,
      subtitle: initialData.subtitle || defaultSixDecisions.subtitle,
      footerNote: initialData.footerNote || defaultSixDecisions.footerNote,
      decisions:
        initialData.decisions && initialData.decisions.length > 0
          ? initialData.decisions.map((d, idx) => ({
              ...defaultSixDecisions.decisions[idx],
              ...d,
            }))
          : defaultSixDecisions.decisions,
    };
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"console" | "grid">("console");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setData({
        eyebrow: initialData.eyebrow || defaultSixDecisions.eyebrow,
        title: initialData.title || defaultSixDecisions.title,
        subtitle: initialData.subtitle || defaultSixDecisions.subtitle,
        footerNote: initialData.footerNote || defaultSixDecisions.footerNote,
        decisions:
          initialData.decisions && initialData.decisions.length > 0
            ? initialData.decisions.map((d, idx) => ({
                ...defaultSixDecisions.decisions[idx],
                ...d,
              }))
            : defaultSixDecisions.decisions,
      });
    }
  }, [initialData]);

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
        sixDecisions: data,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({ type: "home", data: updatedHome }),
      });

      if (res.ok) {
        setStatusMsg({ type: "success", text: "Six Decisions saved successfully to live website!" });
        onSaved(data);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save section." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error saving section." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  }

  function handleReset() {
    if (confirm("Reset Six Decisions content to factory defaults?")) {
      setData(defaultSixDecisions);
    }
  }

  function updateActiveDecision(field: keyof DecisionItem, val: string) {
    const next = [...(data.decisions || defaultSixDecisions.decisions)];
    next[activeIndex] = { ...next[activeIndex], [field]: val };
    setData({ ...data, decisions: next });
  }

  function updateDecisionAt(idx: number, field: keyof DecisionItem, val: string) {
    const next = [...(data.decisions || defaultSixDecisions.decisions)];
    next[idx] = { ...next[idx], [field]: val };
    setData({ ...data, decisions: next });
  }

  const decisions = data.decisions && data.decisions.length > 0 ? data.decisions : defaultSixDecisions.decisions;
  const currentItem = decisions[activeIndex] || decisions[0];

  function handlePrev() {
    setActiveIndex((prev) => (prev - 1 + decisions.length) % decisions.length);
  }

  function handleNext() {
    setActiveIndex((prev) => (prev + 1) % decisions.length);
  }

  return (
    <div className="space-y-6">
      {/* Top Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#3B0D3B]/10 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 text-[#3B0D3B] text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="h-3 w-3" />
            <span>Exact Frontend Visual Mirror</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">
            Six Decisions (Why Treqo)
          </h2>
          <p className="text-xs text-[#5A4A5A]">
            Edit the six structural differentiator decisions in the exact dark console layout displayed on the live homepage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center rounded-xl bg-[#F5EDE0] p-1 border border-[#3B0D3B]/10">
            <button
              type="button"
              onClick={() => setViewMode("console")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "console"
                  ? "bg-[#3B0D3B] text-white shadow-xs"
                  : "text-[#5A4A5A] hover:text-[#1A0A1A]"
              )}
            >
              <Laptop className="h-3.5 w-3.5" />
              <span>Interactive Console</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-[#3B0D3B] text-white shadow-xs"
                  : "text-[#5A4A5A] hover:text-[#1A0A1A]"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards Matrix</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            title="Reset to original defaults"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

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
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. EXACT FRONTEND CONSOLE VIEW (Dark Luxury Theme - Matching Main Page)   */}
      {/* ========================================================================= */}
      {viewMode === "console" ? (
        <div className="rounded-3xl bg-[#0D0D11] p-6 sm:p-10 lg:p-12 border border-white/10 text-white shadow-2xl space-y-10">
          {/* Section Header: Direct Inline Editable Controls */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-3">
            {/* Pill Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#E8D8E8] shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C084FC] animate-pulse" />
                <input
                  type="text"
                  value={data.eyebrow || "WHY TREQO"}
                  onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                  className="bg-transparent text-center font-black uppercase tracking-[0.18em] text-[#E8D8E8] focus:outline-none focus:ring-1 focus:ring-[#C084FC] rounded px-1 w-36"
                  placeholder="WHY TREQO"
                />
              </span>
            </div>

            {/* Title */}
            <div className="w-full">
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Six decisions that make Treqo different."
                className="w-full bg-transparent text-center text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-black leading-[1.12] tracking-tight text-white border-b border-transparent hover:border-white/20 focus:border-[#C084FC] focus:outline-none transition-colors py-1"
              />
            </div>

            {/* Subtitle */}
            <div className="w-full max-w-xl mx-auto">
              <textarea
                rows={2}
                value={data.subtitle || ""}
                onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                placeholder="Most marketing programs teach theory from slides..."
                className="w-full bg-transparent text-center text-sm sm:text-base leading-relaxed text-[#C8B8C8] font-normal border-b border-transparent hover:border-white/20 focus:border-[#C084FC] focus:outline-none transition-colors resize-none py-1"
              />
            </div>
          </div>

          {/* Interactive Console Grid: Left Roster + Right Deep Dive Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Interactive Roster Selector (6 Decisions) */}
            <div className="flex flex-col gap-2.5 w-full lg:col-span-5">
              <div className="mb-2 flex items-center justify-between text-xs font-mono text-[#A898A8]">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#C084FC]" />
                  SELECT DECISION (CLICK TO EDIT)
                </span>
                <span>
                  {activeIndex + 1} of {decisions.length}
                </span>
              </div>

              {decisions.map((item, idx) => {
                const isSelected = activeIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      "group relative flex items-center justify-between rounded-xl p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer border",
                      isSelected
                        ? "bg-[#3B0D3B] text-white border-white/30 shadow-lg ring-1 ring-[#C084FC]/50"
                        : "bg-[#16161C] text-[#C8B8C8] border-white/10 hover:border-white/20 hover:bg-[#1E1E24]"
                    )}
                  >
                    <div className="flex items-center gap-3.5 flex-1 mr-2">
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-black transition-colors",
                          isSelected
                            ? "bg-white text-[#3B0D3B]"
                            : "bg-white/10 text-white group-hover:bg-white/15"
                        )}
                      >
                        {item.num}
                      </span>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateDecisionAt(idx, "title", e.target.value);
                        }}
                        placeholder="Decision Title"
                        className="text-sm sm:text-base font-bold tracking-tight text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-white focus:outline-none w-full"
                      />
                    </div>

                    {isSelected ? (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#C084FC] animate-pulse" />
                    ) : (
                      <ChevronRight className="w-4 h-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Active Decision Deep-Dive Console */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-[#14141A] p-6 sm:p-8 lg:p-9 shadow-2xl min-h-[460px] w-full lg:col-span-7">
              <div className="space-y-6">
                {/* Console Top Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10 font-mono text-xs">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="rounded bg-white/10 px-2 py-0.5 font-black text-white text-[11px]">
                      DECISION {currentItem.num}
                    </span>
                    <span className="text-[#A898A8]">•</span>
                    <input
                      type="text"
                      value={currentItem.protocolTag || ""}
                      onChange={(e) => updateActiveDecision("protocolTag", e.target.value)}
                      placeholder="Protocol Tag (e.g. Enforced 70/30 Operating Ratio)"
                      className="text-[#E8D8E8] font-bold bg-transparent border-b border-white/10 hover:border-white/30 focus:border-[#C084FC] focus:outline-none flex-1 py-0.5"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-[#C084FC] text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <input
                      type="text"
                      value={currentItem.statusTag || "NON-NEGOTIABLE"}
                      onChange={(e) => updateActiveDecision("statusTag", e.target.value)}
                      placeholder="NON-NEGOTIABLE"
                      className="bg-transparent text-[#C084FC] font-bold border-b border-white/10 focus:border-[#C084FC] focus:outline-none text-right w-32"
                    />
                  </div>
                </div>

                {/* Title & Core Philosophy */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#A898A8] uppercase tracking-wider block mb-1">
                      Decision Heading:
                    </span>
                    <input
                      type="text"
                      value={currentItem.title}
                      onChange={(e) => updateActiveDecision("title", e.target.value)}
                      placeholder="e.g. 70% doing"
                      className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight w-full bg-transparent border-b border-white/15 focus:border-[#C084FC] focus:outline-none pb-1"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-[#A898A8] uppercase tracking-wider block mb-1">
                      Core Pedagogy Description:
                    </span>
                    <textarea
                      rows={3}
                      value={currentItem.description}
                      onChange={(e) => updateActiveDecision("description", e.target.value)}
                      placeholder="The ratio is enforced, not aspirational..."
                      className="w-full bg-[#16161C] text-sm sm:text-base text-[#FAF5EE]/90 leading-relaxed font-medium rounded-xl p-3 border border-white/10 focus:border-[#C084FC] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Contrast Inspection Grid: The Standard Way vs. The Treqo Enforcement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Standard Practice (What others do) */}
                  <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      The Standard Way
                    </div>
                    <textarea
                      rows={4}
                      value={currentItem.standardWay || ""}
                      onChange={(e) => updateActiveDecision("standardWay", e.target.value)}
                      placeholder="80% passive lectures, multiple-choice quizzes..."
                      className="w-full bg-black/20 text-xs leading-relaxed text-[#FCD34D]/90 font-medium rounded-lg p-2.5 border border-rose-500/20 focus:border-rose-400 focus:outline-none resize-none"
                    />
                  </div>

                  {/* The Treqo Enforcement */}
                  <div className="rounded-2xl border border-[#C084FC]/30 bg-[#C084FC]/10 p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#E9D5FF]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" />
                      The Treqo Standard
                    </div>
                    <textarea
                      rows={4}
                      value={currentItem.treqoEnforcement || ""}
                      onChange={(e) => updateActiveDecision("treqoEnforcement", e.target.value)}
                      placeholder="70% hands-on campaign execution..."
                      className="w-full bg-black/20 text-xs leading-relaxed text-white/95 font-medium rounded-lg p-2.5 border border-[#C084FC]/30 focus:border-[#C084FC] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Console Footer Controls */}
              <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 mr-4">
                  <span className="text-[10px] font-mono text-[#A898A8] shrink-0">Footer Note:</span>
                  <input
                    type="text"
                    value={data.footerNote || "Enforced on every cohort since Batch 1."}
                    onChange={(e) => setData({ ...data, footerNote: e.target.value })}
                    placeholder="Enforced on every cohort since Batch 1."
                    className="text-xs font-mono text-[#A898A8] bg-transparent border-b border-white/10 hover:border-white/30 focus:border-[#C084FC] focus:outline-none flex-1 py-0.5"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label="Previous decision"
                    onClick={handlePrev}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer active:scale-95"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next decision"
                    onClick={handleNext}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer active:scale-95"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. CARDS MATRIX VIEW (Bulk Edit All 6 at Once)                            */
        /* ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decisions.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-[#3B0D3B]/15 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3B0D3B] text-white font-mono text-xs font-black">
                    {item.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-[#8C6A8C]">
                    Decision #{idx + 1}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
                    Protocol Tag:
                  </span>
                  <input
                    type="text"
                    value={item.protocolTag || ""}
                    onChange={(e) => updateDecisionAt(idx, "protocolTag", e.target.value)}
                    placeholder="Protocol Tag"
                    className="w-full text-xs font-bold text-[#3B0D3B] bg-transparent border-b border-[#3B0D3B]/15 focus:outline-none focus:border-[#3B0D3B] py-0.5"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
                    Title:
                  </span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateDecisionAt(idx, "title", e.target.value)}
                    placeholder="Title"
                    className="w-full text-base font-black text-[#1A0A1A] bg-transparent border-b border-[#3B0D3B]/15 focus:outline-none focus:border-[#3B0D3B] py-0.5"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
                    Description:
                  </span>
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => updateDecisionAt(idx, "description", e.target.value)}
                    placeholder="Description"
                    className="w-full text-xs text-[#5A4A5A] leading-relaxed bg-[#FAF5EE] rounded-lg p-2 border border-transparent focus:border-[#3B0D3B]/20 focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-2 pt-1 border-t border-[#3B0D3B]/10">
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                      The Standard Way:
                    </span>
                    <textarea
                      rows={2}
                      value={item.standardWay || ""}
                      onChange={(e) => updateDecisionAt(idx, "standardWay", e.target.value)}
                      placeholder="The Standard Way"
                      className="w-full text-[11px] text-rose-900 bg-rose-50 rounded-lg p-2 border border-rose-200 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#3B0D3B] uppercase tracking-wider block">
                      The Treqo Standard:
                    </span>
                    <textarea
                      rows={2}
                      value={item.treqoEnforcement || ""}
                      onChange={(e) => updateDecisionAt(idx, "treqoEnforcement", e.target.value)}
                      placeholder="The Treqo Standard"
                      className="w-full text-[11px] text-[#1A0A1A] bg-[#3B0D3B]/5 rounded-lg p-2 border border-[#3B0D3B]/20 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setViewMode("console");
                }}
                className="text-[11px] font-bold text-[#3B0D3B] hover:text-[#2A082A] flex items-center justify-center gap-1 pt-2 cursor-pointer"
              >
                <span>Edit in Interactive Console</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#3B0D3B]/10 shadow-xs">
        <span className="text-xs font-semibold text-[#5A4A5A] flex items-center gap-2">
          <Eye className="h-4 w-4 text-[#3B0D3B]" />
          <span>All edits directly reflect in the live homepage &quot;Why Treqo&quot; inspection console.</span>
        </span>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-6 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Saving..." : "Save Six Decisions"}</span>
        </button>
      </div>
    </div>
  );
}
