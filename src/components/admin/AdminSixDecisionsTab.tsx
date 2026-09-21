"use client";

import { useState, useEffect } from "react";
import { Save, Sparkles, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import type { SixDecisionsContent } from "@/lib/content-db";

interface Props {
  initialData?: SixDecisionsContent;
  adminPin: string;
  onSaved: (updated: SixDecisionsContent) => void;
}

const defaultSixDecisions: SixDecisionsContent = {
  title: "Six decisions that make Treqo different.",
  decisions: [
    {
      num: "01",
      title: "70% doing",
      description:
        "The ratio is enforced, not aspirational. Every phase closes on a live problem, and theory alone doesn't clear it.",
    },
    {
      num: "02",
      title: "Clients with something to lose",
      description:
        "You work on brands with real customers to disappoint. Fictional case studies teach confidence about risk you never carried.",
    },
    {
      num: "03",
      title: "A fixed sequence",
      description:
        "You can't position a brand you haven't understood. No à-la-carte modules the order is the curriculum.",
    },
    {
      num: "04",
      title: "AI from phase one",
      description:
        "In the workflow from the start, not bolted on as a final module nobody remembers.",
    },
    {
      num: "05",
      title: "Defended out loud",
      description:
        "Your numbers, your logic, your revenue plan pushed on in front of people. That's the interview rehearsal.",
    },
    {
      num: "06",
      title: "50 seats, capped",
      description:
        "Small enough that there's nowhere to hide, and small enough that we know what you're bad at by week three.",
    },
  ],
};

export default function AdminSixDecisionsTab({ initialData, adminPin, onSaved }: Props) {
  const [data, setData] = useState<SixDecisionsContent>(initialData || defaultSixDecisions);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setData({
        ...defaultSixDecisions,
        ...initialData,
        decisions:
          initialData.decisions && initialData.decisions.length > 0
            ? initialData.decisions
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
        setStatusMsg({ type: "success", text: "Six Decisions section saved successfully to live website!" });
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

  function updateDecision(index: number, field: "num" | "title" | "description", val: string) {
    const next = [...(data.decisions || defaultSixDecisions.decisions)];
    next[index] = { ...next[index], [field]: val };
    setData({ ...data, decisions: next });
  }

  const title = data.title || "Six decisions we made differently";
  const decisions = data.decisions && data.decisions.length > 0 ? data.decisions : defaultSixDecisions.decisions;

  return (
    <div className="space-y-6">
      {/* Top Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#3B0D3B]/10 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 text-[#3B0D3B] text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="h-3 w-3" />
            <span>Interactive Visual Editor</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">
            Six Decisions (Why Us)
          </h2>
          <p className="text-xs text-[#5A4A5A]">
            Edit the six key differentiator cards shown on the live homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* ========================================================= */}
      {/* EXACT FRONTEND SECTION BLOCKS (Directly Editable)         */}
      {/* ========================================================= */}
      <div className="rounded-2xl bg-[#FAF5EE] p-6 sm:p-10 lg:p-12 border border-[#3B0D3B]/10 shadow-xs">
        {/* Header Block Matching Frontend */}
        <div className="flex flex-col items-start max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#3B0D3B]">
            WHY TREQO
          </span>
          <div className="w-full">
            <span className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
              Section Title:
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Six decisions we made differently"
              className="mt-1 w-full bg-transparent text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-[#0B0B0F] border-b border-[#3B0D3B]/20 focus:border-[#3B0D3B] focus:outline-none transition-colors py-1"
            />
          </div>

          <div className="w-full pt-1">
            <span className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
              Optional Subtitle:
            </span>
            <input
              type="text"
              value={data.subtitle || ""}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              placeholder="e.g. Why our pedagogy actually works"
              className="mt-1 w-full bg-transparent text-sm sm:text-base text-[#5A4A5A] border-b border-[#3B0D3B]/15 focus:border-[#3B0D3B] focus:outline-none transition-colors py-0.5"
            />
          </div>
        </div>

        {/* 6 Decision Cards Grid - Exactly Matching Frontend Blocks */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {decisions.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-[#3B0D3B]/30 transition-all duration-200 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={item.num}
                    onChange={(e) => updateDecision(idx, "num", e.target.value)}
                    placeholder={`0${idx + 1}`}
                    className="w-14 rounded-md bg-[#3B0D3B]/10 px-2.5 py-1 text-xs font-bold text-[#3B0D3B] text-center border border-[#3B0D3B]/20 focus:outline-none focus:ring-1 focus:ring-[#3B0D3B]"
                  />
                  <span className="text-[10px] font-semibold text-[#8C6A8C]">Card #{idx + 1}</span>
                </div>

                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateDecision(idx, "title", e.target.value)}
                  placeholder="e.g. 70% doing"
                  className="block w-full bg-transparent text-lg sm:text-xl font-bold tracking-tight text-[#0B0B0F] border-b border-[#3B0D3B]/15 focus:border-[#3B0D3B] focus:outline-none py-0.5 transition-colors"
                />

                <textarea
                  rows={4}
                  value={item.description}
                  onChange={(e) => updateDecision(idx, "description", e.target.value)}
                  placeholder="The ratio is enforced, not aspirational..."
                  className="block w-full bg-transparent text-xs sm:text-sm leading-relaxed text-[#5A4A5A] placeholder:text-[#8C6A8C] focus:bg-[#FAF5EE] rounded-lg p-1.5 focus:outline-none resize-none border border-transparent focus:border-[#3B0D3B]/20"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Save Action */}
        <div className="mt-8 flex items-center justify-between border-t border-[#3B0D3B]/10 pt-5">
          <span className="text-xs font-semibold text-[#5A4A5A] flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-[#3B0D3B]" />
            <span>This layout matches your live website &quot;Why Treqo&quot; section</span>
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
    </div>
  );
}
