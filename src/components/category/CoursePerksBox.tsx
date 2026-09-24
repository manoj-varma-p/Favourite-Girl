"use client";

import { X, Check } from "lucide-react";
import ApplyButton from "@/components/common/ApplyButton";
import DownloadCurriculumButton from "@/components/common/DownloadCurriculumButton";
import { cn } from "@/lib/utils";

export interface PerkItem {
  title: string;
  description: string;
  tag?: string;
}

interface CoursePerksBoxProps {
  courseTitle: string;
  slug?: string;
  isLocked?: boolean;
  perks?: Array<PerkItem | string>;
  className?: string;
  otherTitle?: string;
  ourTitle?: string;
  otherSubtitle?: string;
  ourSubtitle?: string;
}

// -------------------------------------------------------------
// COMPARISON TABLE DATA
// -------------------------------------------------------------
interface CompareRow {
  feature: string;
  them: string;
  us: string;
}

const DEFAULT_ROWS: CompareRow[] = [
  {
    feature: "Teaching Model",
    them: "Theoretical slides & pre-recorded basic videos.",
    us: 'Strategy (30%) + Live Execution (70%) via "The CEO Challenge".',
  },
  {
    feature: "Tool Focus",
    them: "Surface-level tool navigation, basic dashboard walkthroughs, & static design creation.",
    us: "Full Media Architecture: Meta CBO/Pixel/CAPI, Google Search, PMax, GA4, & AI workflows.",
  },
  {
    feature: "Cohort Quality & Peer Network",
    them: "Mass batches (100+ students) with open enrollment and no entry screening.",
    us: "Selective 40-Seat Cohort: Application-based screening to build a network of high-intent BBA/B.Com students, young founders, and growth minds.",
  },
  {
    feature: "AI Integration",
    them: 'Surface-level ChatGPT prompts or single dedicated "AI in Marketing" slides.',
    us: "100% AI-Native Workflows: AI integrated across research, creative generation, automation, and analytics (Canva Magic, Leonardo, Claude, Zapier/n8n).",
  },
  {
    feature: "Real Outcome",
    them: "A printed paper certificate.",
    us: "Validated Demand, Live Ad Spend Proof, Real Revenue Signals, & a Proof-of-Work Portfolio with 30+ Brand Projects across 16+ Industries.",
  },
];

export default function CoursePerksBox({
  courseTitle,
  isLocked = false,
  className,
  otherTitle = "Generic Institutes in AP/TS",
  ourTitle = "TreQo: The Marketing School",
}: CoursePerksBoxProps) {
  return (
    <section
      id="perks"
      className={cn("scroll-mt-28 sm:scroll-mt-32", className)}
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C6A8C] mb-2">
          Why TreQo Is Different
        </p>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#1A0A1A]">
          The Unfair Advantage
        </h2>
      </div>

      {/* Comparison Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full min-w-[580px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-[22%] py-4 px-5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
                Feature
              </th>
              <th className="w-[35%] py-4 px-5 text-left text-xs font-semibold text-slate-600 bg-slate-50 border-b border-slate-200">
                {otherTitle}
              </th>
              <th className="w-[43%] py-4 px-5 text-left text-xs font-bold text-white bg-[#1A0A1A] border-b border-[#1A0A1A]">
                {ourTitle}
              </th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_ROWS.map((row, idx) => {
              const isLast = idx === DEFAULT_ROWS.length - 1;
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={idx}
                  className={cn(
                    !isLast && "border-b border-slate-100",
                    isEven ? "bg-white" : "bg-slate-50/50"
                  )}
                >
                  <td className="py-4 px-5 align-top border-r border-slate-100">
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      {row.feature}
                    </span>
                  </td>
                  <td className="py-4 px-5 align-top border-r border-slate-100">
                    <div className="flex items-start gap-2">
                      <X className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" strokeWidth={2.5} />
                      <span className="text-xs text-slate-500 leading-relaxed">{row.them}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 align-top bg-[#F7F3FF]/40">
                    <div className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#3B0D3B]" strokeWidth={2.5} />
                      <span className="text-xs font-semibold text-[#1A0A1A] leading-relaxed">{row.us}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer CTA */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
        <p className="text-[10.5px] text-slate-500 font-medium text-center sm:text-left">
          All media budgets, pro tool licenses, and certifications are fully included.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <ApplyButton courseName={courseTitle} size="md" className="font-bold text-xs py-1.5 px-4 shadow-xs">
            {isLocked ? "Get Notified" : "Apply for Batch"}
          </ApplyButton>
          <DownloadCurriculumButton courseName={courseTitle} size="sm" className="text-xs font-semibold py-1.5 px-2.5">
            Syllabus
          </DownloadCurriculumButton>
        </div>
      </div>
    </section>
  );
}
