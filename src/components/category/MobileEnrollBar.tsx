"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import ApplyButton from "@/components/common/ApplyButton";

interface MobileEnrollBarProps {
  batch: string;
  applyLabel: string;
  courseTitle?: string;
}

export default function MobileEnrollBar({
  batch,
  applyLabel,
  courseTitle,
}: MobileEnrollBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show when scrolled past 350px (after the initial hero actions)
      setVisible(window.scrollY > 350);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#F5EDE0] bg-[#FDFAF6]/95 px-4 py-3 shadow-[0_-8px_20px_-4px_rgba(59,13,59,0.08)] backdrop-blur-md lg:hidden animate-in fade-in slide-in-from-bottom-3 duration-200 text-[#1A0A1A]">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-[#0CA30C] animate-pulse" aria-hidden="true" />
            <p className="truncate text-xs font-bold text-[#3B0D3B] uppercase tracking-wide">
              {batch.split("·")[0]?.trim() || "Batch 2"}
            </p>
          </div>
          <p className="truncate text-[11px] font-medium text-slate-600">
            12 Phases · Live Cohort
          </p>
        </div>

        <ApplyButton
          courseName={courseTitle}
          variant="primary"
          size="md"
          className="shrink-0 font-bold shadow-sm"
          icon={<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          {applyLabel || "Apply for Batch 2"}
        </ApplyButton>
      </div>
    </div>
  );
}
