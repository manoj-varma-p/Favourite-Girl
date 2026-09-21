import React from "react";
import { cn } from "@/lib/utils";

interface StatBlockProps {
  label?: string;
  title?: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  trend?: {
    label?: string;
    value?: string;
    positive?: boolean;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export default function StatBlock({
  label,
  title,
  value,
  subtitle,
  description,
  badge,
  icon,
  trend,
  onClick,
  className,
}: StatBlockProps) {
  const displayTitle = title || label || "";
  const displaySubtitle = description || subtitle || "";
  const trendText = trend?.value || trend?.label || "";
  const isPositive = trend?.isPositive ?? trend?.positive ?? true;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === "function" || typeof icon === "object") {
      const IconComp = icon as React.ComponentType<{ className?: string }>;
      return <IconComp className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-[#3B0D3B]/10 bg-white p-4 sm:p-5 transition-all duration-200 shadow-xs",
        onClick && "cursor-pointer hover:border-[#3B0D3B]/30 hover:shadow-sm hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C6A8C]">
          {displayTitle}
        </p>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3B0D3B]/10 text-[#3B0D3B]">
            {badge}
          </span>
        )}
        {icon && !badge && (
          <div className="h-8 w-8 rounded-lg bg-[#FAF5EE] border border-[#3B0D3B]/10 flex items-center justify-center text-[#3B0D3B] shrink-0">
            {renderIcon()}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B0B0F]">
          {value}
        </span>
        {trendText && (
          <span
            className={cn(
              "text-[11px] font-bold",
              isPositive ? "text-[#0CA30C]" : "text-[#5A4A5A]"
            )}
          >
            {trendText}
          </span>
        )}
      </div>

      {displaySubtitle && (
        <p className="mt-1 text-xs text-[#5A4A5A] font-medium truncate">
          {displaySubtitle}
        </p>
      )}
    </div>
  );
}
