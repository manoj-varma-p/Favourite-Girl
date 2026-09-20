import { cn } from "@/lib/utils";

const KEYWORDS = [
  "CONTENT STRATEGY",
  "CLIENT MANAGEMENT",
  "PERFORMANCE MARKETING",
  "META ADS & GOOGLE ADS",
  "GA4 & ATTRIBUTION",
  "AI & AUTOMATION",
  "MEDIA BUYING",
  "ROAS OPTIMIZATION",
  "CONVERSION RATE OPTIMIZATION",
  "RETENTION FUNNELS",
  "BRAND MANAGEMENT",
  "PRODUCT MARKETING",
  "SEARCH ENGINE OPTIMIZATION",
];

interface KeywordsTickerProps {
  className?: string;
}

export default function KeywordsTicker({ className }: KeywordsTickerProps) {
  // Duplicate array for a seamless, continuous loop
  const duplicatedKeywords = [...KEYWORDS, ...KEYWORDS, ...KEYWORDS];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative w-full overflow-hidden bg-[#0B0B0F] border-y border-[#5A2A5A]/30 py-2.5 sm:py-3 shadow-inner select-none",
        className
      )}
    >
      {/* Subtle left & right gradient fade masks for a polished edge effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24 bg-gradient-to-r from-[#0B0B0F] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24 bg-gradient-to-l from-[#0B0B0F] to-transparent" />

      {/* Marquee Track */}
      <div className="flex w-max animate-[marquee_45s_linear_infinite]">
        {duplicatedKeywords.map((keyword, index) => (
          <div
            key={`${keyword}-${index}`}
            className="flex items-center shrink-0 px-4 sm:px-6"
          >
            {/* Soft Champagne separator dot */}
            <span className="mr-4 sm:mr-6 h-1.5 w-1.5 rounded-full bg-[#FDFAF6] shadow-[0_0_8px_rgba(253,250,246,0.7)] shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#FDFAF6] uppercase">
              {keyword}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
