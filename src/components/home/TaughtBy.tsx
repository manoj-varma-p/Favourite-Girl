"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { tutors as staticTutors } from "@/data/home";
import type { TutorItem, MentorsSectionContent } from "@/lib/content-db";

const DEFAULT_TUTOR_PHOTOS: Record<string, string> = {
  "Mohit Goel": "/uploads/tutors/mohit-goel.jpg",
  "Deeptika Bajaj": "/uploads/tutors/deeptika-bajaj.jpg",
  "Megha Punjabi": "/uploads/tutors/megha-punjabi.jpg",
  "Akshat Aggarwal": "/uploads/tutors/akshat-aggarwal.jpg",
  "Prateek Narang": "/uploads/tutors/prateek-narang.jpg",
  "Ritika Sharma": "/uploads/tutors/ritika-sharma.jpg",
};

const TUTOR_INSIGHTS: Record<
  string,
  {
    specialty: string;
    focus: string;
    brandMetric: string;
  }
> = {
  "Mohit Goel": {
    specialty: "Funnel Economics & Scaling",
    focus: "Direct-response unit economics and turning raw campaign data into profitable spend.",
    brandMetric: "₹10Cr+ Ad Spend Managed",
  },
  "Deeptika Bajaj": {
    specialty: "Growth & Performance Marketing",
    focus: "Scaling paid acquisition on Meta & Google Ads without burning client margins.",
    brandMetric: "3.8x Avg ROAS Across Clients",
  },
  "Megha Punjabi": {
    specialty: "Enterprise Marketing & Brand",
    focus: "Enterprise positioning, high-LTV customer journeys, and retention architectures.",
    brandMetric: "Ex-Amex Growth Lead",
  },
  "Akshat Aggarwal": {
    specialty: "Attribution & Data-Driven Growth",
    focus: "Full-funnel attribution models, clean tracking setups, and defensible ROI reporting.",
    brandMetric: "Enterprise Analytics",
  },
  "Prateek Narang": {
    specialty: "Portfolio & Interview Defense",
    focus: "Defending campaign numbers out loud so hiring panels can't poke holes in your work.",
    brandMetric: "IIT Alum & Top Tech Mentor",
  },
  "Ritika Sharma": {
    specialty: "Brand Strategy & Conversion",
    focus: "High-growth brand positioning, conversion rate optimization, and organic distribution.",
    brandMetric: "500+ Funnels Audited",
  },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface TaughtByProps {
  tutors?: TutorItem[];
  sectionContent?: MentorsSectionContent;
}

export default function TaughtBy({ tutors: dynamicTutors, sectionContent }: TaughtByProps) {
  const displayTutors =
    dynamicTutors && dynamicTutors.length > 0 ? dynamicTutors : staticTutors;

  const eyebrow = sectionContent?.eyebrow || "PRACTITIONER MENTORSHIP";
  const title = sectionContent?.title || "Taught by people still doing the work.";
  const description =
    sectionContent?.description ||
    "Every tutor runs active accounts and active brands. When algorithms change on a Tuesday, your Wednesday session reflects it.";
  const highlightChips =
    sectionContent?.highlightChips && sectionContent.highlightChips.length > 0
      ? sectionContent.highlightChips
      : [
          "100% Active Account Operators",
          "1:1 Real Budget Defenses",
          "Verified Career Outcomes",
        ];
  const guaranteeHighlight = sectionContent?.guaranteeHighlight || "Zero Academic Theory:";
  const guaranteeText =
    sectionContent?.guaranteeText ||
    "Every mentor actively manages enterprise budgets, live client acquisition accounts, and direct-response campaigns.";

  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  function updateScrollState() {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cards = sliderRef.current.children;
    let closestIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const distance = Math.abs(card.offsetLeft - sliderRef.current.offsetLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    setActiveIndex(closestIndex);
  }

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  function scrollPrev() {
    if (!sliderRef.current) return;
    const firstCard = sliderRef.current.firstElementChild as HTMLElement;
    const step = firstCard ? firstCard.clientWidth + 24 : 320;
    sliderRef.current.scrollBy({ left: -step, behavior: "smooth" });
  }

  function scrollNext() {
    if (!sliderRef.current) return;
    const firstCard = sliderRef.current.firstElementChild as HTMLElement;
    const step = firstCard ? firstCard.clientWidth + 24 : 320;
    sliderRef.current.scrollBy({ left: step, behavior: "smooth" });
  }

  function scrollToCard(index: number) {
    if (!sliderRef.current) return;
    const card = sliderRef.current.children[index] as HTMLElement;
    if (card) {
      const offset = card.offsetLeft - sliderRef.current.offsetLeft;
      sliderRef.current.scrollTo({ left: offset, behavior: "smooth" });
    }
  }

  return (
    <section
      id="tutors"
      className="relative overflow-hidden bg-[#FDFAF6] pt-10 sm:pt-12 lg:pt-14 pb-6 sm:pb-8 lg:pb-10 scroll-mt-16 sm:scroll-mt-20 text-[#1A0A1A] border-b border-[#F5EDE0]"
    >
      <Container className="relative z-10">
        {/* Section Header */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12 lg:items-end">
          <div className="flex flex-col items-start lg:col-span-7">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#3B0D3B]">
              {eyebrow}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[2.85rem] font-black leading-[1.1] tracking-tight text-[#1A0A1A]">
              {title}
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base leading-relaxed text-[#5A4A5A] font-medium">
              {description}
            </p>
          </div>
        </div>

        {/* Feature Highlights Chips & Slider Navigation Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {highlightChips.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#3B0D3B]/15 bg-white/80 px-3.5 py-1 text-xs font-bold text-[#1A0A1A] shadow-2xs backdrop-blur-xs"
              >
                {idx === 0 ? (
                  <span className="h-2 w-2 rounded-full bg-[#0CA30C] animate-pulse" />
                ) : idx === 1 ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0CA30C]" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5 text-[#3B0D3B]" />
                )}
                {chip}
              </span>
            ))}
          </div>

          {/* Slider Prev/Next Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous mentors"
              onClick={scrollPrev}
              disabled={!canScrollLeft}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-[#3B0D3B]/20 bg-white shadow-xs transition-all cursor-pointer",
                canScrollLeft
                  ? "hover:border-[#3B0D3B] hover:bg-[#FAF5EE] text-[#1A0A1A] active:scale-95"
                  : "opacity-35 cursor-not-allowed text-[#1A0A1A]/40"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next mentors"
              onClick={scrollNext}
              disabled={!canScrollRight}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-[#3B0D3B]/20 bg-white shadow-xs transition-all cursor-pointer",
                canScrollRight
                  ? "hover:border-[#3B0D3B] hover:bg-[#FAF5EE] text-[#1A0A1A] active:scale-95"
                  : "opacity-35 cursor-not-allowed text-[#1A0A1A]/40"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────
            SLIDER: 4 CARDS PER VIEW ON DESKTOP, 2 ON TABLET, 1 ON MOBILE
           ──────────────────────────────────────────────────────────────── */}
        <div
          ref={sliderRef}
          className="mt-10 flex gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayTutors.map((tutor) => {
            const t = tutor as TutorItem;
            const photo =
              t.image?.trim() || DEFAULT_TUTOR_PHOTOS[t.name] || "";
            const insights = TUTOR_INSIGHTS[t.name] || {
              specialty: "Marketing Practitioner",
              focus: "Real-world brand projects, campaign budget defenses, and live performance auditing.",
              brandMetric: "Active Practitioner",
            };

            const brandMetric = t.brandMetric || insights.brandMetric;
            const focus = t.focus || insights.focus;
            const specialty = t.specialty || insights.specialty;
            const isLocked = Boolean(sectionContent?.isLocked || t.isLocked);

            return (
              <div
                key={tutor.name}
                className={cn(
                  "w-[85%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] shrink-0 snap-start group relative flex flex-col justify-between rounded-2xl border bg-white/90 p-5 sm:p-5.5 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                  isLocked
                    ? "border-amber-500/25 bg-[#FDFAF6]/90 hover:border-amber-500/40"
                    : "border-[#3B0D3B]/15 hover:border-[#3B0D3B]/35"
                )}
              >
                <div>
                  {/* Top: Portrait area */}
                  <div className="relative w-full aspect-[1/1] overflow-hidden rounded-xl border border-[#3B0D3B]/10 bg-[#F5EDE0]/50 shadow-inner">
                    {isLocked ? (
                      <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#2D0B2D] via-[#1A0A1A] to-[#0D050D] p-4 text-center">
                        {photo && (
                          <Image
                            src={photo}
                            alt="Faculty member coming soon"
                            fill
                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover object-top blur-md opacity-25 grayscale"
                          />
                        )}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white shadow-lg backdrop-blur-md">
                            <Lock className="h-5 w-5 text-amber-300" />
                          </div>
                          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-black/75 border border-white/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    ) : photo ? (
                      <Image
                        src={photo}
                        alt={tutor.name}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3B0D3B] to-[#1A1A1E] text-white text-3xl font-black">
                        {initials(tutor.name)}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="mt-4">
                    {isLocked ? (
                      <>
                        <div>
                          <h3 className="text-lg font-black text-[#1A0A1A] tracking-tight flex items-center gap-2">
                            <span>Faculty Profile</span>
                            <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                              Locked
                            </span>
                          </h3>
                          <p className="text-xs font-semibold text-[#5A4A5A] mt-0.5 truncate">
                            Practitioner Mentor · Announcing Soon
                          </p>
                        </div>

                        {/* Locked Credential Tag */}
                        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#3B0D3B]/25 bg-[#FAF5EE] px-2.5 py-1 text-[11px] font-bold text-[#3B0D3B]">
                          <Lock className="h-3 w-3 opacity-70" />
                          Revealed Before Launch
                        </div>

                        {/* Locked Placeholder Bio */}
                        <p className="mt-3 text-xs leading-relaxed text-[#5A4A5A]/80 italic font-medium line-clamp-3">
                          &ldquo;Active operator profile, brand credentials, and live project tracks will be unveiled prior to cohort start.&rdquo;
                        </p>
                      </>
                    ) : (
                      <>
                        <div>
                          <h3 className="text-lg font-black text-[#1A0A1A] tracking-tight group-hover:text-[#3B0D3B] transition-colors">
                            {tutor.name}
                          </h3>
                          <p className="text-xs font-semibold text-[#5A4A5A] mt-0.5 truncate">
                            {tutor.role}
                          </p>
                        </div>

                        {/* Verified Credential Tag */}
                        {brandMetric && (
                          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#3B0D3B]/15 bg-[#FAF5EE] px-2.5 py-1 text-[11px] font-black text-[#3B0D3B]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0CA30C]" />
                            {brandMetric}
                          </div>
                        )}

                        {/* Bio Focus Quote */}
                        {focus && (
                          <p className="mt-3 text-xs leading-relaxed text-[#5A4A5A] italic font-medium line-clamp-3">
                            &ldquo;{focus}&rdquo;
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-[#3B0D3B]/10 flex items-center justify-between text-xs text-[#5A4A5A] font-semibold">
                  {isLocked ? (
                    <>
                      <span className="truncate max-w-[140px] font-bold text-[#5A4A5A]/70 text-[11px]">
                        Classified Track
                      </span>
                      <span className="inline-flex items-center gap-1 text-amber-700 shrink-0 font-bold text-[11px]">
                        <Lock className="w-3 h-3 text-amber-600" />
                        Coming Soon
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="truncate max-w-[140px] font-bold text-[#3B0D3B]/80 text-[11px]">
                        {specialty}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#0CA30C] shrink-0 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot Indicators */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {displayTutors.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToCard(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                activeIndex === i ? "w-6 bg-[#3B0D3B]" : "w-1.5 bg-[#3B0D3B]/25 hover:bg-[#3B0D3B]/50"
              )}
            />
          ))}
        </div>

        {/* Bottom Guarantee Strip */}
        <div className="mt-7 sm:mt-8 rounded-2xl border border-white/15 bg-[#3B0D3B] p-3.5 sm:p-4 text-center shadow-md text-white">
          <p className="text-xs sm:text-sm font-medium text-[#F5EDE0]">
            <strong className="text-white font-black">{guaranteeHighlight}</strong> {guaranteeText}
          </p>
        </div>
      </Container>
    </section>
  );
}
