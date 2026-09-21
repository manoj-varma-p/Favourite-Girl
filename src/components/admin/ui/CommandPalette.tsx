"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Search,
  X,
  ArrowRight,
  Users,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Trophy,
  Compass,
  FileText,
  Mail,
  Settings,
  Globe,
  ExternalLink,
  Download,
  Plus,
} from "lucide-react";
import type { Lead } from "@/lib/leads-db";
import type { CourseItem } from "@/lib/content-db";
import type { BlogPost } from "@/data/blogs";

export interface CommandItem {
  id: string;
  category: "Navigation" | "Students" | "Courses" | "Quick Actions";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  leads?: Lead[];
  courses?: CourseItem[];
  blogs?: BlogPost[];
  onExportCsv?: () => void;
  onOpenNewBlog?: () => void;
  onSelectLead?: (lead: Lead) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  leads = [],
  courses = [],
  blogs = [],
  onExportCsv,
  onOpenNewBlog,
  onSelectLead,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keydown for CMD+K / CTRL+K handled by parent or window
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect();
          onClose();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex]);

  // Base list of commands
  const allItems: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // Navigation
      {
        id: "nav-overview",
        category: "Navigation",
        title: "Overview Dashboard",
        subtitle: "Key operational metrics & attention queue",
        icon: <Users className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("overview"),
      },
      {
        id: "nav-leads",
        category: "Navigation",
        title: "Student Applications & Leads",
        subtitle: "Search, filter & review student submissions",
        icon: <Users className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("leads"),
      },
      {
        id: "nav-courses",
        category: "Navigation",
        title: "Courses & Curriculum",
        subtitle: "Manage tracks, modules, and locking states",
        icon: <GraduationCap className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("courses"),
      },
      {
        id: "nav-tutors",
        category: "Navigation",
        title: "Mentors & Faculty",
        subtitle: "Agency founders & industry leaders",
        icon: <Sparkles className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("tutors"),
      },
      {
        id: "nav-why",
        category: "Navigation",
        title: "Why Treqo & CEO Challenge",
        subtitle: "Real brand prompts & decision-making defense",
        icon: <Compass className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("whyTreqqo"),
      },
      {
        id: "nav-placements",
        category: "Navigation",
        title: "Batch Placements & Outcomes",
        subtitle: "Verified alumni packages & partner hiring network",
        icon: <Trophy className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("placements"),
      },
      {
        id: "nav-gov",
        category: "Navigation",
        title: "Gov Accreditations & Certifications",
        subtitle: "MSME, DPIIT, Startup India credentials",
        icon: <Award className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("govCerts"),
      },
      {
        id: "nav-blogs",
        category: "Navigation",
        title: "Blog Articles & Editorial",
        subtitle: "Publish articles and marketing case studies",
        icon: <BookOpen className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("blogs"),
      },
      {
        id: "nav-alerts",
        category: "Navigation",
        title: "Email Alerts & Notifications",
        subtitle: "Resend API, webhook integrations & auto-alerts",
        icon: <Mail className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("alerts"),
      },
      {
        id: "nav-forms",
        category: "Navigation",
        title: "Form Titles & Modal Copy",
        subtitle: "Customize labels, ctas, and student intake form",
        icon: <FileText className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("forms"),
      },
      {
        id: "nav-branding",
        category: "Navigation",
        title: "Branding & Site Assets",
        subtitle: "Logo, favicon, typography, and theme",
        icon: <Settings className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("branding"),
      },
      {
        id: "nav-layout",
        category: "Navigation",
        title: "Layout & SEO Meta",
        subtitle: "Meta tags, Google tag manager, OG card images",
        icon: <Globe className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => onSelectTab("layout"),
      },

      // Quick Actions
      ...(onExportCsv
        ? [
            {
              id: "action-export-csv",
              category: "Quick Actions" as const,
              title: "Export Student Leads as CSV",
              subtitle: "Instant spreadsheet download",
              icon: <Download className="h-4 w-4 text-[#0CA30C]" />,
              onSelect: onExportCsv,
            },
          ]
        : []),
      ...(onOpenNewBlog
        ? [
            {
              id: "action-new-blog",
              category: "Quick Actions" as const,
              title: "Write New Blog Article",
              subtitle: "Open draft composer",
              icon: <Plus className="h-4 w-4 text-[#3B0D3B]" />,
              onSelect: onOpenNewBlog,
            },
          ]
        : []),
      {
        id: "action-view-site",
        category: "Quick Actions",
        title: "Open Live Public Website",
        subtitle: "treqo.in front-facing student portal",
        icon: <ExternalLink className="h-4 w-4 text-[#5A4A5A]" />,
        onSelect: () => window.open("/", "_blank"),
      },
    ];

    // Dynamic Courses
    courses.forEach((c) => {
      list.push({
        id: `course-${c.id}`,
        category: "Courses",
        title: c.title,
        subtitle: `${c.badge || "Course"} · ${c.isLocked ? "Locked" : "Open for Batch 2"}`,
        icon: <GraduationCap className="h-4 w-4 text-[#3B0D3B]" />,
        onSelect: () => {
          onSelectTab("courses");
        },
      });
    });

    // Dynamic Top Leads
    leads.slice(0, 30).forEach((l) => {
      list.push({
        id: `lead-${l.id || l.email}`,
        category: "Students",
        title: l.name || "Student Applicant",
        subtitle: `${l.email} · ${l.phone || ""} · ${l.course || ""}`,
        icon: <Users className="h-4 w-4 text-[#5A4A5A]" />,
        onSelect: () => {
          onSelectTab("leads");
        },
      });
    });

    return list;
  }, [courses, leads, onSelectTab, onExportCsv, onOpenNewBlog]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 15);
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [allItems, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-[#180518]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-2xl bg-white border border-[#3B0D3B]/20 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[#3B0D3B]/10 bg-[#FDFAF6]">
          <Search className="h-5 w-5 text-[#8C6A8C] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tabs, students, courses, or actions... (Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-[#0B0B0F] placeholder:text-[#8C6A8C] focus:outline-none font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[#8C6A8C] hover:text-[#0B0B0F] p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-[#3B0D3B]/5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#5A4A5A]">
              <Search className="h-8 w-8 mx-auto text-[#8C6A8C]/60 mb-2 stroke-[1.5]" />
              <p className="text-sm font-bold text-[#0B0B0F]">No matching results found</p>
              <p className="text-xs text-[#5A4A5A] mt-0.5">
                Try searching for students, courses, or settings.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.onSelect();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#3B0D3B]/8 text-[#3B0D3B]"
                      : "hover:bg-[#FAF5EE] text-[#0B0B0F]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-white shadow-2xs border border-[#3B0D3B]/20"
                          : "bg-[#FAF5EE] border border-[#3B0D3B]/5"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold truncate">{item.title}</p>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C6A8C] bg-[#FAF5EE] px-1.5 py-0.2 rounded border border-[#3B0D3B]/10">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-[#5A4A5A] truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRight
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isSelected ? "text-[#3B0D3B] translate-x-0.5" : "text-[#8C6A8C]/40"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#FAF5EE] border-t border-[#3B0D3B]/10 flex items-center justify-between text-[11px] text-[#5A4A5A]">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#3B0D3B]/10 text-[10px] font-bold">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#3B0D3B]/10 text-[10px] font-bold">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#3B0D3B]/10 text-[10px] font-bold">Enter</kbd> to select
            </span>
          </div>
          <span className="font-medium text-[#8C6A8C]">
            Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#3B0D3B]/10 text-[10px] font-bold">Ctrl/Cmd + K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
