"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgramHeroCardProps {
  slug?: string;
  isLocked?: boolean;
}

export default function ProgramHeroCard({ slug, isLocked = false }: ProgramHeroCardProps) {
  const [activeTab, setActiveTab] = useState<"master" | "fit">("master");

  const isOnlineFlagship = slug === "digital-marketing";

  const fitContent = isOnlineFlagship
    ? {
        heading: "Best Fit For Your Ambition",
        description:
          "Engineered for aspiring graduates, career switchers, and professionals looking to upskill to build high-converting acquisition channels and scale modern ventures.",
        tags: [
          "Aspiring Graduates",
          "Entrepreneurs",
          "Career Switchers",
          "Growth Marketers",
          "People Who Are Looking for Upskilling",
        ],
      }
    : {
        heading: "Best Fit For Your Career Stage",
        description:
          "Engineered for graduates, 3-1 / 4-1 & final year college students, and ambitious career switchers looking to build an unassailable proof-of-work portfolio.",
        tags: [
          "Graduates",
          "3-1, 4-1 & Final Year Students",
          "Career Switchers",
          "Aspiring Marketers",
          "People Who Are Looking for Upskilling",
        ],
      };

  return (
    <div className="relative w-full">
      {/* Ambient shadow glow background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1.5 sm:-inset-2 rounded-3xl sm:rounded-[28px] bg-gradient-to-tr from-[#3B0D3B]/20 via-[#5A2A5A]/15 to-[#8C6A8C]/10 blur-xl sm:blur-2xl opacity-80"
      />

      {/* Main Card with elevated shadow */}
      <div className="relative flex w-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-[#F5EDE0] bg-white/95 backdrop-blur-md p-5 sm:p-7 shadow-[0_20px_50px_-12px_rgba(59,13,59,0.15),0_10px_25px_-5px_rgba(0,0,0,0.06)] transition-all">
        {/* Top subtle brand accent line */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3B0D3B] via-[#5A2A5A] to-[#8C6A8C]"
        />

        {/* Header: Badge & Status */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 sm:pb-4">
          <span className="inline-flex items-center rounded-full border border-[#5A2A5A]/25 bg-[#FAF5EE] px-3 py-1 text-[11px] font-bold text-[#3B0D3B]">
            12-Phase Curriculum
          </span>
          {isLocked ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8C6A8C]">
              <Clock className="h-3 w-3 text-[#8C6A8C]" />
              Upcoming Cohort
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0CA30C]">
              <span className="h-2 w-2 rounded-full bg-[#0CA30C] animate-pulse" />
              Batch 2 Enrolling
            </span>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 sm:mt-5 flex rounded-xl border border-slate-200 bg-slate-100/80 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("master")}
            className={cn(
              "flex-1 rounded-lg py-2 text-xs font-bold transition-all text-center select-none cursor-pointer",
              activeTab === "master"
                ? "bg-[#3B0D3B] text-[#FDFAF6] shadow-md shadow-slate-950/20"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            What You Master
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fit")}
            className={cn(
              "flex-1 rounded-lg py-2 text-xs font-bold transition-all text-center select-none cursor-pointer",
              activeTab === "fit"
                ? "bg-[#3B0D3B] text-[#FDFAF6] shadow-md shadow-slate-950/20"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Who It&apos;s For
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-5 flex flex-col gap-3">
          {activeTab === "master" ? (
            <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
              <h4 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                Learn By Deploying Real Budgets
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                No multiple choice exams or theoretical essays. You run real ad accounts, set up tracking pipelines, and optimize actual acquisition funnels.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "Meta Ads Manager",
                  "GA4 Attribution",
                  "Claude & AI",
                  "SEO Systems",
                  "Google Ads & PMax",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-slate-200/90 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
              <h4 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                {fitContent.heading}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {fitContent.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {fitContent.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-slate-200/90 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
