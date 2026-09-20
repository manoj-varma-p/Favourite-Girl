"use client";

import { useApplyModal } from "@/context/ApplyModalContext";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ApplyButtonProps {
  courseName?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  fullWidth?: boolean;
  children?: ReactNode;
  icon?: ReactNode;
}

export default function ApplyButton({
  courseName,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  children = "Apply for Batch 2",
  icon,
}: ApplyButtonProps) {
  const { openApplyModal } = useApplyModal();

  const variantStyles = {
    primary:
      "bg-[#3B0D3B] text-[#FDFAF6] shadow-md shadow-[#3B0D3B]/25 hover:bg-[#5A2A5A] hover:shadow-lg active:scale-[0.98]",
    secondary:
      "bg-white/10 text-[#FDFAF6] border border-white/20 hover:border-white/35 hover:bg-white/15 active:scale-[0.98]",
    ghost: "bg-transparent text-[#8C6A8C] hover:bg-white/10 hover:text-white",
  };

  const sizeStyles = {
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-12 px-6 sm:px-7 text-sm sm:text-base gap-2 sm:gap-2.5",
  };

  return (
    <button
      type="button"
      onClick={() => openApplyModal(courseName)}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C6A8C] focus-visible:ring-offset-2 cursor-pointer select-none",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
    >
      <span>{children}</span>
      {icon && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
