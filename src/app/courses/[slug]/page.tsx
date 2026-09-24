import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Star, Lock } from "lucide-react";
import Header from "@/components/header/Header";
import AnnouncementBanner from "@/components/header/AnnouncementBanner";
import Footer from "@/components/footer/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ApplyButton from "@/components/common/ApplyButton";
import DownloadCurriculumButton from "@/components/common/DownloadCurriculumButton";
import CategorySubNav from "@/components/category/CategorySubNav";
import PhaseAccordion from "@/components/category/PhaseAccordion";
import CeoChallengeCard from "@/components/category/CeoChallengeCard";
import IndustryCoverageSection from "@/components/category/IndustryCoverageSection";
import CareerOutcomesSection from "@/components/category/CareerOutcomesSection";
import CategorySidebar from "@/components/category/CategorySidebar";
import CategoryFaqAccordion from "@/components/category/CategoryFaqAccordion";
import MobileEnrollBar from "@/components/category/MobileEnrollBar";
import CourseHeroForm from "@/components/category/CourseHeroForm";
import CoursePerksBox from "@/components/category/CoursePerksBox";
import ProgramOverviewHighlights from "@/components/category/ProgramOverviewHighlights";
import { learningSystemCourses } from "@/data/home";
import { megaMenuData } from "@/data/navigation";
import { getCoursesFromDb, getPageSeoByPath, type CourseItem } from "@/lib/content-db";
import { formatCourseSlug } from "@/lib/seo-utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const categoryLinks = megaMenuData.columns.find((column) => column.title === "Learn by Category")?.links ?? [];

function getCourse(slug: string) {
  const targetSlug = formatCourseSlug(slug);
  return learningSystemCourses.find((course) => formatCourseSlug(course.href) === targetSlug);
}

export async function resolveCourseMeta(pathOrSlug: string, preloadedCourses?: CourseItem[]) {
  if (!pathOrSlug) return null;
  const targetSlug = formatCourseSlug(pathOrSlug);
  const cleanPath = pathOrSlug.startsWith("/") ? pathOrSlug : `/${pathOrSlug}`;
  const normalizedPath = cleanPath.toLowerCase().replace(/\/+$/, "");
  const segments = cleanPath.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "";
  const lastSegmentSlug = formatCourseSlug(lastSegment);

  const dbCourses = preloadedCourses || (await getCoursesFromDb().catch(() => []));

  // 1. Try matching from DB courses first
  const dbCourse = dbCourses.find((c) => {
    const cHref = c.href ? (c.href.startsWith("/") ? c.href : `/${c.href}`).toLowerCase().replace(/\/+$/, "") : "";
    const cActionHref = c.actionHref ? (c.actionHref.startsWith("/") ? c.actionHref : `/${c.actionHref}`).toLowerCase().replace(/\/+$/, "") : "";

    // A. Exact path match (handles any arbitrary prefix/slug combination)
    if (cHref && (cHref === normalizedPath || cHref === cleanPath.toLowerCase())) return true;
    if (cActionHref && (cActionHref === normalizedPath || cActionHref === cleanPath.toLowerCase())) return true;

    // B. Slug match
    const idSlug = formatCourseSlug(c.id);
    const hrefSlug = formatCourseSlug(c.href);
    const actionHrefSlug = formatCourseSlug(c.actionHref || "");
    return (
      idSlug === targetSlug ||
      hrefSlug === targetSlug ||
      actionHrefSlug === targetSlug ||
      idSlug === lastSegmentSlug ||
      hrefSlug === lastSegmentSlug ||
      (targetSlug === "digital-marketing" && (idSlug === "digital-marketing" || idSlug === "new-age-dm"))
    );
  });

  if (dbCourse) {
    // Use the stored href as-is; only fall back to /courses/<slug> if href is blank
    const resolvedHref = dbCourse.href && dbCourse.href.startsWith("/")
      ? dbCourse.href
      : `/courses/${formatCourseSlug(dbCourse.href) || formatCourseSlug(dbCourse.id) || targetSlug}`;
    return {
      label: dbCourse.title,
      href: resolvedHref,
      icon: undefined as any,
      dbCourse,
    };
  }

  // 2. Try matching categoryLinks from navigation menu
  const link = categoryLinks.find((l) => {
    const lSlug = formatCourseSlug(l.href);
    return lSlug === targetSlug || lSlug === lastSegmentSlug;
  });
  if (link) {
    return {
      label: link.label,
      href: `/courses/${formatCourseSlug(link.href)}`,
      icon: (link as any).icon,
      dbCourse: undefined,
    };
  }

  // 3. Try matching static learningSystemCourses
  const course = getCourse(pathOrSlug) || getCourse(lastSegment);
  if (course) {
    return {
      label: course.title,
      href: `/courses/${formatCourseSlug(course.href)}`,
      icon: undefined as any,
      dbCourse: undefined,
    };
  }

  return null;
}

export async function generateStaticParams() {
  try {
    const dbCourses = await getCoursesFromDb().catch(() => []);
    const dbSlugs = dbCourses.map((c) => ({
      slug: formatCourseSlug(c.href) || formatCourseSlug(c.id),
    }));
    const courseSlugs = learningSystemCourses.map((c) => ({
      slug: formatCourseSlug(c.href),
    }));
    const categorySlugs = categoryLinks.map((link) => ({
      slug: formatCourseSlug(link.href),
    }));
    const all = [...dbSlugs, ...courseSlugs, ...categorySlugs].filter((s) => Boolean(s.slug));
    const uniqueSlugs = Array.from(new Set(all.map((item) => item.slug))).map((slug) => ({ slug }));
    return uniqueSlugs;
  } catch {
    return learningSystemCourses.map((c) => ({ slug: formatCourseSlug(c.href) }));
  }
}

const NEW_AGE_ONLINE_KEYWORDS = [
  "digital marketing classes near me",
  "search engine optimization in digital marketing",
  "digital marketing institute near me",
  "digital marketing certificate programs",
  "marketing courses online with certificate",
  "digital marketing online certification course",
  "advanced digital marketing course",
  "digital marketing course with placement",
  "best online digital marketing courses in india",
  "digital marketing classes online",
  "study digital marketing online",
  "best digital marketing courses",
  "best online marketing courses",
  "good digital marketing courses",
  "top digital marketing courses",
  "digital marketing certification course",
  "certificate in digital marketing course",
  "marketing strategy course",
  "professional certificate in digital marketing",
  "digital marketing course online",
  "marketing courses online",
  "online marketing classes",
  "marketing digital course online",
  "online marketing online course",
  "fundamentals of digital marketing",
  "learn digital marketing",
  "digital marketing course online india",
  "best online digital marketing courses",
  "learn digital marketing online",
  "digital marketing courses",
  "digital marketing classes",
  "digital marketing training courses",
  "diploma in digital marketing",
  "ai in marketing course",
  "digital marketing for students",
  "accredited digital marketing courses",
  "best online courses for marketing professionals",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = await resolveCourseMeta(slug);
  if (!meta) return {};

  const cleanSlug = formatCourseSlug(slug);
  const pageSeo =
    (await getPageSeoByPath(`/courses/${cleanSlug}`)) ||
    (await getPageSeoByPath(`/categories/${cleanSlug}`));

  const isNewAgeOnline =
    cleanSlug === "digital-marketing" ||
    cleanSlug === "new-age-dm" ||
    meta.dbCourse?.id === "digital-marketing" ||
    meta.label.toLowerCase().includes("new age digital marketing");

  const title = pageSeo?.title || pageSeo?.metaTitle || `${meta.label} | TREQO`;
  const description =
    pageSeo?.metaDescription ||
    `Explore TREQO's ${meta.label} track, live mentorship, practical deliverables, and verified career portfolios.`;

  const keywords =
    pageSeo?.metaKeywords && pageSeo.metaKeywords.length > 0
      ? pageSeo.metaKeywords
      : isNewAgeOnline
        ? NEW_AGE_ONLINE_KEYWORDS
        : meta.dbCourse?.metaKeywords || [];

  return {
    title,
    description,
    ...(keywords.length > 0 ? { keywords } : {}),
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbCourses = await getCoursesFromDb();
  const metaInfo = (await resolveCourseMeta(slug, dbCourses)) || (await resolveCourseMeta(formatCourseSlug(slug), dbCourses));
  if (!metaInfo) notFound();

  const cleanSlug = formatCourseSlug(metaInfo.href) || formatCourseSlug(slug);
  const meta = { label: metaInfo.label, href: metaInfo.href, icon: metaInfo.icon };
  const dbCourse = metaInfo.dbCourse;
  const masterDetail = learningSystemCourses[0].detail!;
  const matchedCourse = getCourse(cleanSlug);

  const isLocked = dbCourse !== undefined ? Boolean(dbCourse.isLocked) : !["digital-marketing", "4m-program"].includes(cleanSlug);

  const activeTitle = dbCourse?.title || matchedCourse?.title || meta.label;
  const activeDescription =
    dbCourse?.description ||
    matchedCourse?.detail?.description ||
    matchedCourse?.description ||
    masterDetail.description;

  const course = {
    id: cleanSlug,
    title: activeTitle,
    description: activeDescription,
    href: dbCourse?.href && dbCourse.href.startsWith("/") ? dbCourse.href : `/courses/${cleanSlug}`,
  };

  const isOnline = cleanSlug === "digital-marketing" || (!cleanSlug.includes("4m") && !cleanSlug.includes("offline"));
  const activeDetail = matchedCourse?.detail || masterDetail;

  const detail = {
    ...activeDetail,
    badge: isLocked
      ? "COMING SOON"
      : dbCourse?.badge || activeDetail.badge || "Flagship · Now Enrolling",
    batch: isLocked
      ? "Launching Soon · Get Notified"
      : (dbCourse?.batch || activeDetail.batch || "Batch 2 · Oct 2026").replace(/sep(tember)?\s*2026/i, "Oct 2026"),
    description: activeDescription,
    stats: [
      {
        label: "Duration",
        value:
          (dbCourse?.duration || dbCourse?.meta || activeDetail.stats[0]?.value || "4 months")
            .split("·")[0]
            .replace(/,\s*(online|offline|on campus)/i, "")
            .trim() || "4 months",
      },
      { label: "Format", value: cleanSlug === "4m-program" ? "On campus" : (dbCourse?.meta && dbCourse.meta.includes("·") ? dbCourse.meta.split("·")[1].trim() : (activeDetail.stats[1]?.value || "Online, live")) },
      { label: "Phases", value: cleanSlug === "4m-program" ? "12" : (dbCourse?.phases?.groups ? `${dbCourse.phases.groups.length} phases` : (activeDetail.stats[2]?.value || "12 phases")) },
      { label: "Projects", value: cleanSlug === "4m-program" ? "30+ brand projects" : (activeDetail.stats[3]?.value || "30+ real brands") },
    ],
    phases: dbCourse?.phases?.groups ? { ...masterDetail.phases, ...dbCourse.phases } : (activeDetail.phases || masterDetail.phases),
    phasesNavLabel: activeDetail.phasesNavLabel || masterDetail.phasesNavLabel,
    challengeNavLabel: activeDetail.challengeNavLabel || masterDetail.challengeNavLabel,
    challenge: dbCourse?.challenge ? { ...masterDetail.challenge, ...dbCourse.challenge } : (activeDetail.challenge || masterDetail.challenge),
    careerRoles: dbCourse?.careerRoles && dbCourse.careerRoles.length > 0 ? dbCourse.careerRoles : undefined,
    proof: dbCourse?.proof ? { ...activeDetail.proof, ...dbCourse.proof } : (activeDetail.proof || masterDetail.proof),
    fees: {
      ...activeDetail.fees,
      plans: activeDetail.fees.plans.map((p, idx) => {
        if (idx === 0 && dbCourse?.feeTotal) {
          return { ...p, amount: dbCourse.feeTotal };
        }
        if (idx === 1 && dbCourse?.feeEmi) {
          return { ...p, amount: dbCourse.feeEmi };
        }
        return p;
      }),
    },
    faqs: dbCourse?.faqs && dbCourse.faqs.length > 0 ? dbCourse.faqs : (activeDetail.faqs || masterDetail.faqs),
    overview: activeDetail.overview || masterDetail.overview,
    applyCtaLabel: isLocked ? "Notify Me When Open" : (dbCourse?.applyCta && dbCourse.applyCta !== "Notify Me When Open" ? dbCourse.applyCta : "Apply for Batch 2"),
    breakdownCtaLabel: dbCourse?.syllabusCta || activeDetail.breakdownCtaLabel || "Download Curriculum",
    sidebar: {
      ...masterDetail.sidebar,
      ...(activeDetail.sidebar || {}),
      batchLabel: isLocked
        ? "Coming Soon"
        : activeDetail.sidebar?.batchLabel
          ? activeDetail.sidebar.batchLabel.replace(/\s*\(forming\)/i, "").trim()
          : "Batch 2",
      starts: cleanSlug === "4m-program" ? "Coming soon" : (activeDetail.sidebar?.starts || masterDetail.sidebar.starts || "Coming soon"),
      format: cleanSlug === "4m-program" ? "On Campus, 4 months" : (dbCourse?.duration || activeDetail.sidebar?.format || masterDetail.sidebar.format),
      applyLabel: isLocked ? "Get Notified" : (dbCourse?.applyCta && dbCourse.applyCta !== "Get Notified" ? dbCourse.applyCta : "Apply for Batch 2"),
      downloadLabel: dbCourse?.syllabusCta || activeDetail.sidebar?.downloadLabel || masterDetail.sidebar.downloadLabel,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF6] text-[#1A0A1A]">
      <Header variant="standard" banner={<AnnouncementBanner />} />

      <main className="flex-1 pb-16 lg:pb-0">

        {detail && course ? (
          <section className="relative overflow-hidden border-b border-[#F5EDE0] bg-[#FDFAF6] pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-20 text-[#1A0A1A]">
            {/* Decorative Background Design */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              {/* 1. Subtle Precision Architectural Grid with Radial Vignette */}
              <div
                className="absolute inset-0 opacity-[0.55]"
                style={{
                  backgroundImage: `
                  linear-gradient(to right, rgba(59, 13, 59, 0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(59, 13, 59, 0.05) 1px, transparent 1px)
                `,
                  backgroundSize: "44px 44px",
                  maskImage: "radial-gradient(ellipse 80% 75% at 50% 30%, black 25%, transparent 75%)",
                  WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 30%, black 25%, transparent 75%)",
                }}
              />

              {/* 2. Concentric Orbital Accent Rings (Top Right quadrant) */}
              <svg
                className="absolute -right-20 -top-20 h-[560px] w-[560px] stroke-[#3B0D3B]/[0.08]"
                fill="none"
                viewBox="0 0 560 560"
                style={{
                  maskImage: "radial-gradient(circle at center, black 30%, transparent 75%)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 75%)",
                }}
              >
                <circle cx="280" cy="280" r="110" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="280" cy="280" r="170" strokeWidth="1" />
                <circle cx="280" cy="280" r="230" strokeWidth="1" strokeDasharray="8 6" />
                <circle cx="280" cy="280" r="275" strokeWidth="1" />
              </svg>

              {/* 3. Concentric Orbital Accent Rings (Bottom Left quadrant) */}
              <svg
                className="absolute -left-36 -bottom-36 h-[440px] w-[440px] stroke-[#3B0D3B]/[0.06] hidden sm:block"
                fill="none"
                viewBox="0 0 440 440"
                style={{
                  maskImage: "radial-gradient(circle at center, black 25%, transparent 75%)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 25%, transparent 75%)",
                }}
              >
                <circle cx="220" cy="220" r="90" strokeWidth="1" strokeDasharray="6 4" />
                <circle cx="220" cy="220" r="150" strokeWidth="1" />
                <circle cx="220" cy="220" r="210" strokeWidth="1" strokeDasharray="4 4" />
              </svg>

              {/* 4. Layered Atmospheric Gradient Blooms */}
              <div className="absolute -top-28 right-1/4 h-[450px] w-[450px] rounded-full bg-[#3B0D3B]/[0.06] blur-3xl" />
              <div className="absolute top-1/3 -left-20 h-80 w-80 rounded-full bg-[#C084FC]/[0.08] blur-3xl" />
              <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-[#F5EDE0] blur-2xl" />

              {/* 5. Minimalist Editorial Grid Coordinates */}
              <div className="absolute top-7 left-8 sm:left-12 text-[#3B0D3B]/25 font-mono text-[10px] tracking-widest uppercase hidden md:block select-none">
                + 01 / EXECUTIVE TRACK
              </div>
              <div className="absolute top-7 right-8 sm:right-12 text-[#3B0D3B]/25 font-mono text-[10px] tracking-widest uppercase hidden lg:block select-none">
                BATCH 02 · HYBRID +
              </div>
            </div>

            <Container>
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                  {/* Cohort Badges */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {isLocked ? (
                      <>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-700 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-200 uppercase shadow-xs">
                          <Clock className="h-3 w-3" />
                          <span>COMING SOON</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] font-bold text-slate-700">
                          Launching Soon · Get Notified
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#3B0D3B] px-3.5 py-1 text-[11px] font-bold tracking-wide text-[#FDFAF6] uppercase shadow-xs">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                          </span>
                          {detail.badge}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Course Title & Headline */}
                  <h1 className="mt-4 text-3xl font-black tracking-tight text-[#1A0A1A] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
                    {course.title}
                  </h1>
                  <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[#5A4A5A] font-medium sm:text-base">
                    {detail.description}
                  </p>

                  {/* Stat Grid (Fast Scanning with Clean, Proportionate Cards) */}
                  <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                    {detail.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="group flex flex-col justify-center rounded-xl border border-[#EBDDC8]/90 bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 transition-all duration-200 shadow-2xs hover:shadow-sm hover:border-[#3B0D3B]/30 hover:-translate-y-0.5 min-h-[64px]"
                      >
                        <p className="text-[10px] font-bold tracking-wider text-[#8C6A8C] uppercase">
                          {stat.label}
                        </p>
                        <p className="mt-0.5 text-[15px] sm:text-[16px] font-extrabold text-[#1A0A1A] leading-snug tracking-tight group-hover:text-[#3B0D3B] transition-colors">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Call to Actions on Mobile & Desktop */}
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <ApplyButton
                      courseName={course.title}
                      size="lg"
                      className="font-bold shadow-lg shadow-[#3B0D3B]/20 w-full sm:w-auto hover:shadow-xl hover:shadow-[#3B0D3B]/30 transition-all"
                    >
                      {isLocked ? "Notify Me When Open" : detail.applyCtaLabel}
                    </ApplyButton>
                    <DownloadCurriculumButton
                      courseName={course.title}
                      size="lg"
                      className="font-semibold w-full sm:w-auto shadow-xs hover:shadow-md"
                    >
                      {detail.breakdownCtaLabel}
                    </DownloadCurriculumButton>
                  </div>

                  {/* Social Proof Bar */}
                  <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-5 border-t border-[#F5EDE0] pt-4 text-xs text-[#5A4A5A]">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#3B0D3B] text-[10px] font-bold text-white ring-2 ring-white">RK</span>
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#5A2A5A] text-[10px] font-bold text-white ring-2 ring-white">SP</span>
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#C084FC] text-[10px] font-bold text-[#1A0A1A] ring-2 ring-white">AM</span>
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white ring-2 ring-white">+</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#1A0A1A]">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="ml-1 font-bold">4.9/5</span>
                      </div>
                    </div>
                    <span className="h-3.5 w-px bg-slate-300 hidden sm:inline-block" aria-hidden="true" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100/90 bg-white px-3 py-1 text-[11px] shadow-2xs">
                        <span className="font-bold text-[#1A73E8]">Google</span>
                        <span className="font-medium text-slate-600">8 certs</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100/90 bg-white px-3 py-1 text-[11px] shadow-2xs">
                        <span className="font-bold text-[#0064E0]">Meta</span>
                        <span className="font-medium text-slate-600">6 certs</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100/90 bg-white px-3 py-1 text-[11px] shadow-2xs">
                        <span className="font-bold text-[#FF7A59]">HubSpot</span>
                        <span className="font-medium text-slate-600">6 certs</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100/90 bg-white px-3 py-1 text-[11px] shadow-2xs">
                        <span className="font-bold text-[#FF642D]">SEMrush</span>
                        <span className="font-medium text-slate-600">4 certs</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side Application Form */}
                <div className="lg:col-span-5 w-full">
                  <CourseHeroForm courseTitle={course.title} isLocked={isLocked} />
                </div>
              </div>
            </Container>
          </section>
        ) : (
          <section className="relative overflow-hidden bg-[#f3f2f7] pt-12 pb-16 sm:pt-20 sm:pb-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-60"
              style={{
                backgroundImage: "radial-gradient(rgba(58,22,147,0.12) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />

            <Container className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-semibold text-brand-primary shadow-sm">
                {meta.icon ? <meta.icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                {meta.label}
              </span>

              <h1 className="mt-5 max-w-3xl text-3xl leading-[1.1] font-black tracking-tight text-text-primary uppercase sm:text-4xl lg:text-5xl">
                {course ? (
                  course.title
                ) : (
                  <>
                    <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                      {meta.label}
                    </span>{" "}
                    Track
                  </>
                )}
              </h1>

              <p className="mt-4 max-w-xl text-sm text-text-secondary sm:text-base">
                {course
                  ? course.description
                  : `We're putting the finishing touches on the ${meta.label} learning track. Join the waitlist and we'll let you know the moment it opens.`}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ApplyButton
                  courseName={`${meta.label} Track`}
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                >
                  Start Learning Now
                </ApplyButton>
                <Button href="/#courses" variant="secondary">
                  Explore Programs
                </Button>
              </div>
            </Container>
          </section>
        )}

        {detail && course ? (
          <>
            <CategorySubNav
              applyHref="/start-learning"
              tabs={[
                { id: "phases", label: detail.phasesNavLabel },
                { id: "challenge", label: detail.challengeNavLabel },
                ...(!isOnline ? [{ id: "industries", label: "Industry Coverage" }] : []),
                { id: "outcomes", label: "Career Roles" },
                { id: "proof", label: "Proof" },
                { id: "faqs", label: "FAQ" },
                { id: "perks", label: "Advantages" },
              ]}
            />

            <section className="pt-8 pb-16 sm:pt-12 sm:pb-24">
              <Container>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:gap-14">
                  <div className="flex flex-col gap-12 sm:gap-16 lg:order-1 lg:col-start-1 relative">
                    {/* When course is locked/blocked: Show prominent locked notice */}
                    {isLocked && (
                      <div className="rounded-3xl border border-amber-500/30 bg-amber-50/95 p-6 sm:p-8 backdrop-blur-md shadow-lg text-center flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B0D3B] text-white shadow-md mb-3">
                          <Lock className="h-6 w-6 text-amber-300" />
                        </div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1 text-[10px] font-black text-white uppercase tracking-wider mb-2.5">
                          <Clock className="h-3 w-3 text-amber-400" />
                          <span>Coming Soon</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-[#1A0A1A]">Curriculum &amp; Program Details Locked</h3>
                        <p className="mt-2 max-w-lg text-xs sm:text-sm text-[#5A4A5A] leading-relaxed">
                          The full phase-by-phase syllabus, real-brand capstone briefs, and fee schedule are currently locked for final review. Register now to unlock early access notification.
                        </p>
                        <div className="mt-5">
                          <ApplyButton courseName={course.title} size="md" className="font-bold shadow-md">
                            Notify Me When Open
                          </ApplyButton>
                        </div>
                      </div>
                    )}

                    <div className={cn("flex flex-col gap-12 sm:gap-16", isLocked && "opacity-75 pointer-events-none select-none")}>
                      {/* Program Overview & Highlights (Responsive Desktop/Mobile) */}
                      <ProgramOverviewHighlights />

                      {/* 1. Phases */}
                      <section id="phases" className="scroll-mt-28 sm:scroll-mt-32">
                        <PhaseAccordion groups={detail.phases.groups} />
                      </section>

                      {/* 3. The CEO Challenge */}
                      <section id="challenge" className="scroll-mt-28 sm:scroll-mt-32">
                        <CeoChallengeCard />
                      </section>

                      {/* 4. Industry Coverage (Only on Campus / Offline) */}
                      {!isOnline && (
                        <section id="industries" className="scroll-mt-28 sm:scroll-mt-32">
                          <IndustryCoverageSection />
                        </section>
                      )}

                      {/* 5. Career Outcomes (Roles You Can Crack) */}
                      <section id="outcomes" className="scroll-mt-28 sm:scroll-mt-32">
                        <CareerOutcomesSection roles={detail.careerRoles} />
                      </section>

                      {/* 6. Proof */}
                      <section id="proof" className="scroll-mt-28 sm:scroll-mt-32">
                        <h2 className="text-xl sm:text-2xl font-black text-[#1A0A1A]">
                          Proof &amp; Results
                        </h2>
                        <p className="mt-1.5 text-xs sm:text-sm text-[#5A4A5A]">
                          {detail.proof.description}
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {detail.proof.stats.map((st, i) => (
                            <div key={i} className="rounded-xl border border-[#F5EDE0] bg-white p-3.5 sm:p-4 text-center">
                              <p className="text-xl sm:text-2xl font-black text-[#3B0D3B]">{st.value}</p>
                              <p className="mt-1 text-[11px] sm:text-xs text-[#5A4A5A] font-medium">{st.label}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* 7. FAQs */}
                      <section id="faqs" className="scroll-mt-28 sm:scroll-mt-32">
                        <h2 className="text-xl sm:text-2xl font-black text-[#1A0A1A]">
                          FAQ
                        </h2>
                        <CategoryFaqAccordion faqs={detail.faqs} />
                      </section>

                      {/* 8. Course Perks & Inclusions */}
                      <CoursePerksBox
                        courseTitle={course.title}
                        slug={cleanSlug}
                        isLocked={isLocked}
                        perks={dbCourse?.perks}
                      />
                    </div>
                  </div>

                  {/* Sidebar on desktop / Tablet info */}
                  <CategorySidebar
                    sidebar={detail.sidebar}
                    courseTitle={course.title}
                    isLocked={isLocked}
                    className="lg:col-start-2 lg:row-start-1"
                  />
                </div>
              </Container>
            </section>

            {/* Sticky Mobile Conversion Bar on viewport bottom */}
            <MobileEnrollBar
              batch={detail.batch}
              applyLabel={detail.applyCtaLabel}
              courseTitle={course.title}
            />
          </>
        ) : null}

      </main>

      <Footer />
    </div>
  );
}
