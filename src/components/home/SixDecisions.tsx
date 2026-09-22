"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, ShieldCheck, ChevronLeft, ChevronRight, Terminal } from "lucide-react";
import type { SixDecisionsContent, DecisionItem } from "@/lib/content-db";

const defaultDecisions: DecisionItem[] = [
  {
    num: "01",
    title: "70% doing",
    description:
      "The ratio is enforced, not aspirational. Every phase closes on a live problem, and theory alone doesn't clear it.",
    protocolTag: "Enforced 70/30 Operating Ratio",
    statusTag: "NON-NEGOTIABLE",
    standardWay: "80% passive lectures, multiple-choice quizzes, and pre-recorded videos with zero real-world feedback.",
    treqoEnforcement: "70% hands-on campaign execution. If your ad tests don't generate real data, you cannot pass the phase.",
  },
  {
    num: "02",
    title: "Clients with something to lose",
    description:
      "You work on brands with real customers to disappoint. Fictional case studies teach confidence about risk you never carried.",
    protocolTag: "Live Brand Account Access",
    statusTag: "NON-NEGOTIABLE",
    standardWay: "Toy datasets, simulated mock businesses, and hypothetical case studies where failure has zero cost.",
    treqoEnforcement: "You manage active ad spend for real partner businesses where poor decisions cost real brand money.",
  },
  {
    num: "03",
    title: "A fixed sequence",
    description:
      "You can't position a brand you haven't understood. No à-la-carte modules the order is the curriculum.",
    protocolTag: "Non-Negotiable Linear Order",
    statusTag: "NON-NEGOTIABLE",
    standardWay: "À-la-carte electives that let students skip hard analytics, unit economics, or attribution models.",
    treqoEnforcement: "A non-negotiable linear sequence: you master campaign analysis and economics before touching Ads Manager.",
  },
  {
    num: "04",
    title: "AI from phase one",
    description:
      "In the workflow from the start, not bolted on as a final module nobody remembers.",
    protocolTag: "AI-Native Daily Workflow",
    statusTag: "NON-NEGOTIABLE",
    standardWay: "Tacked on as an optional bonus module or theoretical lecture on ChatGPT prompting at the end of the course.",
    treqoEnforcement: "Integrated into your daily workflow from day one: AI video scripting, hook variation, and audience mining.",
  },
  {
    num: "05",
    title: "Defended out loud",
    description:
      "Your numbers, your logic, your revenue plan pushed on in front of people. That's the interview rehearsal.",
    protocolTag: "Live Boardroom Defense",
    statusTag: "NON-NEGOTIABLE",
    standardWay: "Submitting written PDF reports or slide decks that hiring panels never look at and mentors never critique.",
    treqoEnforcement: "You stand up in our class and defend your live campaign CAC, ROAS, and revenue model out loud to founders.",
  },
  {
    num: "06",
    title: "50 seats, capped",
    description:
      "Small enough that there's nowhere to hide, and small enough that we know what you're bad at by week three.",
    protocolTag: "Strict 50-Seat Cap",
    statusTag: "NON-NEGOTIABLE",
    standardWay: "Massive 1,000+ student automated cohorts where instructors don't know your name or strengths.",
    treqoEnforcement: "Strictly capped at 50 seats per cohort. Tutors know your exact weaknesses and campaign blindspots by week three.",
  },
];

const DECISION_DETAILS: Record<
  string,
  {
    standardWay: string;
    treqoEnforcement: string;
    protocolTag: string;
  }
> = {
  "01": {
    standardWay: "80% passive lectures, multiple-choice quizzes, and pre-recorded videos with zero real-world feedback.",
    treqoEnforcement: "70% hands-on campaign execution. If your ad tests don't generate real data, you cannot pass the phase.",
    protocolTag: "Enforced 70/30 Operating Ratio",
  },
  "02": {
    standardWay: "Toy datasets, simulated mock businesses, and hypothetical case studies where failure has zero cost.",
    treqoEnforcement: "You manage active ad spend for real partner businesses where poor decisions cost real brand money.",
    protocolTag: "Live Brand Account Access",
  },
  "03": {
    standardWay: "À-la-carte electives that let students skip hard analytics, unit economics, or attribution models.",
    treqoEnforcement: "A non-negotiable linear sequence: you master campaign analysis and economics before touching Ads Manager.",
    protocolTag: "Non-Negotiable Linear Order",
  },
  "04": {
    standardWay: "Tacked on as an optional bonus module or theoretical lecture on ChatGPT prompting at the end of the course.",
    treqoEnforcement: "Integrated into your daily workflow from day one: AI video scripting, hook variation, and audience mining.",
    protocolTag: "AI-Native Daily Workflow",
  },
  "05": {
    standardWay: "Submitting written PDF reports or slide decks that hiring panels never look at and mentors never critique.",
    treqoEnforcement: "You stand up in our class and defend your live campaign CAC, ROAS, and revenue model out loud to founders.",
    protocolTag: "Live Boardroom Defense",
  },
  "06": {
    standardWay: "Massive 1,000+ student automated cohorts where instructors don't know your name or strengths.",
    treqoEnforcement: "Strictly capped at 50 seats per cohort. Tutors know your exact weaknesses and campaign blindspots by week three.",
    protocolTag: "Strict 50-Seat Cap",
  },
};

export default function SixDecisions({ content }: { content?: SixDecisionsContent }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const title = content?.title || "Six decisions that make Treqo different.";
  const eyebrow = content?.eyebrow || "WHY TREQO";
  const subtitle =
    content?.subtitle ||
    "Most marketing programs teach theory from slides. We made six deliberate structural choices to run this as an active agency residency.";
  const footerNote = content?.footerNote || "Enforced on every cohort since Batch 1.";

  const decisions =
    content?.decisions && content.decisions.length > 0
      ? content.decisions
      : defaultDecisions;

  const currentItem = decisions[activeIndex] || decisions[0];
  const currentDetail =
    DECISION_DETAILS[currentItem.num] || DECISION_DETAILS["01"];

  const protocolTag = currentItem.protocolTag || currentDetail?.protocolTag || "Operating Standard";
  const statusTag = currentItem.statusTag || "NON-NEGOTIABLE";
  const standardWay = currentItem.standardWay || currentDetail?.standardWay || "";
  const treqoEnforcement = currentItem.treqoEnforcement || currentDetail?.treqoEnforcement || "";

  function handlePrev() {
    setActiveIndex((prev) => (prev - 1 + decisions.length) % decisions.length);
  }

  function handleNext() {
    setActiveIndex((prev) => (prev + 1) % decisions.length);
  }

  return (
    <section
      id="why-treqo"
      className="bg-[#0D0D11] py-12 sm:py-16 lg:py-18 scroll-mt-16 sm:scroll-mt-20 text-white border-y border-white/10"
    >
      <Container>
        {/* Section Header: Centered Alignment */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#E8D8E8] shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C084FC] animate-pulse" />
            {eyebrow}
          </span>
          <h2 className="mt-3.5 text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-black leading-[1.12] tracking-tight text-white sm:whitespace-nowrap">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#C8B8C8] font-normal max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* ────────────────────────────────────────────────────────────────
            STYLE 4: INTERACTIVE DECISION INSPECTION CONSOLE
           ──────────────────────────────────────────────────────────────── */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Interactive Roster Selector (6 Decisions) */}
          <div className="flex flex-col gap-2.5 w-full lg:col-span-5">
            <div className="mb-2 flex items-center justify-between text-xs font-mono text-[#A898A8]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#C084FC]" />
                SELECT DECISION
              </span>
              <span>{activeIndex + 1} of {decisions.length}</span>
            </div>

            {decisions.map((item, idx) => {
              const isSelected = activeIndex === idx;

              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "group relative flex items-center justify-between rounded-xl p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer border",
                    isSelected
                      ? "bg-[#3B0D3B] text-white border-white/30 shadow-lg"
                      : "bg-[#16161C] text-[#C8B8C8] border-white/10 hover:border-white/20 hover:bg-[#1E1E24]"
                  )}
                >
                  <div className="flex items-center gap-3.5">
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
                    <span className="text-sm sm:text-base font-bold tracking-tight text-white line-clamp-1">
                      {item.title}
                    </span>
                  </div>

                  {isSelected ? (
                    <span className="h-2 w-2 rounded-full bg-[#C084FC] animate-pulse" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-white/40 transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Decision Deep-Dive Console */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-[#14141A] p-6 sm:p-8 lg:p-9 shadow-2xl min-h-[460px] w-full lg:col-span-7">
            <div>
              {/* Console Top Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-white/10 px-2 py-0.5 font-black text-white text-[11px]">
                    DECISION {currentItem.num}
                  </span>
                  <span className="text-[#A898A8]">•</span>
                  <span className="text-[#E8D8E8] font-bold">
                    {protocolTag}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[#C084FC] text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {statusTag}
                </span>
              </div>

              {/* Title & Core Philosophy */}
              <div className="mt-6">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {currentItem.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[#FAF5EE]/90 leading-relaxed font-medium">
                  {currentItem.description}
                </p>
              </div>

              {/* Contrast Inspection Grid: The Standard Way vs. The Treqo Enforcement */}
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard Practice (What others do) */}
                <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    The Standard Way
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#FCD34D]/90 font-medium">
                    {standardWay}
                  </p>
                </div>

                {/* The Treqo Enforcement */}
                <div className="rounded-2xl border border-[#C084FC]/30 bg-[#C084FC]/10 p-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#E9D5FF]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" />
                    The Treqo Standard
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/95 font-medium">
                    {treqoEnforcement}
                  </p>
                </div>
              </div>
            </div>

            {/* Console Footer Controls */}
            <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#A898A8]">
                {footerNote}
              </span>

              <div className="flex items-center gap-2">
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
      </Container>
    </section>
  );
}
