import React from "react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "active"
  | "published"
  | "draft"
  | "pending"
  | "review"
  | "approved"
  | "rejected"
  | "completed"
  | "archived"
  | "neutral";

interface StatusBadgeProps {
  status: string;
  label?: string;
  variant?: StatusVariant;
  className?: string;
  size?: "sm" | "md";
}

export default function StatusBadge({
  status,
  label,
  variant,
  className,
  size = "sm",
}: StatusBadgeProps) {
  // Infer variant if not explicitly passed
  const normalized = (variant || status.toLowerCase()) as StatusVariant;

  const getVariantStyles = (): string => {
    switch (normalized) {
      case "active":
      case "published":
      case "approved":
      case "completed":
        return "bg-[#0CA30C]/10 text-[#0CA30C] border-[#0CA30C]/25";
      case "pending":
      case "review":
        return "bg-[#3B0D3B]/10 text-[#3B0D3B] border-[#3B0D3B]/20";
      case "draft":
      case "archived":
      case "neutral":
        return "bg-[#F5EDE0] text-[#5A4A5A] border-[#3B0D3B]/10";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-[#FAF5EE] text-[#5A4A5A] border-[#3B0D3B]/10";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-bold rounded-full border tracking-wide uppercase",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        getVariantStyles(),
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          normalized === "active" || normalized === "published" || normalized === "approved"
            ? "bg-[#0CA30C]"
            : normalized === "pending" || normalized === "review"
            ? "bg-[#3B0D3B]"
            : normalized === "rejected"
            ? "bg-red-500"
            : "bg-[#8C6A8C]"
        )}
      />
      {label || status}
    </span>
  );
}
