"use client";

import { Check } from "lucide-react";
import ApplyButton from "@/components/common/ApplyButton";
import DownloadCurriculumButton from "@/components/common/DownloadCurriculumButton";
import { cn } from "@/lib/utils";

export interface PerkItem {
  title: string;
  description: string;
  tag?: string;
}

interface CoursePerksBoxProps {
  courseTitle: string;
  slug?: string;
  isLocked?: boolean;
  perks?: Array<PerkItem | string>;
  className?: string;
}

const DEFAULT_DIGITAL_MARKETING_PERKS: PerkItem[] = [
  {
    tag: "Real Capital",
    title: "Live Client Budgets & Ad Spends",
    description:
      "Run real campaigns on Meta Ads and Google Ads with actual brand budgets. No dummy demo accounts or theoretical simulations.",
  },
  {
    tag: "1:1 Mentorship",
    title: "Dedicated Weekly Mentor Reviews",
    description:
      "Direct 1-on-1 feedback on your ad funnels, search architectures, and copy from seasoned agency directors and performance leads.",
  },
  {
    tag: "Executive Defense",
    title: "CEO Challenge Every Phase",
    description:
      "Defend your marketing rationale and conversion data in front of real founders. Learn to present metrics that withstand scrutiny.",
  },
  {
    tag: "Global Credentials",
    title: "10+ Recognized Industry Certifications",
    description:
      "Google Search & Display, Meta Certified Media Specialist, HubSpot Inbound, SEMrush, plus the official Treqo Capstone Certificate.",
  },
  {
    tag: "AI First",
    title: "AI-Powered Marketing Tech Stack",
    description:
      "Master generative AI workflows using ChatGPT 4o, Midjourney, Claude, and Perplexity embedded directly into every campaign module.",
  },
  {
    tag: "Premium Tools",
    title: "Hands-on Access to 30+ Pro Tools",
    description:
      "Full practical training across GA4, Google Tag Manager, SEMrush, Ahrefs, Hotjar, Mailchimp, Shopify, and Looker Studio.",
  },
  {
    tag: "Portfolio",
    title: "Verified Capstone Proof of Work",
    description:
      "Graduate holding tangible case studies with audited CAC, ROAS, and revenue data that immediately validate your skills to employers.",
  },
  {
    tag: "Career Cell",
    title: "Placement Support & Mock Interviews",
    description:
      "Tailored resume restructuring, LinkedIn profile optimization, salary negotiation coaching, and direct intros to agency hiring partners.",
  },
  {
    tag: "Lifelong Access",
    title: "Permanent Resource & Masterclass Access",
    description:
      "Lifetime access to all recorded sessions, marketing swipe files, high-converting copy templates, and guest industry masterclasses.",
  },
  {
    tag: "Community",
    title: "Treqo Alumni & Founder Network",
    description:
      "Private invite to our vibrant alumni Slack & Discord community for peer collaborations, freelance lead sharing, and job opportunities.",
  },
];

const ON_CAMPUS_PERKS: PerkItem[] = [
  {
    tag: "Studio Floor",
    title: "Dedicated Studio Floor at Madhapur",
    description:
      "Immerse yourself in our high-energy Madhapur studio floor with dedicated workstation setup, studio labs, and ultra-fast workspace WiFi.",
  },
  {
    tag: "In-Person",
    title: "Daily In-Person Mentor Desk Reviews",
    description:
      "Get immediate over-the-shoulder feedback as you build campaigns. No waiting for scheduled calls — get unblocked in minutes.",
  },
  {
    tag: "Real Client Pitches",
    title: "Live Client Boardroom Presentations",
    description:
      "Pitch creative strategies directly to startup founders and marketing executives in face-to-face boardroom defense sessions.",
  },
  {
    tag: "Campus Placement",
    title: "On-Campus Agency Drives & Walk-ins",
    description:
      "Direct interviews and hiring drives right on our studio floor with leading agencies and high-growth brands in Hyderabad.",
  },
  {
    tag: "Tool Suite",
    title: "30+ Premium Tools & Real Media Spend",
    description:
      "Includes live company-backed ad spend for Meta & Google ads, full GA4/SEMrush access, and AI workflow labs.",
  },
  {
    tag: "Credentials",
    title: "10+ Global Certifications & Degree Support",
    description:
      "Google, Meta, HubSpot, and SEMrush verified certifications included with zero exam surcharges or hidden test fees.",
  },
  {
    tag: "Offline Mixers",
    title: "Exclusive Offline Hackathons & Mixers",
    description:
      "Regular weekend sprint hackathons, founder fireside chats, and informal mixer evenings with agency leaders and tech founders.",
  },
  {
    tag: "Lifelong Access",
    title: "Lifetime LMS & Campus Alumni Pass",
    description:
      "Full lifetime access to our digital learning portal, updated session recordings, and open invitation to alumni networking days.",
  },
];

const DESIGN_PERKS: PerkItem[] = [
  {
    tag: "Portfolio",
    title: "3 Production-Grade End-to-End Case Studies",
    description:
      "Build real-world product flows from problem discovery to polished Figma prototypes that stand out against generic redesigns.",
  },
  {
    tag: "Design Systems",
    title: "Advanced Figma Architecture & Tokens",
    description:
      "Master component variants, auto-layout, interactive variables, and tokenized design systems matching Silicon Valley standards.",
  },
  {
    tag: "Live Critiques",
    title: "Weekly Critiques with Lead Product Designers",
    description:
      "Present and defend your UX architecture in weekly teardowns led by senior designers from high-scale product companies.",
  },
  {
    tag: "User Testing",
    title: "Live Usability Testing & Research Labs",
    description:
      "Conduct recorded user discovery interviews and prototype testing with real consumers to validate wireframes before pixel polish.",
  },
  {
    tag: "Design AI",
    title: "AI Design Acceleration Workflows",
    description:
      "Leverage Midjourney, Claude, Relume, and Galileo AI to generate moodboards, synthesize research, and accelerate early wireframes.",
  },
  {
    tag: "Career Ready",
    title: "Portfolio Defense & Whiteboard Prep",
    description:
      "Dedicated coaching on live whiteboard challenges, Figma app teardowns, and interview defense tailored to product design recruiters.",
  },
  {
    tag: "Lifetime Assets",
    title: "Lifetime UI Kits & Design Resource Vault",
    description:
      "Permanent access to our curated UI component kits, UX research templates, design contract boilerplates, and workshop recordings.",
  },
];

const FOUNDER_PERKS: PerkItem[] = [
  {
    tag: "GTM Strategy",
    title: "End-to-End Go-To-Market & Launch Blueprint",
    description:
      "Validate customer demand, construct acquisition funnels, and test offer messaging to acquire your first 100 paying customers.",
  },
  {
    tag: "Unit Economics",
    title: "Audited CAC, LTV & Financial Model",
    description:
      "Build bulletproof financial projections and unit economics spreadsheets reviewed and stress-tested by seasoned angel investors.",
  },
  {
    tag: "Founder Peer Group",
    title: "Weekly Founder Mastermind Sessions",
    description:
      "Transparent peer roundtables where founders dissect real-time pipeline bottlenecks, retention hurdles, and growth experiments.",
  },
  {
    tag: "Investor Demo",
    title: "Curated Demo Day with Micro-VCs & Angels",
    description:
      "Pitch your traction, customer metrics, and vision directly to active early-stage investors looking for high-velocity founders.",
  },
  {
    tag: "Legal Suite",
    title: "Founder Legal, Equity & Compliance Toolkit",
    description:
      "Battle-tested templates for term sheets, founder vesting agreements, employee ESOPs, and vendor contracts saving thousands in legal fees.",
  },
];

function getCoursePerks(slug?: string): PerkItem[] {
  if (!slug) return DEFAULT_DIGITAL_MARKETING_PERKS;
  const s = slug.toLowerCase();
  if (s.includes("4m") || s.includes("campus") || s.includes("offline")) {
    return ON_CAMPUS_PERKS;
  }
  if (s.includes("design") || s.includes("ui") || s.includes("ux")) {
    return DESIGN_PERKS;
  }
  if (s.includes("founder")) {
    return FOUNDER_PERKS;
  }
  return DEFAULT_DIGITAL_MARKETING_PERKS;
}

export default function CoursePerksBox({
  courseTitle,
  slug,
  isLocked = false,
  perks,
  className,
}: CoursePerksBoxProps) {
  // Normalize perks list
  let items: PerkItem[] = [];
  if (perks && perks.length > 0) {
    items = perks.map((p) =>
      typeof p === "string" ? { title: p, description: "", tag: "Included" } : p
    );
  } else {
    items = getCoursePerks(slug);
  }

  return (
    <section
      id="perks"
      className={cn("scroll-mt-28 sm:scroll-mt-32", className)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#3B0D3B]/15 bg-gradient-to-br from-white via-[#FDFAF6] to-[#F5EDE0]/50 p-4 sm:p-5 lg:p-6 shadow-sm">
        {/* Section Header (Compact, no pill badge) */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#EBDDC8]/70 pb-3 sm:pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#1A0A1A]">
              Everything Included in{" "}
              <span className="text-[#3B0D3B]">{courseTitle}</span>
            </h2>
            <p className="mt-0.5 text-xs text-[#5A4A5A]">
              Zero hidden fees. Complete access to live ad budgets, tools, certifications, and 1:1 mentorship.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-[11px] font-bold text-emerald-800 shrink-0">
            <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
            <span>100% In-Curriculum</span>
          </div>
        </div>

        {/* Compact Perks Grid with Clean Tick Marks */}
        <div className="relative z-10 mt-3 sm:mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex items-start gap-2.5 rounded-xl border border-[#F5EDE0] bg-white/95 px-3 py-2.5 transition-all duration-150 hover:border-[#3B0D3B]/25 hover:bg-white hover:shadow-xs"
            >
              {/* Tick Mark Badge */}
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-500/30 transition-transform duration-150 group-hover:scale-105 shadow-2xs mt-0.5">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>

              {/* Perk Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#1A0A1A] leading-snug group-hover:text-[#3B0D3B] transition-colors">
                    {item.title}
                  </h3>
                  {item.tag && (
                    <span className="inline-flex items-center rounded-md bg-[#FAF5EE] border border-[#EBDDC8]/80 px-1.5 py-0.2 text-[9px] font-semibold text-[#5A4A5A] uppercase tracking-wide">
                      {item.tag}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-0.5 text-[11px] text-[#5A4A5A] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Slim, Compact Footer Action */}
        <div className="relative z-10 mt-3.5 pt-3 border-t border-[#EBDDC8]/70 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p className="text-[11px] sm:text-xs text-[#5A4A5A] text-center sm:text-left">
            All tools, licenses, and ad spends are included in your program fee.
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <ApplyButton
              courseName={courseTitle}
              size="md"
              className="font-bold text-xs py-2 px-3.5 shadow-xs"
            >
              {isLocked ? "Get Notified" : "Apply for Batch"}
            </ApplyButton>

            <DownloadCurriculumButton
              courseName={courseTitle}
              size="sm"
              className="text-xs font-semibold"
            >
              Syllabus
            </DownloadCurriculumButton>
          </div>
        </div>
      </div>
    </section>
  );
}
