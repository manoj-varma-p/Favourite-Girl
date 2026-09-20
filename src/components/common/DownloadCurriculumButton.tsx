"use client";

import { useApplyModal } from "@/context/ApplyModalContext";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import type { ReactNode } from "react";

interface DownloadCurriculumButtonProps {
  courseName?: string;
  pdfUrl?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children?: ReactNode;
  icon?: ReactNode;
}

export default function DownloadCurriculumButton({
  courseName,
  pdfUrl,
  className,
  variant = "secondary",
  size = "md",
  fullWidth = false,
  children = "Download curriculum",
  icon,
}: DownloadCurriculumButtonProps) {
  const { openCurriculumModal } = useApplyModal();

  const variantStyles = {
    primary:
      "bg-[#3B0D3B] text-[#FDFAF6] shadow-md shadow-[#3B0D3B]/25 hover:bg-[#5A2A5A] hover:shadow-lg active:scale-[0.98]",
    secondary:
      "bg-white text-[#1A0A1A] border border-[#DCD5CB] shadow-xs hover:border-[#3B0D3B] hover:text-[#3B0D3B] hover:bg-[#FDFAF6] active:scale-[0.98]",
    dark:
      "bg-white/10 text-[#FDFAF6] border border-white/20 hover:border-white/35 hover:bg-white/15 active:scale-[0.98]",
    ghost: "bg-transparent text-[#5A4A5A] hover:bg-black/5 hover:text-[#1A0A1A]",
  };

  const sizeStyles = {
    sm: "h-9 px-4 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-12 px-6 sm:px-7 text-sm sm:text-base gap-2 sm:gap-2.5",
  };

  return (
    <button
      type="button"
      onClick={() => openCurriculumModal(courseName, pdfUrl)}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C6A8C] focus-visible:ring-offset-2 cursor-pointer select-none",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
    >
      <span>{children}</span>
      {icon ? (
        <span className="shrink-0">{icon}</span>
      ) : (
        <Download className="h-4 w-4 shrink-0 text-current" aria-hidden="true" />
      )}
    </button>
  );
}
