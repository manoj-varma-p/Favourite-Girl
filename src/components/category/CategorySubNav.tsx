"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

interface CategorySubNavProps {
  tabs: { id: string; label: string }[];
  applyHref?: string;
}

export default function CategorySubNav({ tabs }: CategorySubNavProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navRef = useRef<HTMLElement | null>(null);
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll spy: highlight active tab based on visual dominance in the viewport
  useEffect(() => {
    const getSections = () =>
      tabs
        .map((tab) => document.getElementById(tab.id))
        .filter((el): el is HTMLElement => el !== null);

    let ticking = false;

    function handleScroll() {
      // Don't fight smooth scroll triggered by programmatic tab clicks
      if (isClickScrollingRef.current) return;

      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = getSections();
          if (sections.length === 0) {
            ticking = false;
            return;
          }

          // Check if user is at the bottom of the page (activate last section)
          const isAtBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 60;

          if (isAtBottom) {
            setActiveId(sections[sections.length - 1].id);
            ticking = false;
            return;
          }

          // Sticky header height offset: ~104px on mobile, ~124px on desktop
          const headerHeight = window.innerWidth >= 1024 ? 124 : 104;
          const viewportTop = headerHeight;
          const viewportBottom = window.innerHeight;
          // Reading focal line in upper-middle of active viewable area
          const idealFocusY = viewportTop + (viewportBottom - viewportTop) * 0.32;

          let bestId = sections[0].id;
          let bestScore = -Infinity;

          for (const section of sections) {
            const rect = section.getBoundingClientRect();
            const vTop = Math.max(rect.top, viewportTop);
            const vBottom = Math.min(rect.bottom, viewportBottom);
            const vHeight = vBottom - vTop;

            if (vHeight > 0) {
              const vCenter = (vTop + vBottom) / 2;
              const dist = Math.abs(vCenter - idealFocusY);
              // Prioritize sections occupying the reading focus area
              const score = vHeight - dist * 0.7;

              if (score > bestScore) {
                bestScore = score;
                bestId = section.id;
              }
            }
          }

          setActiveId(bestId);
          ticking = false;
        });
        ticking = true;
      }
    }

    // Immediately unlock programmatic click scroll lock if user touches/wheels
    function handleUserTouch() {
      isClickScrollingRef.current = false;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleUserTouch, { passive: true });
    window.addEventListener("wheel", handleUserTouch, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("touchstart", handleUserTouch);
      window.removeEventListener("wheel", handleUserTouch);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [tabs]);

  // Smoothly center only the active pill inside the horizontal nav bar without jitter
  useEffect(() => {
    const nav = navRef.current;
    const tab = tabRefs.current[activeId ?? ""];
    if (!nav || !tab) return;

    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    // If the tab is already comfortably visible, don't move the container
    const isComfortablyVisible =
      tabRect.left >= navRect.left + 16 &&
      tabRect.right <= navRect.right - 16;

    if (!isComfortablyVisible) {
      const targetScrollLeft =
        nav.scrollLeft +
        (tabRect.left - navRect.left) -
        nav.clientWidth / 2 +
        tabRect.width / 2;

      nav.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
  }, [activeId]);

  function handleTabClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    // Immediately update active tab for responsiveness
    setActiveId(id);
    isClickScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const headerOffset = window.innerWidth >= 1024 ? 122 : 102;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });

    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 600);
  }

  return (
    <div className="sticky top-14 lg:top-[72px] z-30 border-y border-[#4A164A] bg-[#3B0D3B]/95 backdrop-blur-md shadow-md">
      <Container className="relative flex items-center">
        {/* Mobile Left & Right edge gradient fades for horizontal scroll hints */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-4 bg-gradient-to-r from-[#3B0D3B] to-transparent sm:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-4 bg-gradient-to-l from-[#3B0D3B] to-transparent sm:hidden"
        />

        <nav
          ref={navRef}
          aria-label="Program sections"
          className="scrollbar-hide relative flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-2.5 sm:gap-7 sm:py-3.5 overscroll-x-contain"
        >
          {tabs.map((tab) => {
            const isActive = activeId === tab.id;
            return (
              <a
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                href={`#${tab.id}`}
                onClick={(event) => handleTabClick(event, tab.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "shrink-0 select-none whitespace-nowrap text-xs sm:text-sm font-semibold transition-all duration-200",
                  // Mobile pill style
                  "rounded-full px-3 py-1.5 sm:rounded-none sm:px-0 sm:py-0 sm:border-b-2 sm:pb-1",
                  isActive
                    ? "bg-white text-[#3B0D3B] font-bold shadow-xs sm:bg-transparent sm:text-white sm:border-white sm:shadow-none"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white sm:bg-transparent sm:border-transparent sm:hover:bg-transparent sm:text-white/70 sm:hover:text-white"
                )}
              >
                {tab.label}
              </a>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}
