"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownAction {
  id?: string;
  label: string;
  href?: string;
  destructive?: boolean;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  variant?: "default" | "danger" | "positive";
  onClick?: () => void;
  onSelect?: () => void;
}

interface DropdownMenuProps {
  actions?: DropdownAction[];
  items?: DropdownAction[];
  align?: "left" | "right";
  className?: string;
}

export default function DropdownMenu({
  actions,
  items,
  align = "right",
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const list = actions || items || [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const renderIcon = (iconItem?: React.ReactNode | React.ComponentType<{ className?: string }>) => {
    if (!iconItem) return null;
    if (React.isValidElement(iconItem)) return iconItem;
    if (typeof iconItem === "function" || typeof iconItem === "object") {
      const IconComp = iconItem as React.ComponentType<{ className?: string }>;
      return <IconComp className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-lg border border-[#3B0D3B]/10 bg-white text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] hover:border-[#3B0D3B]/25 transition-all shadow-2xs cursor-pointer"
        aria-label="More options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-40 mt-1.5 w-44 rounded-xl border border-[#3B0D3B]/15 bg-white p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-100",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {list.map((act, index) => {
            const isDanger = act.variant === "danger" || act.destructive;
            return (
              <button
                key={act.id || index}
                type="button"
                onClick={() => {
                  if (act.href) {
                    window.location.href = act.href;
                  } else if (act.onClick) {
                    act.onClick();
                  } else if (act.onSelect) {
                    act.onSelect();
                  }
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer",
                  isDanger
                    ? "text-red-600 hover:bg-red-50"
                    : act.variant === "positive"
                    ? "text-[#0CA30C] hover:bg-emerald-50"
                    : "text-[#0B0B0F] hover:bg-[#FAF5EE] hover:text-[#3B0D3B]"
                )}
              >
                {act.icon && (
                  <span
                    className={cn(
                      "shrink-0",
                      isDanger
                        ? "text-red-500"
                        : act.variant === "positive"
                        ? "text-[#0CA30C]"
                        : "text-[#8C6A8C]"
                    )}
                  >
                    {renderIcon(act.icon)}
                  </span>
                )}
                <span className="truncate">{act.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
