import React from "react";
import { Plus, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#3B0D3B]/10 bg-white p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center",
        className
      )}
    >
      <div className="h-12 w-12 rounded-xl bg-[#FAF5EE] border border-[#3B0D3B]/10 flex items-center justify-center text-[#3B0D3B] mb-3 shrink-0">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-sm sm:text-base font-bold text-[#0B0B0F] tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-xs text-[#5A4A5A] max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#3B0D3B] hover:bg-[#2A082A] text-white px-4 py-2 text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
