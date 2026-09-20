"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronLeft, ChevronRight, Check, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { useApplyModal } from "@/context/ApplyModalContext";
import { cn } from "@/lib/utils";

interface ProgramCard {
  id: string;
  image: string;
  previewLabel: string;
  badge: {
    text: string;
    variant: "blue" | "emerald" | "gray" | "amber";
  };
  meta: string;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  tags: string[];
  isLocked?: boolean;
}

const defaultPrograms: ProgramCard[] = [
  {
    id: "digital-marketing",
    image: "/images/course1.png",
    previewLabel: "CLASSROOM · CEO CHALLENGE REVIEW",
    badge: { text: "BATCH 2 · OPEN", variant: "blue" },
    meta: "4 months · Online",
    title: "New Age Digital Marketing",
    description:
      "The flagship. 12 phases, 30+ real brand projects, AI in the workflow from phase one. Batch 2 starts Sep 2026.",
    actionText: "View course →",
    actionHref: "/categories/digital-marketing",
    tags: ["All", "Flagship"],
    isLocked: false,
  },
  {
    id: "fundamentals",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    previewLabel: "SELF-PACED MODULE SCREEN",
    badge: { text: "COMING SOON", variant: "gray" },
    meta: "6 modules · Self-paced",
    title: "Fundamentals of Digital Marketing",
    description:
      "The door in. What digital marketing is, how funnels behave, and what to settle before you pay for anything.",
    actionText: "Get notified →",
    actionHref: "/categories/fundamentals",
    tags: ["All", "Short", "Students"],
    isLocked: true,
  },
  {
    id: "4m-program",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    previewLabel: "MADHAPUR STUDIO FLOOR",
    badge: { text: "OPEN · ON-CAMPUS", variant: "blue" },
    meta: "4 months · On campus",
    title: "New Age Digital Marketing (On Campus)",
    description:
      "Full Stack Marketing On Campus Edition. Brand strategy through performance in four months on our Madhapur studio floor.",
    actionText: "View course →",
    actionHref: "/categories/4m-program",
    tags: ["All", "Short", "Flagship"],
    isLocked: false,
  },
  {
    id: "pgdm",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    previewLabel: "COHORT SESSION",
    badge: { text: "COMING SOON", variant: "gray" },
    meta: "12 months · Hybrid",
    title: "Treqo PGDM in Modern Marketing",
    description:
      "Post Graduate Diploma in New Age Marketing. Built for graduates ready for senior marketing roles.",
    actionText: "Get notified →",
    actionHref: "/categories/pgdm",
    tags: ["All", "PG"],
    isLocked: true,
  },
  {
    id: "campus-edition",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    previewLabel: "STUDENT AT DESK",
    badge: { text: "COMING SOON", variant: "gray" },
    meta: "4 months · Online",
    title: "Campus Edition",
    description:
      "The flagship, timed to run alongside a BBA or MBA without colliding with your semester exams.",
    actionText: "Get notified →",
    actionHref: "/categories/campus-edition",
    tags: ["All", "Students"],
    isLocked: true,
  },
  {
    id: "founder-semester",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    previewLabel: "FOUNDER PITCH SESSION",
    badge: { text: "COMING SOON", variant: "gray" },
    meta: "4 months · Online",
    title: "The Founder Semester",
    description:
      "Marketing and entrepreneurship for people who want to launch, scale, or run their own venture.",
    actionText: "Get notified →",
    actionHref: "/categories/founder-semester",
    tags: ["All", "Short", "Flagship"],
    isLocked: true,
  },
  {
    id: "performance-growth",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    previewLabel: "LIVE MEDIA DASHBOARD",
    badge: { text: "COMING SOON", variant: "gray" },
    meta: "3 months · Online",
    title: "Performance & Growth Specialist",
    description:
      "Deep dive into Meta, Google Ads, and attribution models for direct response growth.",
    actionText: "Get notified →",
    actionHref: "/categories/performance-growth",
    tags: ["All", "Short"],
    isLocked: true,
  },
];

import type { CourseItem } from "@/lib/content-db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCourseToProgramCard(c: any): ProgramCard {
  const isLocked = Boolean(c.isLocked);
  const actionText = isLocked
    ? "Get notified →"
    : (c.actionText && !c.actionText.toLowerCase().includes("notif") ? c.actionText : "View course →");
  const targetHref = c.actionHref || c.href || `/categories/${c.id}`;

  return {
    id: c.id,
    image:
      c.image ||
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    previewLabel: c.previewLabel || "",
    badge: {
      text: isLocked ? "COMING SOON" : (c.badge === "COMING SOON" ? "BATCH 2 · OPEN" : (c.badge || "BATCH 2 · OPEN")),
      variant: (["blue", "amber", "gray", "emerald"].includes(c.badgeVariant || "") ? (c.badgeVariant as "blue" | "amber" | "gray" | "emerald") : "emerald") || (isLocked ? "gray" : "blue"),
    },
    meta: c.meta || c.duration || "4 months · Online",
    title: c.title,
    description: c.description,
    actionText,
    actionHref: targetHref,
    tags: Array.isArray(c.tags) && c.tags.length > 0 ? c.tags : ["All"],
    isLocked,
  };
}

const COURSE_POINTS_MAP: Record<string, string[]> = {
  "digital-marketing": [
    "12 Structured phases with live agency execution",
    "30+ Real brand projects & active spend budgets",
    "AI integrated into workflow from Phase 1",
  ],
  fundamentals: [
    "Core digital marketing & funnel mechanics",
    "Search intent vs. social discovery systems",
    "Pre-spend economics & unit economics checklist",
  ],
  "4m-program": [
    "Full-stack immersion on Madhapur studio floor",
    "Real client deliverables & campaign audits",
    "Direct 1:1 mentorship with agency founders",
  ],
  pgdm: [
    "12-Month executive modern marketing diploma",
    "Advanced media mix modeling & enterprise attribution",
    "Direct leadership placement pipeline",
  ],
  "campus-edition": [
    "Engineered to run alongside BBA / MBA schedules",
    "Live brand portfolio before graduation",
    "Zero collision with semester exam calendars",
  ],
  "founder-semester": [
    "Zero-to-one CAC, LTV & unit economics playbooks",
    "Investor-ready growth thesis & GTM sprints",
    "Direct mentorship on venture scaling",
  ],
  "performance-growth": [
    "Meta Ads & Google PMax ₹10L+ monthly scaling",
    "Multi-touch attribution models & GA4 custom setups",
    "Creative testing SOPs & teardown audits",
  ],
};

function getCourseHighlights(program: ProgramCard): string[] {
  if (COURSE_POINTS_MAP[program.id]) {
    return COURSE_POINTS_MAP[program.id];
  }
  if (!program.description) {
    return ["Hands-on industry projects", "Live cohort mentorship", "Portfolio certification"];
  }
  const sentences = program.description
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  if (sentences.length >= 2) {
    return sentences.slice(0, 3);
  }

  const clauses = program.description
    .split(/[,;]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  if (clauses.length >= 2) {
    return clauses.slice(0, 3);
  }

  return [program.description];
}

function parseCourseMeta(program: ProgramCard) {
  let duration = "4 months";
  let mode = "Online";

  if (program.meta && typeof program.meta === "string") {
    const parts = program.meta.split(/[·•|]/).map((s) => s.trim());
    if (parts.length >= 2) {
      duration = parts[0] || "4 months";
      mode = parts[1] || "Online";
    } else if (parts.length === 1 && parts[0]) {
      duration = parts[0];
    }
  }

  return { duration, mode };
}

interface LearningSystemProps {
  initialPrograms?: CourseItem[];
}

export default function LearningSystem({ initialPrograms }: LearningSystemProps = {}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [courseList, setCourseList] = useState<ProgramCard[]>(() => {
    if (initialPrograms && initialPrograms.length > 0) {
      return initialPrograms.map(mapCourseToProgramCard);
    }
    return defaultPrograms;
  });
  const { openApplyModal } = useApplyModal();

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    fetch("/api/programs")
      .then((res) => res.json())
      .then((data) => {
        if (data.programs && Array.isArray(data.programs) && data.programs.length > 0) {
          setCourseList(data.programs.map(mapCourseToProgramCard));
        }
      })
      .catch((err) => {
        console.warn("Using fallback program list:", err);
      });
  }, []);

  const filterCategories = Array.from(
    new Set(["All", ...courseList.flatMap((p) => p.tags || [])])
  ).slice(0, 8);

  const filteredPrograms =
    activeFilter === "All"
      ? courseList
      : courseList.filter((p) => p.tags.includes(activeFilter));

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [checkScrollButtons, filteredPrograms]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const firstCard = container.querySelector<HTMLElement>("[data-course-card]");
    const cardStride = firstCard ? firstCard.offsetWidth + 24 : 360;

    const currentScroll = container.scrollLeft;
    const currentIndex = Math.round(currentScroll / cardStride);
    const targetIndex =
      direction === "left"
        ? Math.max(0, currentIndex - 1)
        : currentIndex + 1;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetLeft = Math.max(0, Math.min(maxScroll, targetIndex * cardStride));

    container.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
    setTimeout(checkScrollButtons, 350);
  };

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
    setTimeout(checkScrollButtons, 200);
  };

  return (
    <section id="courses" className="bg-[#FDFAF6] pt-14 sm:pt-18 lg:pt-20 pb-4 sm:pb-6 lg:pb-8 scroll-mt-20 overflow-hidden text-[#1A0A1A]">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col items-start max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black leading-[1.12] tracking-tight text-[#1A0A1A]">
            Seven Programs.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Choose the course that matches your vision.
          </p>
        </div>

        {/* Carousel Container with Arrows Beside Course Blocks */}
        <div className="relative mt-7 sm:mt-9 group/carousel -mx-2 sm:-mx-6 lg:-mx-12 px-9 sm:px-14 lg:px-14">
          {/* Left Arrow Navigation Button - Beside course blocks, only shows after user scrolls right */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              aria-label="Previous courses"
              className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-30 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-slate-300 bg-white text-[#3B0D3B] shadow-xl hover:bg-slate-50 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
            </button>
          )}

          {/* Right Arrow Navigation Button - Beside course blocks, visible at first */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              aria-label="Next courses"
              className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-30 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-slate-300 bg-white text-[#3B0D3B] shadow-xl hover:bg-slate-50 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
            </button>
          )}

          {/* Side-by-Side Courses Carousel */}
          <div
            ref={carouselRef}
            onScroll={checkScrollButtons}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredPrograms.map((program) => {
              const points = getCourseHighlights(program);
              const { duration, mode } = parseCourseMeta(program);

              return (
                <div
                  key={program.id}
                  id={`course-${program.id}`}
                  data-course-card
                  className={cn(
                    "w-[285px] sm:w-[calc((100%-24px)/2.2)] md:w-[calc((100%-48px)/2.7)] lg:w-[calc((100%-72px)/3.5)] xl:w-[calc((100%-72px)/3.5)] shrink-0 snap-start group flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-300 scroll-mt-28",
                    program.isLocked
                      ? "border-slate-200 bg-slate-50/80"
                      : "border-slate-200 bg-white hover:border-[#AAAAAA] shadow-sm hover:shadow-xl"
                  )}
                >
                  {/* Card Image Header with Badge Overlay */}
                  {program.isLocked ? (
                    <div
                      onClick={() => openApplyModal(program.title)}
                      className="relative h-44 sm:h-48 lg:h-52 w-full overflow-hidden bg-slate-900 cursor-pointer shrink-0"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openApplyModal(program.title); }}
                    >
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        sizes="(max-width: 640px) 300px, 420px"
                        className="h-full w-full object-cover transition-transform duration-500 opacity-60 grayscale-[40%]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Batch / Status Badge Overlay on Image (Top Right) */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] font-black tracking-wide text-slate-200 uppercase shadow-md">
                          <Clock className="h-2.5 w-2.5" />
                          <span>COMING SOON</span>
                        </span>
                      </div>

                      {/* Coming Soon Overlay */}
                      {/* <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1.5px] flex items-center justify-center">
                        <div className="flex items-center gap-1.5 rounded-full bg-slate-900/90 border border-slate-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md">
                          <Clock className="h-3.5 w-3.5 text-slate-300" />
                          <span>Coming Soon</span>
                        </div>
                      </div> */}
                    </div>
                  ) : (
                    <Link
                      href={program.actionHref}
                      className="relative h-44 sm:h-48 lg:h-52 w-full overflow-hidden bg-slate-900 block group/img shrink-0"
                      title={`View ${program.title} course`}
                    >
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        sizes="(max-width: 640px) 300px, 420px"
                        className="h-full w-full object-cover transition-transform duration-500 opacity-90 group-hover:opacity-100 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Batch Badge Overlay on Image (Top Right) */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center rounded-lg bg-[#3B0D3B] border border-white/25 px-2.5 py-1 text-[10px] font-black tracking-wide text-white uppercase shadow-md backdrop-blur-md">
                          {program.badge.text}
                        </span>
                      </div>
                    </Link>
                  )}

                  {/* Card Content */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Highlighted Title with consistent equal height alignment */}
                      <div className=" flex items-start">
                        <h3 className="text-base sm:text-lg font-black tracking-tight text-[#1A0A1A] group-hover:text-[#5A2A5A] transition-colors leading-snug line-clamp-2">
                          {program.isLocked ? (
                            <button
                              type="button"
                              onClick={() => openApplyModal(program.title)}
                              className="text-left font-black text-[#1A0A1A] hover:text-[#5A2A5A] transition-colors cursor-pointer"
                            >
                              {program.title}
                            </button>
                          ) : (
                            <Link
                              href={program.actionHref}
                              className="font-black text-[#1A0A1A] hover:text-[#5A2A5A] transition-colors"
                            >
                              {program.title}
                            </Link>
                          )}
                        </h3>
                      </div>

                      {/* Duration and Mode Section */}
                      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50/90 p-2.5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Duration
                          </span>
                          <span className="mt-0.5 text-xs sm:text-[13px] font-black text-[#3B0D3B]">
                            {duration}
                          </span>
                        </div>
                        <div className="flex flex-col border-l border-slate-200 pl-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Mode
                          </span>
                          <span className="mt-0.5 text-xs sm:text-[13px] font-black text-[#3B0D3B]">
                            {mode}
                          </span>
                        </div>
                      </div>

                      {/* Points with checkmarks */}
                      <ul className="mt-3.5 space-y-2.5">
                        {points.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3B0D3B]/10 text-[#3B0D3B]">
                              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                            </span>
                            <span className="text-xs sm:text-[13px] leading-snug font-medium text-slate-700">
                              {pt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Block: Action Button */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                      {program.isLocked ? (
                        <button
                          type="button"
                          onClick={() => openApplyModal(program.title)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs sm:text-[13px] font-bold text-slate-700 hover:bg-slate-50 hover:text-[#3B0D3B] transition-all cursor-pointer active:scale-[0.98]"
                        >
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          <span>Get notified when open</span>
                        </button>
                      ) : (
                        <Link
                          href={program.actionHref}
                          className="glossy-shine w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#3B0D3B] hover:bg-[#2B052B] py-2 px-3 text-xs sm:text-[13px] font-bold text-white shadow-md shadow-[#3B0D3B]/20 hover:shadow-lg transition-all active:scale-[0.98] group/btn"
                        >
                          <span>View course</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
