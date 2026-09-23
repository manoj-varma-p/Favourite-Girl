"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  Phone,
  GraduationCap,
  Zap,
  Building2,
  Rocket,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useApplyModal } from "@/context/ApplyModalContext";

interface CoursesMegaMenuProps {
  onClose: () => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const coursesData = [
  {
    id: "digital-marketing",
    title: "New Age Digital Marketing",
    href: "/categories/digital-marketing",
    badge: "BATCH 2 · OPEN",
    badgeColor: "bg-[#3B0D3B] text-[#FDFAF6]",
    duration: "4 months · Online",
    description: "The flagship. 12 phases, 30+ real brand projects, AI in the workflow.",
    icon: Rocket,
    iconColor: "text-[#3B0D3B]",
    isFlagship: true,
    isLocked: false,
  },
  {
    id: "fundamentals",
    title: "Fundamentals of Digital Marketing",
    href: "/categories/fundamentals",
    badge: "COMING SOON",
    badgeColor: "bg-[#1A1A1E] text-slate-300 border border-white/10",
    duration: "6 modules · Self-paced",
    description: "The door in. Learn what digital marketing is & how funnels work.",
    icon: BookOpen,
    iconColor: "text-[#8C6A8C]",
    isLocked: true,
  },
  {
    id: "4m-program",
    title: "New Age Digital Marketing (On Campus)",
    href: "/categories/4m-program",
    badge: "OPEN · ON-CAMPUS",
    badgeColor: "bg-[#5A2A5A]/20 text-[#FDFAF6] font-bold border border-[#5A2A5A]/40",
    duration: "4 months · On campus",
    description: "Full Stack Marketing On Campus Edition at our Madhapur studio floor.",
    icon: Building2,
    iconColor: "text-[#3B0D3B]",
    isLocked: false,
  },
  {
    id: "pgdm",
    title: "Treqo PGDM",
    href: "/categories/pgdm",
    badge: "COMING SOON",
    badgeColor: "bg-[#1A1A1E] text-slate-300 border border-white/10",
    duration: "12 months · Hybrid",
    description: "Post Graduate Diploma built for graduates targeting senior roles.",
    icon: GraduationCap,
    iconColor: "text-[#8C6A8C]",
    isLocked: true,
  },

  {
    id: "founder-semester",
    title: "The Founder Semester",
    href: "/categories/founder-semester",
    badge: "COMING SOON",
    badgeColor: "bg-[#1A1A1E] text-slate-300 border border-white/10",
    duration: "9 months · On campus",
    description: "Marketing & growth for founders launching or scaling ventures.",
    icon: Rocket,
    iconColor: "text-[#0CA30C]",
    isLocked: true,
  },
  {
    id: "performance-growth",
    title: "Performance & Growth Specialist",
    href: "/categories/performance-growth",
    badge: "COMING SOON",
    badgeColor: "bg-[#1A1A1E] text-slate-300 border border-white/10",
    duration: "3 months · Online",
    description: "Deep dive into Meta, Google Ads & full-funnel attribution.",
    icon: TrendingUp,
    iconColor: "text-rose-400",
    isLocked: true,
  },
];

export default function CoursesMegaMenu({ onClose, onNavClick }: CoursesMegaMenuProps) {
  const { openApplyModal, openCurriculumModal } = useApplyModal();
  const [courses, setCourses] = useState(coursesData);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses((prev) =>
            prev.map((c) => {
              const matched = data.courses.find(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (d: any) =>
                  d.id === c.id ||
                  d.href?.endsWith(`/${c.id}`) ||
                  (c.id === "digital-marketing" && (d.id === "digital-marketing" || d.id === "new-age-dm"))
              );
              if (!matched) return c;
              const isLocked = Boolean(matched.isLocked);
              return {
                ...c,
                isLocked,
                badge: isLocked ? "COMING SOON" : (matched.badge || "BATCH 2 · OPEN"),
                badgeColor: isLocked
                  ? "bg-[#1A1A1E] text-slate-300 border border-white/10"
                  : "bg-[#5A2A5A]/20 text-[#FDFAF6] font-bold border border-[#5A2A5A]/40",
              };
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  const flagship = courses[0];
  const otherCourses = courses.slice(1);

  return (
    <div
      role="region"
      aria-label="Courses Mega Menu"
      className="w-full border border-[#5A2A5A]/30 bg-[#0B0B0F] py-6 shadow-2xl rounded-2xl text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_3fr_1fr] lg:gap-8 items-stretch">
          {/* Column 1: Featured Flagship Course */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#5A2A5A]/30 bg-gradient-to-br from-[#3B0D3B]/90 via-[#1A1A1E] to-[#0B0B0F] p-5 shadow-lg">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full bg-[#5A2A5A] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#FDFAF6]">
                  <span>{flagship.badge}</span>
                </span>
                <span className="text-[11px] font-semibold text-[#8C6A8C]">{flagship.duration}</span>
              </div>

              <h3 className="mt-3 text-lg font-black tracking-tight text-white">
                {flagship.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                {flagship.description}
              </p>

              <div className="mt-4 flex flex-col gap-1.5 text-xs text-slate-200 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0CA30C] shrink-0" />
                  <span>30+ Real Brand Case Briefs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0CA30C] shrink-0" />
                  <span>100% Portfolio Graded Capstone</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href={flagship.href}
                onClick={(e) => {
                  onClose();
                  onNavClick(e, flagship.href);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FDFAF6]/90 hover:text-white transition-colors"
              >
                <span>View Full Curriculum</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openApplyModal(flagship.title);
                }}
                className="rounded-lg bg-[#5A2A5A] px-3.5 py-1.5 text-xs font-bold text-[#FDFAF6] hover:bg-[#3B0D3B] active:scale-95 transition-all cursor-pointer shadow-xs border border-[#8C6A8C]/30"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Column 2: All Other Learning Tracks */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  All Specialized Tracks
                </span>
                <span className="text-[11px] text-[#8C6A8C]">
                  Choose your stage
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {otherCourses.map((course) => {
                  const Icon = course.icon;
                  return course.isLocked ? (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        openApplyModal(course.title);
                      }}
                      className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition-all hover:border-white/20 hover:bg-white/[0.08] cursor-pointer"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1A1A1E] border border-white/10 shadow-xs">
                        <Icon className="h-4 w-4 text-[#8C6A8C]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-xs font-bold text-white transition-colors">
                            {course.title}
                          </p>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded bg-black/60 border border-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-400">
                            <Clock className="h-2.5 w-2.5" />
                            {course.badge}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <Link
                      key={course.id}
                      href={course.href}
                      onClick={(e) => {
                        onClose();
                        onNavClick(e, course.href);
                      }}
                      className="group flex items-start gap-3 rounded-xl border border-[#5A2A5A]/40 bg-[#1A1A1E]/90 p-3 transition-all hover:border-[#8C6A8C]/50 hover:bg-[#2A2A2D] cursor-pointer"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B0B0F] border border-white/10 shadow-xs">
                        <Icon className="h-4 w-4 text-[#8C6A8C]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-xs font-bold text-white transition-colors">
                            {course.title}
                          </p>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="rounded bg-[#5A2A5A]/30 border border-[#5A2A5A]/60 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#FDFAF6]">
                            {course.badge}
                          </span>
                          <span className="text-[10px] text-slate-300 truncate">
                            {course.duration}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                Want personalized course advice?
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openApplyModal();
                }}
                className="text-xs font-bold text-[#FDFAF6] hover:text-[#8C6A8C] transition-colors cursor-pointer"
              >
                Talk to an advisor →
              </button>
            </div>
          </div>

          {/* Column 3: Admissions & Syllabus Sidebar */}
          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#0B0B0F] via-[#1A1A1E] to-[#3B0D3B]/40 p-5 text-white shadow-md border border-[#5A2A5A]/30">
            <div>
              <span className="inline-flex items-center rounded-full bg-[#5A2A5A]/40 border border-[#8C6A8C]/30 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[#FDFAF6]">
                Admissions Open
              </span>

              <h4 className="mt-3 text-base font-black tracking-tight text-white leading-snug">
                Batch 2 Admissions Now Enrolling
              </h4>

              <ul className="mt-3.5 space-y-2 text-xs text-white/85">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0CA30C] shrink-0" />
                  <span>Live CEO Challenge Capstone</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0CA30C] shrink-0" />
                  <span>1-on-1 Mentor Evaluation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0CA30C] shrink-0" />
                  <span>Verified Career Portfolio</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 border-t border-white/15 pt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openApplyModal();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B0D3B] border border-[#5A2A5A] py-2.5 text-xs font-black text-[#FDFAF6] shadow-md hover:bg-[#5A2A5A] active:scale-95 transition-all cursor-pointer"
              >
                <span>Apply for Batch 2</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openCurriculumModal(flagship.title, "/curriculum/new-age-digital-marketing-curriculum.pdf");
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-2 text-xs font-semibold text-white/90 hover:bg-white/15 transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Syllabus (PDF)</span>
              </button>

              <a
                href="tel:+919948000491"
                className="mt-1 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="h-3 w-3 text-[#0CA30C]" />
                <span>Admissions: +91 99480 00491</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
