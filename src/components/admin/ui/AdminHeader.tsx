"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  RefreshCw,
  Menu,
  Bell,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  title: string;
  breadcrumb?: string;
  onOpenSearch: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  onToggleMobileMenu?: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

export default function AdminHeader({
  title,
  breadcrumb = "Workspace",
  onOpenSearch,
  onRefreshData,
  isRefreshing = false,
  onToggleMobileMenu,
  theme = "light",
  onToggleTheme,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-[#FDFAF6]/90 backdrop-blur-md border-b border-[#3B0D3B]/10 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + Page Title + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8C6A8C] uppercase tracking-wider">
            <span>TREQO HQ</span>
            <span>/</span>
            <span className="text-[#5A4A5A] truncate">{breadcrumb}</span>
          </div>
          <h1 className="text-base sm:text-lg font-black text-[#0B0B0F] tracking-tight truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Search Command Palette Trigger + Refresh + Live Site Link */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Command Palette Trigger Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 sm:gap-3 rounded-lg border border-[#3B0D3B]/10 bg-white px-3 py-1.5 text-xs text-[#8C6A8C] hover:border-[#3B0D3B]/30 hover:text-[#0B0B0F] transition-all shadow-2xs cursor-pointer group"
          title="Search (Cmd + K)"
        >
          <Search className="h-3.5 w-3.5 text-[#8C6A8C] group-hover:text-[#3B0D3B] transition-colors" />
          <span className="hidden sm:inline font-medium">Search anything...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-[#FAF5EE] border border-[#3B0D3B]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#5A4A5A]">
            ⌘K
          </kbd>
        </button>

        {/* Refresh Action */}
        {onRefreshData && (
          <button
            type="button"
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-[#3B0D3B]/10 bg-white text-[#5A4A5A] hover:text-[#3B0D3B] hover:border-[#3B0D3B]/30 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin text-[#3B0D3B]")}
            />
          </button>
        )}

        {/* Theme Toggle Button (Light / Dark) */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-[#3B0D3B]/10 bg-white text-[#5A4A5A] hover:text-[#3B0D3B] hover:border-[#3B0D3B]/30 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle admin color theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="h-4 w-4 text-[#3B0D3B]" />
            )}
          </button>
        )}

        {/* Live Site Quick Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#3B0D3B]/15 bg-[#FAF5EE] hover:bg-[#F5EDE0] px-3 py-1.5 text-xs font-bold text-[#3B0D3B] transition-all shadow-2xs"
          title="Visit Public Website"
        >
          <span>Live Site</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </header>
  );
}
