"use client";

import { Check, Sparkles, Layers, ShieldCheck } from "lucide-react";
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

// -------------------------------------------------------------
// ADVANTAGES IN OTHER COURSES (Traditional / Standard Institutes)
// -------------------------------------------------------------
const OTHER_DIGITAL_MARKETING_PERKS: PerkItem[] = [
  {
    tag: "Pre-Recorded",
    title: "Theoretical Slide-Based Modules",
    description:
      "Video lectures explaining marketing concepts without hands-on application on live client ad accounts.",
  },
  {
    tag: "Simulation",
    title: "Dummy Accounts with ₹0 Real Ad Spend",
    description:
      "Campaign setups on sandbox demo accounts with no real money, no real ad platforms, and no actual market risk.",
  },
  {
    tag: "1:Many Calls",
    title: "Group Doubt-Clearing Webinars",
    description:
      "Weekly mass Q&A sessions with dozens of students and no dedicated 1-on-1 review of your ad funnels or copy.",
  },
  {
    tag: "Basic Credential",
    title: "Single Course Completion Certificate",
    description:
      "Unverified generic completion PDF that employers frequently discount without audited portfolio proof.",
  },
  {
    tag: "Overview",
    title: "Surface-Level Tool Walkthroughs",
    description:
      "Basic slideshow overviews of Google Analytics and Ads without direct access to paid tool subscriptions.",
  },
  {
    tag: "Multiple Choice",
    title: "Standard Multiple-Choice Quizzes",
    description:
      "Assessment based on theoretical recall rather than pitching, executing, and defending real campaign metrics.",
  },
  {
    tag: "Temporary",
    title: "3 to 6 Months Learning Portal Access",
    description:
      "LMS access expires shortly after program completion, requiring renewal fees to review updated materials.",
  },
  {
    tag: "Job Board",
    title: "Public Job Portal Link Sharing",
    description:
      "Generic email blasts with links to public job boards without curated hiring drives or founder introductions.",
  },
];

const OTHER_CAMPUS_PERKS: PerkItem[] = [
  {
    tag: "Classroom",
    title: "Traditional Blackboard Lectures",
    description:
      "Standard coaching institute setup with passive slides rather than a functioning creative agency studio floor.",
  },
  {
    tag: "Zero Budget",
    title: "No Media Budget Allocation",
    description:
      "Students practice ad copywriting on paper with zero allocated budget for live Meta and Google ad networks.",
  },
  {
    tag: "Delayed Support",
    title: "Delayed Instructor Doubt Resolution",
    description:
      "Wait days for email answers or scheduled office hours instead of over-the-shoulder mentor assistance.",
  },
  {
    tag: "Basic Certificate",
    title: "Generic Institute Diploma",
    description:
      "Single unaccredited internal certificate without verified global certifications from Google, Meta, or HubSpot.",
  },
  {
    tag: "Basic Setup",
    title: "Shared Outdated Computer Labs",
    description:
      "Basic desktop setup without premium software subscriptions or generative AI creative workflow suites.",
  },
  {
    tag: "Passive HR",
    title: "Resume Forwarding to Generic Portals",
    description:
      "Resumes sent to public HR inboxes with no live studio walk-ins or executive founder hiring drives.",
  },
];

const OTHER_DESIGN_PERKS: PerkItem[] = [
  {
    tag: "Unrealistic",
    title: "Copycat Dribbble & Redesign Clones",
    description:
      "Copying existing screens from Spotify or Airbnb without user research, edge cases, or problem framing.",
  },
  {
    tag: "Basics Only",
    title: "Basic Figma Tooling Shortcuts",
    description:
      "Surface-level tool tutorials without component variables, tokenized architecture, or scalable design systems.",
  },
  {
    tag: "Solo Work",
    title: "Self-Graded Solo Assignments",
    description:
      "Submitting Figma links into void forums with no critique from senior product design leads.",
  },
  {
    tag: "No Research",
    title: "Theoretical UX Notes Without Testing",
    description:
      "Reading UX principles from articles without conducting recorded user interviews or prototype testing.",
  },
  {
    tag: "Static Assets",
    title: "Generic Downloadable UI Kits",
    description:
      "Basic UI templates without guidance on whiteboard interview challenges or app teardowns.",
  },
];

const OTHER_FOUNDER_PERKS: PerkItem[] = [
  {
    tag: "Academic",
    title: "40-Page Academic Business Plans",
    description:
      "Writing theoretical business plans on paper without acquiring real paying pilot customers or testing traction.",
  },
  {
    tag: "Old Cases",
    title: "20-Year-Old Enterprise Case Studies",
    description:
      "Deconstructing legacy Fortune 500 cases instead of solving real early-stage distribution bottlenecks.",
  },
  {
    tag: "No Network",
    title: "Zero Direct Investor or Angel Access",
    description:
      "Generic pitch lectures without curated demo days or direct introductions to micro-VCs and angels.",
  },
  {
    tag: "Self-Taught",
    title: "Costly Legal & Equity Guesswork",
    description:
      "Navigating term sheets, founder vesting, and ESOPs alone without battle-tested legal contract templates.",
  },
];

// -------------------------------------------------------------
// ADVANTAGES IN OUR COURSE (TREQO Flagship Standard)
// -------------------------------------------------------------
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

function getOtherCoursePerks(slug?: string): PerkItem[] {
  if (!slug) return OTHER_DIGITAL_MARKETING_PERKS;
  const s = slug.toLowerCase();
  if (s.includes("4m") || s.includes("campus") || s.includes("offline")) {
    return OTHER_CAMPUS_PERKS;
  }
  if (s.includes("design") || s.includes("ui") || s.includes("ux")) {
    return OTHER_DESIGN_PERKS;
  }
  if (s.includes("founder")) {
    return OTHER_FOUNDER_PERKS;
  }
  return OTHER_DIGITAL_MARKETING_PERKS;
}

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
  // Normalize our course perks list
  let ourPerks: PerkItem[] = [];
  if (perks && perks.length > 0) {
    ourPerks = perks.map((p) =>
      typeof p === "string" ? { title: p, description: "", tag: "Included" } : p
    );
  } else {
    ourPerks = getCoursePerks(slug);
  }

  // Other courses perks list
  const otherPerks: PerkItem[] = getOtherCoursePerks(slug);

  return (
    <section
      id="perks"
      className={cn("scroll-mt-28 sm:scroll-mt-32", className)}
    >
      <div className="relative overflow-hidden rounded-3xl border border-[#3B0D3B]/10 bg-gradient-to-b from-[#FDFAF6] via-white to-[#FDFAF6] p-4 sm:p-6 lg:p-8 shadow-sm">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#3B0D3B]/5 border border-[#3B0D3B]/15 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-[#3B0D3B]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#3B0D3B]" />
            <span>Comprehensive Curriculum Comparison</span>
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#1A0A1A]">
            Compare What You Get: <span className="text-[#3B0D3B]">Other Courses vs. Our Course</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#5A4A5A] leading-relaxed">
            See why ambitious marketers and career switchers choose TREQO. Real client ad budgets, weekly 1:1 executive mentorship, and verified capstone proof.
          </p>
        </div>

        {/* Two-Box Side-by-Side Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          
          {/* ========================================================= */}
          {/* BOX 1: ADVANTAGES IN OTHER COURSES                        */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 sm:p-5 lg:p-6 transition-all">
            <div>
              {/* Box 1 Header */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3 sm:pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    <span>Traditional Programs</span>
                  </div>
                  <h3 className="mt-1.5 text-base sm:text-lg font-bold text-slate-800">
                    Advantages in Other Courses
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    What standard training institutes and mass online programs typically offer
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 shrink-0">
                  <Check className="h-3.5 w-3.5 text-slate-500 stroke-[2.5]" />
                  <span>Standard Baseline</span>
                </div>
              </div>

              {/* Box 1 Perks List */}
              <div className="mt-4 space-y-2.5">
                {otherPerks.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-white/90 p-2.5 sm:p-3 transition-colors hover:border-slate-300"
                  >
                    {/* Tick Mark Badge (Neutral / Standard) */}
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-300 mt-0.5">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-[13px] font-semibold text-slate-700 leading-snug">
                          {item.title}
                        </h4>
                        {item.tag && (
                          <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 uppercase tracking-wide">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 1 Footer Note */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-center sm:text-left">
              <p className="text-[11px] text-slate-400 font-medium">
                Baseline features standard across conventional certification courses.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BOX 2: ADVANTAGES IN OUR COURSE (TREQO)                   */}
          {/* ========================================================= */}
          <div className="relative flex flex-col justify-between rounded-2xl border-2 border-[#3B0D3B]/25 bg-gradient-to-br from-white via-[#FDFAF6] to-[#FAF5EE] p-4 sm:p-5 lg:p-6 shadow-md ring-1 ring-[#3B0D3B]/10 transition-all">
            
            {/* Featured Badge */}
            <div className="absolute -top-3 right-5 sm:right-6">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#3B0D3B] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                <Sparkles className="h-3 w-3 text-amber-300" />
                <span>The TREQO Standard</span>
              </span>
            </div>

            <div>
              {/* Box 2 Header */}
              <div className="flex items-center justify-between gap-2 border-b border-[#EBDDC8]/80 pb-3 sm:pb-4 pt-1">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-[#3B0D3B]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#3B0D3B]">
                    <span>Our Flagship Course</span>
                  </div>
                  <h3 className="mt-1.5 text-base sm:text-lg font-black text-[#1A0A1A]">
                    Advantages in Our Course
                  </h3>
                  <p className="mt-0.5 text-xs text-[#5A4A5A]">
                    Live company ad spends, dedicated 1:1 executive reviews, and real CEO challenge
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-800 shrink-0">
                  <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                  <span>100% In-Curriculum</span>
                </div>
              </div>

              {/* Box 2 Perks List */}
              <div className="mt-4 space-y-2.5">
                {ourPerks.map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-2.5 rounded-xl border border-[#F5EDE0] bg-white p-2.5 sm:p-3 transition-all hover:border-[#3B0D3B]/30 hover:shadow-xs"
                  >
                    {/* Tick Mark Badge (Vibrant Emerald / Superior) */}
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-500/40 shadow-2xs mt-0.5 group-hover:scale-105 transition-transform">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-[13px] font-bold text-[#1A0A1A] leading-snug group-hover:text-[#3B0D3B] transition-colors">
                          {item.title}
                        </h4>
                        {item.tag && (
                          <span className="inline-flex items-center rounded-md bg-[#FAF5EE] border border-[#EBDDC8]/80 px-1.5 py-0.5 text-[9px] font-bold text-[#3B0D3B] uppercase tracking-wide">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-0.5 text-[11px] text-[#5A4A5A] leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2 Footer Action */}
            <div className="mt-4 pt-3.5 border-t border-[#EBDDC8]/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] sm:text-xs text-[#5A4A5A] text-center sm:text-left font-medium">
                All media budgets, pro tool licenses, and certifications are fully included.
              </p>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center sm:justify-end">
                <ApplyButton
                  courseName={courseTitle}
                  size="md"
                  className="font-bold text-xs py-2 px-3.5 shadow-sm"
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

        </div>
      </div>
    </section>
  );
}
