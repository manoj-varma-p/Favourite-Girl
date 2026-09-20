"use client";

import { useState } from "react";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import type { CoursePhaseGroup } from "@/types/home";
import { cn } from "@/lib/utils";

interface PhaseAccordionProps {
  groups: CoursePhaseGroup[];
}

export default function PhaseAccordion({ groups = [] }: PhaseAccordionProps) {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([0]);

  function toggleIndex(idx: number) {
    setExpandedIndices((prev) =>
      prev.length === 1 && prev[0] === idx ? [] : [idx]
    );
  }

  function toggleAll() {
    if (expandedIndices.length === groups.length) {
      setExpandedIndices([]);
    } else {
      setExpandedIndices(groups.map((_, idx) => idx));
    }
  }

  const allExpanded =
    groups.length > 0 &&
    groups.every((_, idx) => expandedIndices.includes(idx));

  return (
    <div className="mt-5 flex flex-col gap-3">
      {/* Controls Bar on Mobile & Desktop */}
      <div className="flex items-center justify-between border-b border-[#C4D7D2] pb-3">
        <span className="text-xs font-bold text-[#012A22]/80 uppercase tracking-wider">
          Curriculum Phases ({groups.length})
        </span>

        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#012A22] hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all cursor-pointer shadow-2xs"
        >
          <ChevronsUpDown className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{allExpanded ? "Collapse All" : "Expand All"}</span>
        </button>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-2.5">
        {groups.map((group, originalIndex) => {
          const isOpen = expandedIndices.includes(originalIndex);
          const phaseNum = group.range || String(originalIndex + 1).padStart(2, "0");
          const isHighlighted = phaseNum === "04" || group.heading.toUpperCase().includes("IDEA + PROBLEM DISCOVERY") || group.heading.toUpperCase().includes("PROBLEM DISCOVERY");

          return (
            <div
              key={group.range || group.eyebrow || originalIndex}
              className={cn(
                "overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-250",
                isHighlighted
                  ? "border-[#5A2A5A] bg-gradient-to-r from-[#3B0D3B] via-[#240824] to-[#0B0B0F] shadow-lg ring-1 ring-[#5A2A5A]/40 text-[#FDFAF6]"
                  : isOpen
                  ? "border-[#5A2A5A]/60 bg-white shadow-md ring-1 ring-[#5A2A5A]/30 text-[#1A0A1A]"
                  : "border-[#F5EDE0] bg-white/95 hover:border-slate-300 text-[#1A0A1A] shadow-2xs"
              )}
            >
              <button
                type="button"
                onClick={() => toggleIndex(originalIndex)}
                aria-expanded={isOpen}
                className={cn(
                  "flex w-full items-center gap-3 sm:gap-4 px-3.5 py-3 sm:px-5 sm:py-3.5 text-left transition-colors select-none",
                  isHighlighted
                    ? "bg-transparent"
                    : isOpen
                    ? "bg-[#FAF5EE]/70"
                    : "bg-white hover:bg-[#FAF5EE]/50 active:bg-[#FAF5EE]"
                )}
              >
                {/* Phase Number Badge */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-all sm:h-9 sm:w-9 sm:text-sm",
                    isHighlighted
                      ? "bg-[#5A2A5A] text-[#FDFAF6] ring-2 ring-[#8C6A8C]/40 shadow-xs"
                      : isOpen
                      ? "bg-[#3B0D3B] text-[#FDFAF6] shadow-xs scale-105"
                      : "bg-slate-100 text-[#3B0D3B]"
                  )}
                >
                  {phaseNum}
                </div>

                {/* Phase Eyebrow & Title */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-extrabold tracking-wider uppercase",
                      isHighlighted ? "text-[#8C6A8C]" : "text-[#5A2A5A]"
                    )}>
                      {group.eyebrow}
                    </span>
                    {isHighlighted && (
                      <span className="inline-flex items-center rounded-full bg-[#5A2A5A] px-2 py-0.5 text-[9px] font-black tracking-wider uppercase text-[#FDFAF6] shadow-2xs">
                        Key Milestone
                      </span>
                    )}
                  </div>
                  <h3 className={cn(
                    "mt-0.5 text-xs sm:text-sm font-bold tracking-tight leading-snug",
                    isHighlighted ? "text-white font-black sm:text-base" : "text-[#1A0A1A]"
                  )}>
                    {group.heading}
                  </h3>
                </div>

                {/* Chevron */}
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 sm:h-8 sm:w-8",
                    isOpen
                      ? "rotate-180 bg-[#3B0D3B] text-[#FDFAF6]"
                      : isHighlighted
                      ? "bg-white/10 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                  aria-hidden="true"
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              {/* Smooth animated expand/collapse */}
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-slate-200 bg-slate-50/50 px-3.5 py-3.5 sm:px-5 sm:py-4">
                    <div className="flex flex-col gap-2.5">
                      {group.lessons.map((lesson) => (
                        <div
                          key={lesson}
                          className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-2xs"
                        >
                          {/* Deliverable Header */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] sm:text-xs font-bold tracking-wide text-[#3B0D3B] uppercase">
                              Core Deliverable & Skill
                            </span>
                            <span className="rounded-full bg-[#5A2A5A]/15 px-2 py-0.5 text-[10px] font-bold text-[#3B0D3B]">
                              Portfolio Graded
                            </span>
                          </div>

                          {/* Lesson Description */}
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
                            {lesson}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
