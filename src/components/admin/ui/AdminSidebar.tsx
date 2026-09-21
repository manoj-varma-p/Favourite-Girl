"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
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
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  Layers,
  X,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItemConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badge?: string;
  badgeVariant?: "pulse" | "solid";
  href?: string;
}

export interface NavGroupConfig {
  groupTitle: string;
  items: NavItemConfig[];
}

interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onLogout: () => void;
  leadsCount?: number;
  coursesCount?: number;
  tutorsCount?: number;
  blogsCount?: number;
  faqsCount?: number;
  emailAlertsActive?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  onLogout,
  leadsCount = 0,
  coursesCount = 0,
  tutorsCount = 0,
  blogsCount = 0,
  faqsCount = 0,
  emailAlertsActive = false,
  isOpenMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  // Collapsed state persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("treqo_admin_sidebar_collapsed");
      if (stored === "true") {
        setIsCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("treqo_admin_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const navGroups: NavGroupConfig[] = [
    {
      groupTitle: "WORKSPACE",
      items: [
        {
          id: "overview",
          label: "Overview",
          icon: Layers,
        },
        {
          id: "leads",
          label: "Student Applications",
          icon: Users,
          count: leadsCount,
        },
      ],
    },
    {
      groupTitle: "LEARNING & PROGRAMS",
      items: [
        {
          id: "courses",
          label: "Courses & Curriculum",
          icon: GraduationCap,
          count: coursesCount,
        },
        {
          id: "tutors",
          label: "Mentors & Faculty",
          icon: Sparkles,
          count: tutorsCount,
        },
        {
          id: "whyTreqqo",
          label: "CEO Challenge & Defense",
          icon: Compass,
        },
        {
          id: "placements",
          label: "Batch Placements",
          icon: Trophy,
        },
      ],
    },
    {
      groupTitle: "CREDENTIALS & COMPLIANCE",
      items: [
        {
          id: "govCerts",
          label: "Gov Certifications",
          icon: Award,
        },
      ],
    },
    {
      groupTitle: "CONTENT & MARKETING",
      items: [
        {
          id: "blogs",
          label: "Blog Articles",
          icon: BookOpen,
          count: blogsCount,
        },
        {
          id: "banner",
          label: "Announcement Banner",
          icon: Sparkles,
        },
        {
          id: "faqs",
          label: "FAQ Manager",
          icon: HelpCircle,
          count: faqsCount,
        },
        {
          id: "sixDecisions",
          label: "Six Decisions (Why Us)",
          icon: FileText,
        },
      ],
    },
    {
      groupTitle: "SYSTEM & SETTINGS",
      items: [
        {
          id: "pageKeywords",
          label: "Page Keywords SEO",
          icon: Search,
          badge: "SEO",
          badgeVariant: "solid",
        },
        {
          id: "pageDescriptions",
          label: "Page Meta Descriptions",
          icon: FileText,
          badge: "SEO",
          badgeVariant: "solid",
        },
        {
          id: "layout",
          label: "Layout & SEO Meta",
          icon: Globe,
        },
        {
          id: "branding",
          label: "Branding & Logo",
          icon: Settings,
        },
        {
          id: "forms",
          label: "Form Titles & Modals",
          icon: FileText,
        },
        {
          id: "alerts",
          label: "Email Alerts",
          icon: Mail,
          badge: emailAlertsActive ? "ON" : "OFF",
          badgeVariant: emailAlertsActive ? "pulse" : "solid",
        },
        {
          id: "footer",
          label: "Footer & Contact",
          icon: MapPin,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-[#FAF5EE] border-r border-[#3B0D3B]/10 text-[#0B0B0F]">
      {/* 1. Header / Logo */}
      <div className="shrink-0 h-16 px-4 flex items-center justify-between border-b border-[#3B0D3B]/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 group transition-opacity hover:opacity-85"
        >
          <span className="text-xl font-black tracking-tight text-[#3B0D3B]">
            TREQO
          </span>
          {!isCollapsed && (
            <span className="rounded-md bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#3B0D3B] uppercase tracking-widest">
              HQ
            </span>
          )}
        </Link>

        {/* Mobile close button */}
        {isOpenMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#F5EDE0] rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden md:flex p-1.5 text-[#5A4A5A] hover:text-[#3B0D3B] hover:bg-[#F5EDE0] rounded-lg transition-colors cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* 2. Navigation Items List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8C6A8C]">
                {group.groupTitle}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer text-left",
                    isActive
                      ? "bg-[#3B0D3B]/8 text-[#3B0D3B]"
                      : "text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#F5EDE0]",
                    isCollapsed ? "justify-center px-2" : "justify-between"
                  )}
                >
                  {/* Subtle Plum Left Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-[#3B0D3B]" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-[#3B0D3B]" : "text-[#8C6A8C]"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="truncate leading-tight">{item.label}</span>
                    )}
                  </div>

                  {/* Badges / Counts */}
                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.count !== undefined && item.count > 0 && (
                        <span
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                            isActive
                              ? "bg-[#3B0D3B]/10 text-[#3B0D3B]"
                              : "bg-[#F5EDE0] text-[#5A4A5A]"
                          )}
                        >
                          {item.count}
                        </span>
                      )}

                      {item.badge && (
                        <span
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0.2 rounded uppercase",
                            item.badgeVariant === "pulse"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-[#F5EDE0] text-[#5A4A5A]"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. Bottom Admin Profile & Logout */}
      <div className="shrink-0 p-3 border-t border-[#3B0D3B]/10 bg-[#FDFAF6]">
        <div
          className={cn(
            "flex items-center justify-between gap-2",
            isCollapsed && "flex-col justify-center gap-3"
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-[#3B0D3B] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              A
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0B0B0F] truncate leading-tight">
                  Treqo Admin
                </p>
                <p className="text-[10px] text-[#8C6A8C] truncate leading-tight font-medium">
                  Headquarters
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 text-[#5A4A5A] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden md:block shrink-0 sticky top-0 h-screen transition-all duration-200 z-30",
          isCollapsed ? "w-[68px]" : "w-[245px]"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#180518]/40 backdrop-blur-xs animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative w-[260px] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
