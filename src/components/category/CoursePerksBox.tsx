"use client";

import { Check, Sparkles, ShieldCheck, ArrowRight, Download } from "lucide-react";
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
      <div className="relative overflow-hidden rounded-3xl border border-[#3B0D3B]/15 bg-gradient-to-br from-white via-[#FDFAF6] to-[#F5EDE0]/60 p-6 sm:p-8 lg:p-10 shadow-[0_16px_40px_-20px_rgba(59,13,59,0.12)]">
        {/* Subtle Ambient Decorative Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#3B0D3B]/[0.06] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/[0.05] blur-3xl"
        />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#EBDDC8]/80 pb-6 sm:pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#3B0D3B]/[0.07] px-3.5 py-1 text-[11px] font-bold tracking-wider text-[#3B0D3B] uppercase">
              <Sparkles className="h-3.5 w-3.5 text-[#3B0D3B]" />
              <span>ALL-INCLUSIVE CURRICULUM</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-[#1A0A1A]">
              Everything Included in{" "}
              <span className="text-[#3B0D3B]">{courseTitle}</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#5A4A5A] max-w-2xl leading-relaxed">
              Zero hidden fees, zero software surcharges. When you join, you receive complete access to the full operational ecosystem required to launch and scale your career.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200/90 px-4 py-2.5 self-start md:self-auto shrink-0 shadow-2xs">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-[11px] font-bold text-emerald-900 leading-none">100% Guaranteed Inclusions</p>
              <p className="text-[10px] text-emerald-700 mt-0.5 leading-none">All tools &amp; perks included in tuition</p>
            </div>
          </div>
        </div>

        {/* Perks Grid with Prominent Tick Marks */}
        <div className="relative z-10 mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex items-start gap-3.5 rounded-2xl border border-[#F5EDE0] bg-white/90 p-4 sm:p-4.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3B0D3B]/30 hover:bg-white hover:shadow-md hover:shadow-[#3B0D3B]/5"
            >
              {/* Tick Mark Badge */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 transition-all duration-200 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white shadow-xs">
                <Check className="h-4 w-4 stroke-[2.75]" />
              </div>

              {/* Perk Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#1A0A1A] leading-snug group-hover:text-[#3B0D3B] transition-colors">
                    {item.title}
                  </h3>
                  {item.tag && (
                    <span className="inline-flex items-center rounded-full bg-[#FAF5EE] border border-[#EBDDC8]/90 px-2 py-0.5 text-[10px] font-semibold text-[#5A4A5A] uppercase tracking-wide">
                      {item.tag}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 text-xs text-[#5A4A5A] leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Callout with Actions */}
        <div className="relative z-10 mt-8 rounded-2xl bg-gradient-to-r from-[#1A0A1A] to-[#2B0D2B] p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Cohort Admissions Open
              </p>
            </div>
            <p className="mt-1 text-base sm:text-lg font-black text-[#FDFAF6]">
              Ready to claim your seat in the next batch?
            </p>
            <p className="mt-0.5 text-xs text-white/70">
              Limited seats per cohort to guarantee personalized 1:1 mentor attention.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0 w-full sm:w-auto">
            <ApplyButton
              courseName={courseTitle}
              size="md"
              className="w-full sm:w-auto font-bold shadow-md bg-white hover:bg-slate-100 text-[#1A0A1A]"
            >
              {isLocked ? "Get Notified" : "Apply for Batch"}
            </ApplyButton>

            <DownloadCurriculumButton
              courseName={courseTitle}
              size="md"
              className="w-full sm:w-auto font-semibold border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Download Syllabus
            </DownloadCurriculumButton>
          </div>
        </div>
      </div>
    </section>
  );
}
