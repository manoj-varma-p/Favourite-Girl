"use client";

import { Mail, Phone, Calendar, Users, Monitor, Layers } from "lucide-react";
import ApplyButton from "@/components/common/ApplyButton";
import DownloadCurriculumButton from "@/components/common/DownloadCurriculumButton";
import type { CourseSidebar } from "@/types/home";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  sidebar: CourseSidebar;
  className?: string;
  courseTitle?: string;
  isLocked?: boolean;
}

const rows: { key: keyof CourseSidebar; label: string; icon: typeof Calendar }[] = [
  { key: "batchLabel", label: "Batch", icon: Layers },
  { key: "starts", label: "Starts", icon: Calendar },
  { key: "format", label: "Format", icon: Monitor },
  { key: "seats", label: "Seats", icon: Users },
];

export default function CategorySidebar({
  sidebar,
  className,
  courseTitle,
  isLocked = false,
}: CategorySidebarProps) {
  return (
    <aside className={cn("lg:sticky lg:top-36 lg:self-start", className)}>
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-[0_12px_32px_-16px_rgba(20,18,31,0.22)]">
        <div className="flex items-center justify-between bg-brand-primary px-5 py-3.5 text-white">
          <span className="text-xs font-bold uppercase tracking-wider">
            {sidebar.batchLabel.replace(/\s*\(.*?\)/, "").trim()} Details
          </span>
          {isLocked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-[#ABCAC2]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ABCAC2]" />
              Upcoming
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Active
            </span>
          )}
        </div>

        {/* Info Grid: 2 columns on mobile, 4 columns on tablets, 1 column on desktop sidebar */}
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 lg:grid-cols-1 lg:gap-4 lg:p-5">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.key}
                className="rounded-xl border border-border-subtle/70 bg-surface-alt/50 p-3 lg:border-none lg:bg-transparent lg:p-0"
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-brand-primary lg:hidden" aria-hidden="true" />
                  <p className="text-[10px] font-bold tracking-wide text-text-secondary uppercase sm:text-[11px]">
                    {row.label}
                  </p>
                </div>
                <p className="mt-0.5 text-xs font-bold text-text-primary sm:text-sm">{sidebar[row.key]}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2.5 px-4 pb-4 sm:flex-row lg:flex-col sm:px-5 sm:pb-5">
          <ApplyButton courseName={courseTitle} fullWidth size="md">
            {sidebar.applyLabel}
          </ApplyButton>
          <DownloadCurriculumButton
            courseName={courseTitle}
            fullWidth
            size="md"
          >
            {sidebar.downloadLabel}
          </DownloadCurriculumButton>
        </div>

        <div className="border-t border-border-subtle bg-surface-alt/30 px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-[11px] font-bold tracking-wide text-text-secondary uppercase">
            Have questions?
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
            {sidebar.admissionsNote}
          </p>
          <div className="mt-3 flex flex-col gap-2 text-xs font-semibold text-text-primary">
            <a
              href={`tel:${sidebar.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 rounded-lg bg-surface px-3 py-2 border border-border-subtle/80 hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-brand-primary shrink-0" aria-hidden="true" />
              <span>{sidebar.phone}</span>
            </a>
            <a
              href={`mailto:${sidebar.email}`}
              className="inline-flex items-center gap-2 rounded-lg bg-surface px-3 py-2 border border-border-subtle/80 hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-brand-primary shrink-0" aria-hidden="true" />
              <span className="truncate">{sidebar.email}</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
