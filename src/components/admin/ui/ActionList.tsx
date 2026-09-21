import React from "react";
import { ArrowRight, AlertTriangle, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionItem {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeVariant?: "urgent" | "warning" | "info" | "neutral";
  severity?: "urgent" | "critical" | "warning" | "info" | "neutral";
  actionLabel: string;
  onAction: () => void;
}

interface ActionListProps {
  title?: string;
  items: ActionItem[];
  className?: string;
}

export default function ActionList({ items, className }: ActionListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 text-center">
        <CheckCircle className="h-6 w-6 text-[#0CA30C] mx-auto mb-2" />
        <p className="text-sm font-bold text-[#0B0B0F]">All caught up!</p>
        <p className="text-xs text-[#5A4A5A] mt-0.5">
          No urgent administrative actions required at this moment.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-[#3B0D3B]/10 bg-white overflow-hidden shadow-xs", className)}>
      <div className="px-5 py-4 border-b border-[#3B0D3B]/10 bg-[#FAF5EE] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#3B0D3B] animate-pulse" />
          <h3 className="text-sm font-extrabold text-[#0B0B0F] tracking-tight">
            Needs Your Attention
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#5A4A5A] bg-white border border-[#3B0D3B]/10 px-2 py-0.5 rounded-md">
          {items.length} {items.length === 1 ? "Action Item" : "Action Items"}
        </span>
      </div>

      <div className="divide-y divide-[#3B0D3B]/5">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF5EE]/60 transition-colors"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-[#3B0D3B]/5 border border-[#3B0D3B]/10 flex items-center justify-center text-[#3B0D3B] shrink-0 mt-0.5 sm:mt-0">
                {item.icon || <AlertTriangle className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-[#0B0B0F] truncate">
                    {item.title}
                  </h4>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded",
                        item.badgeVariant === "urgent"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : item.badgeVariant === "warning"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-[#3B0D3B]/10 text-[#3B0D3B] border border-[#3B0D3B]/20"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5A4A5A] mt-0.5 leading-normal">
                  {item.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={item.onAction}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#3B0D3B] hover:bg-[#2A082A] text-white px-3.5 py-2 text-xs font-bold transition-all shrink-0 self-end sm:self-center shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <span>{item.actionLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
