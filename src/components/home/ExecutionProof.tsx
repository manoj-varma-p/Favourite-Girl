"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ExecutionProofContent } from "@/lib/content-db";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const DEFAULT_ALUMNI_PHOTOS: Record<string, string> = {
  "Somu Shekar": "/uploads/alumni/somu-shekar.jpg",
  "Subhani": "/uploads/alumni/subhani.jpg",
  "Dikshtha": "/uploads/alumni/dikshtha.jpg",
  "Harshit": "/uploads/alumni/harshit.jpg",
};

const defaultOutcomes = [
  {
    tag: "FOUNDER",
    name: "Somu Shekar",
    description: "Never went job-hunting. Co-founded Gesture Co while still in the course.",
    photoUrl: "/uploads/alumni/somu-shekar.jpg",
  },
  {
    tag: "FOUNDER",
    name: "Subhani",
    description: "Turned his capstone into a company. Founded JASS Media.",
    photoUrl: "/uploads/alumni/subhani.jpg",
  },
  {
    tag: "PLACED IN 30 DAYS",
    name: "Dikshtha",
    description: "At Bristle Tech within a month of finishing.",
    photoUrl: "/uploads/alumni/dikshtha.jpg",
  },
  {
    tag: "HIRED ON PORTFOLIO",
    name: "Harshit",
    description: "Placed at TCS on the strength of the work, not the résumé.",
    photoUrl: "/uploads/alumni/harshit.jpg",
  },
];

const defaultCompanies = [
  {
    name: "Gesture Co",
    logo: "/images/dark-gesture.png",
  },
  {
    name: "JASS Media",
    logo: "/images/dark-jass-media.png",
  },
  {
    name: "Bristle Tech",
    logo: "/images/dark-bristletech.png",
  },
];

export default function ExecutionProof({ content }: { content?: ExecutionProofContent }) {
  const outcomes = content?.outcomes && content.outcomes.length > 0 ? content.outcomes : defaultOutcomes;
  const rawCompanies = content?.companies && content.companies.length > 0 ? content.companies : defaultCompanies;
  const companies = rawCompanies.filter((c) => c.name !== "TCS");
  const eyebrow = content?.eyebrow || "BATCH 1 · ALREADY HAPPENED";
  const title = content?.title || "Four names. All checkable.";
  const description = content?.description || "One batch is a small sample and we won't dress it up as an industry statistic. What we will say: every outcome below is a person you can look up.";
  const metrics = content?.metrics && content.metrics.length > 0 ? content.metrics : [
    { value: "100%", label: "of Batch 1 placed or founding" },
    { value: "₹5L+", label: "earned for a client, mid-course" },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isInteracting = useRef(false);
  const interactionTimer = useRef<NodeJS.Timeout | null>(null);

  function scrollToCard(index: number) {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.children;
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  }

  function handleTouchStart() {
    isInteracting.current = true;
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
  }

  function handleTouchEnd() {
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
    interactionTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 2500);
  }

  function handleScroll() {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cards = container.children;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const distance = Math.abs(card.offsetLeft - container.offsetLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    setActiveIndex(closestIndex);
  }

  // Auto-scroll every 2 seconds in a continuous loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (isInteracting.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % outcomes.length;
        scrollToCard(next);
        return next;
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      if (interactionTimer.current) clearTimeout(interactionTimer.current);
    };
  }, [outcomes.length]);

  return (
    <section id="placements" className="relative overflow-hidden bg-[#FDFAF6] pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12 scroll-mt-16 sm:scroll-mt-20 text-[#1A0A1A] border-b border-[#F5EDE0]">
      {/* Graph Paper Grid Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 13, 59, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 13, 59, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "15px 15px",
        }}
      />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12 lg:items-end">
          <div className="flex flex-col items-start lg:col-span-7">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#3B0D3B]">
              {eyebrow}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[3rem] font-black leading-[1.1] tracking-tight text-[#1A0A1A]">
              {title}
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base leading-relaxed text-[#5A4A5A] font-medium">
              {description}
            </p>
          </div>
        </div>

        {/* Mobile: Sideways finger scroll + 2s auto-loop with settled cards */}
        <div className="sm:hidden mt-8">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {outcomes.map((item) => {
              const photo = item.photoUrl?.trim() || DEFAULT_ALUMNI_PHOTOS[item.name] || "";
              return (
                <div
                  key={item.name}
                  className="w-[240px] shrink-0 snap-start flex flex-col justify-between rounded-2xl border border-[#3B0D3B]/15 bg-white/80 backdrop-blur-xs p-3.5 shadow-sm"
                >
                  <div>
                    {/* Photo Block */}
                    <div className="relative w-full aspect-[4/4.5] overflow-hidden rounded-xl border border-[#3B0D3B]/10 bg-[#F5EDE0]/50 shadow-inner">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={item.name}
                          fill
                          sizes="240px"
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#3B0D3B] via-[#5A2A5A] to-[#1A1A1E] text-white p-3">
                          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-lg font-black text-white backdrop-blur-sm shadow-md">
                            {initials(item.name)}
                          </span>
                          <span className="mt-2 text-[9px] font-bold uppercase tracking-widest text-[#FDFAF6]">
                            Batch 1
                          </span>
                        </div>
                      )}
                      {/* Tag badge floating neatly on photo */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="inline-flex items-center rounded-md bg-[#3B0D3B]/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#FDFAF6] backdrop-blur-md shadow-xs border border-white/10">
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-3">
                      <h3 className="text-base font-black text-[#1A0A1A] leading-snug">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#5A4A5A] line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer badge */}
                  <div className="mt-3 pt-2.5 border-t border-[#012A22]/10 flex items-center justify-between text-[10px] text-[#012A22]/70 font-bold">
                    <span className="inline-flex items-center gap-1 text-[#3B796A]">
                      ✓ Checkable
                    </span>
                    <span className="uppercase text-slate-500 tracking-wider">
                      Batch 1
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot Indicators */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {outcomes.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollToCard(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                  activeIndex === i ? "w-6 bg-[#3B0D3B]" : "w-1.5 bg-[#3B0D3B]/25"
                )}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Settled Profile Cards */}
        <div className="hidden sm:grid mt-10 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {outcomes.map((item) => {
            const photo = item.photoUrl?.trim() || DEFAULT_ALUMNI_PHOTOS[item.name] || "";
            return (
              <div
                key={item.name}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#3B0D3B]/15 bg-white/75 backdrop-blur-xs p-4 sm:p-5 shadow-xs transition-all duration-300 hover:shadow-xl hover:border-[#3B0D3B]/35 hover:bg-white/95 hover:-translate-y-1"
              >
                <div>
                  {/* Framed Photo Block - settled with natural proportions */}
                  <div className="relative w-full aspect-[4/4.5] overflow-hidden rounded-xl border border-[#3B0D3B]/10 bg-[#F5EDE0]/50 shadow-inner">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 160px, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#3B0D3B] via-[#5A2A5A] to-[#1A1A1E] text-white p-4">
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-15"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                            backgroundSize: "16px 16px",
                          }}
                        />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <span className="flex h-16 w-16 lg:h-18 lg:w-18 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-xl font-black text-white backdrop-blur-sm shadow-md">
                            {initials(item.name)}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FDFAF6]">
                            Batch 1 Alumni
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Floating Tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center rounded-md bg-[#3B0D3B]/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#FDFAF6] backdrop-blur-md shadow-xs border border-white/10">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4">
                    <h3 className="text-lg font-black text-[#1A0A1A] tracking-tight group-hover:text-[#5A2A5A] transition-colors">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-[#5A4A5A] font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Verified checkable footer line */}
                <div className="mt-4 pt-3 border-t border-[#3B0D3B]/10 flex items-center justify-between text-[11px] text-[#5A4A5A] font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#0CA30C]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Checkable
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#3B0D3B]/50">
                    Batch 1
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Metrics & Where Batch 1 Went Block - Logo Color Gradient with Rounded Edges */}
        <div className="relative mt-8 sm:mt-10 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-r from-[#2F0A2F] via-[#521452] to-[#2A062A] px-6 py-5 sm:px-8 sm:py-6 lg:px-8 lg:py-6 shadow-2xl text-white">
          {/* Ambient soft glow overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 20% 30%, rgba(147, 51, 147, 0.35) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 85% 70%, rgba(90, 24, 90, 0.3) 0%, transparent 70%)",
            }}
          />
          {/* Luminous top border accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
          {/* Inset shadow vignette along the edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl shadow-[inset_0_0_35px_rgba(0,0,0,0.45)]"
          />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 lg:items-center">
            {/* Left Metrics */}
            <div className="flex flex-wrap items-center gap-8 sm:gap-12 lg:col-span-5">
              {metrics.map((m, idx) => (
                <div key={idx}>
                  <span className="block text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {m.value}
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm text-[#E8D8E8] font-medium leading-snug">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Right: Where Batch 1 Went Blocks with Icons */}
            <div className="lg:col-span-7">
              <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#E8C5E8] mb-3">
                WHERE BATCH 1 WENT
              </span>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {companies.map((item) => {
                  const logoSrc =
                    item.logo === "/images/gesture.png"
                      ? "/images/dark-gesture.png"
                      : item.logo === "/images/jass-media.png"
                        ? "/images/dark-jass-media.png"
                        : item.logo === "/images/bristletech.png"
                          ? "/images/dark-bristletech.png"
                          : item.logo;

                  return (
                    <div
                      key={item.name}
                      title={item.name}
                      className="group relative flex h-14 items-center justify-center rounded-xl border border-white/20 bg-white/95 px-3 py-2 shadow-sm transition-all duration-200 hover:border-white hover:bg-white hover:shadow-lg hover:scale-102 cursor-pointer"
                    >
                      <Image
                        src={logoSrc}
                        alt={item.name}
                        width={160}
                        height={48}
                        className={cn(
                          "max-h-9 sm:max-h-10 w-auto max-w-[90%] object-contain transition-transform duration-200 group-hover:scale-110",
                          item.name !== "TCS" && !logoSrc.includes("dark-") && "brightness-0 opacity-80"
                        )}
                      />
                      {/* Tooltip on hover */}
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-[#3B0D3B] opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 z-10">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
