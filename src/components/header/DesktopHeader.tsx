"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Logo from "./Logo";
import CoursesMegaMenu from "./CoursesMegaMenu";
import { primaryNavItems, navExtras } from "@/data/navigation";
import { useApplyModal } from "@/context/ApplyModalContext";
import { cn } from "@/lib/utils";

interface DesktopHeaderProps {
  variant?: "hero" | "standard";
  isAtTop?: boolean;
}

export default function DesktopHeader({ variant = "standard", isAtTop = true }: DesktopHeaderProps) {
  const { openApplyModal } = useApplyModal();
  const [coursesOpen, setCoursesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMenuOpen = coursesOpen && isAtTop;

  useEffect(() => {
    if (!coursesOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCoursesOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setCoursesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [coursesOpen]);

  function handleCoursesToggle() {
    if (!isAtTop) {
      // If navbar is not at top yet, scroll smoothly to #courses section
      const target = document.getElementById("courses");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    setCoursesOpen((prev) => !prev);
  }

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const id = href.includes("#") ? href.split("#")[1] : "";
      if (id && typeof window !== "undefined" && window.location.pathname === "/") {
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${id}`);
        }
      }
    }
  }

  return (
    <div ref={dropdownRef} className="relative flex w-full h-[72px] items-center justify-between">
      {/* Left side: Logo (settles into navbar when scrolled) + Divider + Courses pill dropdown */}
      <div className="flex items-center">
        <div
          className={cn(
            "flex items-center transition-all duration-500 ease-out overflow-hidden will-change-[max-width,opacity,transform]",
            variant === "hero" && !isAtTop
              ? "max-w-0 opacity-0 -translate-x-6 scale-95 pointer-events-none mr-0"
              : "max-w-[160px] opacity-100 translate-x-0 scale-100 mr-4"
          )}
        >
          <Logo variant="dark" />
          <div
            className={cn(
              "ml-4 h-6 w-px bg-slate-200 shrink-0 transition-opacity duration-300",
              variant === "hero" && !isAtTop ? "opacity-0" : "opacity-100"
            )}
            aria-hidden="true"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleCoursesToggle}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#F5EDE0] bg-[#FAF5EE] px-4 py-1.5 text-xs font-bold text-[#1A0A1A] shadow-2xs transition-all hover:border-[#8C6A8C] hover:bg-[#F5EDE0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0D3B] cursor-pointer"
          >
            <span>Courses</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                isMenuOpen && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Right side: Nav links + Apply now CTA button */}
      <div className="flex items-center gap-8">
        <nav aria-label="Desktop Navigation" className="flex items-center gap-6">
          {primaryNavItems.filter((item) => item.key !== "courses").map((item) => {
            if (item.isHighlighted) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="group relative inline-flex items-center gap-1.5 rounded-full border border-[#F5EDE0] bg-[#FAF5EE] px-3 py-1 text-sm font-bold text-[#1A0A1A] shadow-2xs transition-all hover:bg-[#F5EDE0] hover:border-[#8C6A8C] active:scale-95"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0CA30C] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0CA30C]" />
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-[#3B0D3B] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#FDFAF6]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-semibold text-[#5A4A5A] transition-colors hover:text-[#3B0D3B]"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => openApplyModal()}
          className="glossy-shine inline-flex items-center justify-center rounded-xl bg-[#3B0D3B] px-5 py-2.5 text-sm font-bold text-[#FDFAF6] shadow-md shadow-[#3B0D3B]/20 transition-all hover:bg-[#2B052B] active:scale-[0.98] cursor-pointer"
        >
          {navExtras.ctaLabel}
        </button>
      </div>

      {/* Full-width Mega Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 w-full z-50 pt-2">
          <CoursesMegaMenu
            onClose={() => setCoursesOpen(false)}
            onNavClick={handleNavClick}
          />
        </div>
      )}
    </div>
  );
}

