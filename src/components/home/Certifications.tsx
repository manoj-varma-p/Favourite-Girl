import React from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import type { CertificationsContent, CertItem } from "@/lib/content-db";

/* ─────────────────────────────────────────────
   CERTIFICATE DATA, grouped by provider
───────────────────────────────────────────── */

const semrush: CertItem[] = [
  { name: "PPC Fundamentals",   provider: "SEMrush", color: "#FF642D" },
  { name: "SEO Fundamentals",   provider: "SEMrush", color: "#FF642D" },
  { name: "Social Media",       provider: "SEMrush", color: "#FF642D" },
  { name: "Content Marketing",  provider: "SEMrush", color: "#FF642D" },
];

const hubspot: CertItem[] = [
  { name: "SEO Certification",      provider: "HubSpot", color: "#FF7A59" },
  { name: "Digital Marketing",      provider: "HubSpot", color: "#FF7A59" },
  { name: "Social Media Marketing", provider: "HubSpot", color: "#FF7A59" },
  { name: "Email Marketing",        provider: "HubSpot", color: "#FF7A59" },
  { name: "Inbound Marketing",      provider: "HubSpot", color: "#FF7A59" },
  { name: "Content Marketing",      provider: "HubSpot", color: "#FF7A59" },
];

const google: CertItem[] = [
  { name: "Google My Business",           provider: "Google", color: "#34A853" },
  { name: "Google Analytics (GA4)",       provider: "Google", color: "#4285F4" },
  { name: "Google Ads Shopping",          provider: "Google", color: "#EA4335" },
  { name: "Performance Max",              provider: "Google", color: "#FBBC04" },
  { name: "Google Ads Video",             provider: "Google", color: "#EA4335" },
  { name: "Google Ads Display",           provider: "Google", color: "#34A853" },
  { name: "Fundamentals of Digital Mkt", provider: "Google", color: "#4285F4" },
  { name: "Google Ads Search",            provider: "Google", color: "#FBBC04" },
];

const meta: CertItem[] = [
  { name: "Community Manager",        provider: "Meta", price: "$99",  color: "#0082FB" },
  { name: "Creative Strategy Pro",    provider: "Meta", price: "$150", color: "#0082FB" },
  { name: "Media Planning Pro",       provider: "Meta", price: "$150", color: "#0082FB" },
  { name: "Marketing Science Pro",    provider: "Meta", price: "$150", color: "#0082FB" },
  { name: "Digital Marketing Assoc.", provider: "Meta", price: "$99",  color: "#0082FB" },
  { name: "Media Buying Pro",         provider: "Meta", price: "$150", color: "#0082FB" },
];

const providerBadge = {
  SEMrush: { bg: "#fff1eb", text: "#FF642D", border: "#ffded3" },
  HubSpot: { bg: "#fff2ee", text: "#FF7A59", border: "#fedbd1" },
  Google:  { bg: "#eff6ff", text: "#4285F4", border: "#dbeafe" },
  Meta:    { bg: "#eff6ff", text: "#0082FB", border: "#dbeafe" },
};

/* ─────────────────────────────────────────────
   COMPACT VERTICAL CARD (LIGHT THEME)
───────────────────────────────────────────── */
function CertCard({ cert }: { cert: CertItem }) {
  return (
    <div className="group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-200 hover:border-[#AAAAAA] hover:shadow-md mb-3.5 cursor-pointer">
      {/* Subtle top accent gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(to right, ${cert.color}, transparent)` }}
      />

      {/* Provider badge row */}
      <div className="flex items-center justify-end mb-2">
        <div
          className="rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider"
          style={{
            background: `${cert.color}15`,
            color: cert.color,
            border: `1px solid ${cert.color}30`,
          }}
        >
          {cert.provider}
        </div>
      </div>

      {/* Certification name */}
      <p className="m-0 mb-2.5 text-xs font-bold text-[#1A0A1A] leading-snug line-clamp-1 group-hover:text-[#5A2A5A] transition-colors">
        {cert.name}
      </p>

      {/* Footer */}
      <div className="flex items-center border-t border-slate-100 pt-2">
        {cert.price ? (
          <span
            className="rounded px-1.5 py-0.5 text-[9px] font-bold"
            style={{
              color: cert.color,
              background: cert.color + "18",
            }}
          >
            {cert.price} exam
          </span>
        ) : (
          <span className="rounded bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#3B0D3B]">
            Included
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VERTICAL INFINITE MARQUEE COLUMN (LIGHT THEME)
───────────────────────────────────────────── */
function VerticalInfiniteCol({
  certs,
  direction = "down",
  speed = 52,
}: {
  certs: CertItem[];
  direction?: "down" | "up";
  speed?: number;
}) {
  const loop = [...certs, ...certs, ...certs];

  return (
    <div className="overflow-hidden h-full">
      <div
        className="hover:[animation-play-state:paused]"
        style={{
          animation: `${direction === "down" ? "marquee-down" : "marquee-up"} ${speed}s linear infinite`,
        }}
      >
        {loop.map((cert, i) => (
          <CertCard key={`${cert.name}-${i}`} cert={cert} />
        ))}
      </div>
    </div>
  );
}

const defaultProviderBadges = [
  { name: "Google", color: "#4285F4", count: "8 certs" },
  { name: "Meta",   color: "#0082FB", count: "6 certs" },
  { name: "HubSpot",color: "#FF7A59", count: "6 certs" },
  { name: "SEMrush",color: "#FF642D", count: "4 certs" },
];

/* ─────────────────────────────────────────────
   MAIN SECTION (LIGHT THEME & SINGLE VIEWPORT)
───────────────────────────────────────────── */
export default function CertificationSection({ content }: { content?: CertificationsContent }) {
  // Determine cert cards
  const allIndustryCerts = content?.industryCerts && content.industryCerts.length > 0
    ? content.industryCerts
    : [...google, ...meta, ...hubspot, ...semrush];

  // Distribute into 2 columns
  const half = Math.ceil(allIndustryCerts.length / 2);
  const col1Certs = allIndustryCerts.slice(0, half);
  const col2Certs = allIndustryCerts.slice(half);

  const providerBadges = content?.providerBadges && content.providerBadges.length > 0
    ? content.providerBadges
    : defaultProviderBadges;

  const treqoTags = content?.treqoTags && content.treqoTags.length > 0
    ? content.treqoTags
    : ["Live Spend Defense", "Verified ROAS", "Agency Capstone"];

  const certificateImage = content?.treqoCertificateImage || "/images/treqo-official-certificate.png";

  return (
    <section
      id="certs"
      data-stage="CERTS"
      className="relative bg-[#FDFAF6] py-10 sm:py-12 lg:py-14 overflow-hidden scroll-mt-16 sm:scroll-mt-20 text-[#1A0A1A] border-b border-[#F5EDE0]"
    >
      <Container className="w-full relative z-10">
        {/* ── MAIN SECTION HEADER ── */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="m-0 mb-2 leading-tight tracking-tight text-[#1A0A1A]">
            <span className="block text-2xl sm:text-3xl lg:text-[2.65rem] font-black">
              {content?.eyebrow || "Credentials Built For The"}{" "}
              <span className="italic font-serif font-black text-[#5A2A5A]">
                {content?.eyebrowHighlight || "Real Market"}
              </span>
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-[#5A4A5A] max-w-xl mx-auto leading-relaxed font-medium">
            {content?.description || "Graduate with official revenue capstone validation, plus 30+ industry credentials recruiters actively search for."}
          </p>
        </div>

        {/* ── 2-COLUMN GRID (50% / 50%) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* ── LEFT SIDE (50%): TREQO CERTIFICATION ── */}
          <div className="flex flex-col justify-between w-full lg:col-span-6">
            {/* Header Info Left */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#3B0D3B]/15 bg-white px-3 py-0.5 mb-2 shadow-2xs">
                <ShieldCheck size={12} className="text-[#3B0D3B]" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#3B0D3B]">
                  {content?.treqoBadge || "CAPSTONE REVENUE PROOF"}
                </span>
              </div>

              <h3 className="m-0 mb-1.5 text-xl sm:text-2xl font-black text-[#1A0A1A] leading-tight">
                {content?.treqoTitle || "TREQO Certification"}
              </h3>

              <p className="text-xs sm:text-sm text-[#5A4A5A] m-0 leading-relaxed font-medium">
                {content?.treqoDescription || "Awarded on completion of your capstone project: a real campaign, built & launched with real numbers attached."}
              </p>

              {/* Provider Badges Row to match height & alignment with right side */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {treqoTags.map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border border-[#3B0D3B]/15 bg-white shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0CA30C]" />
                    <span className="text-[10px] font-extrabold text-[#3B0D3B]">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Container: Matching height with Right Marquee */}
            <div className="relative flex h-[460px] sm:h-[500px] lg:h-[520px] w-full flex-col items-center justify-center rounded-2xl border border-[#3B0D3B]/15 bg-white/70 p-4 shadow-sm backdrop-blur-xs">
              <a
                href={certificateImage}
                target="_blank"
                rel="noopener noreferrer"
                title="Click to view full-resolution certificate"
                className="relative h-full w-full block transition-transform duration-300 hover:scale-[1.01] cursor-zoom-in"
              >
                <Image
                  src={certificateImage}
                  alt={content?.treqoTitle ? `${content.treqoTitle} Official Certificate` : "TREQO Official Certificate of Completion in Digital Marketing"}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-contain drop-shadow-md"
                  priority
                />
              </a>
            </div>

            {/* Sub-caption below certificate */}
            <p className="text-[11px] text-[#5A4A5A] text-center mt-2.5 m-0 leading-relaxed font-medium">
              {content?.treqoCaption || "Verifiable credential directly reviewed by placement hiring managers."}
            </p>
          </div>

          {/* ── RIGHT SIDE (50%): OTHER INDUSTRY CERTIFICATION ── */}
          <div className="flex flex-col justify-between w-full lg:col-span-6">
            {/* Header Info Right */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#3B0D3B]/15 bg-white px-3 py-0.5 mb-2 shadow-2xs">
                <ShieldCheck size={12} className="text-[#3B0D3B]" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#3B0D3B]">
                  {content?.industryBadge || "GLOBAL CREDENTIALS"}
                </span>
              </div>

              <h3 className="m-0 mb-1.5 text-xl sm:text-2xl font-black text-[#1A0A1A] leading-tight">
                {content?.industryTitle || "Other Industry Certification"}
              </h3>

              <p className="text-xs sm:text-sm text-[#5A4A5A] m-0 leading-relaxed font-medium">
                {content?.industryDescription || "From Google & Meta to HubSpot & SEMrush, graduate with 30+ credentials recruiters look for."}
              </p>

              {/* Provider Badges Row */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {providerBadges.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border border-slate-200 bg-white shadow-2xs"
                  >
                    <span className="text-[10px] font-extrabold" style={{ color: p.color }}>
                      {p.name}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-500">
                      {p.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── VERTICAL FLOWING MARQUEE (DUAL COLUMNS: DOWN & UP) ── */}
            <div
              className="relative grid grid-cols-2 gap-3.5 h-[460px] sm:h-[500px] lg:h-[520px] overflow-hidden rounded-2xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/40 p-3 shadow-inner"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
              }}
            >
              {/* Column 1: Flows Downward (Top to Bottom) */}
              <VerticalInfiniteCol certs={col1Certs} direction="down" speed={54} />

              {/* Column 2: Flows Upward (Bottom to Top) */}
              <VerticalInfiniteCol certs={col2Certs} direction="up" speed={60} />
            </div>

            {/* Sub-caption below marquee */}
            <p className="text-[11px] text-[#5A4A5A] text-center mt-2.5 m-0 leading-relaxed font-medium">
              {content?.industryCaption || "All 30+ exam vouchers and preparation guides included with tuition."}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
